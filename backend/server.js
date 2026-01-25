const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();


// basic security
app.use(helmet());
app.disable('x-powered-by');

// logging (dev)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// body parser
app.use(express.json());

// CORS for frontend
// Allow typical frontend ports (3000, 8080, 5173 for Vite)
const allowedOrigins = [
  process.env.CLIENT_URL, 
  'http://localhost:3000', 
  'http://localhost:8080', 
  'http://localhost:5173'
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

// rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});

// health check
app.get('/', (req, res) => {
  res.json({ message: 'WasteZero API up and running' });
});


app.use('/api/auth', authLimiter);

// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/opportunities', require('./routes/opportunityRoutes'));
app.use("/api/matches", require("./routes/matchRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use('/api/pickups', require('./routes/pickupRoutes'));

app.use('/api/admin', require('./routes/adminRoutes'));

// global error handler (simple)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.statusCode || 500;
  const msg =
    process.env.NODE_ENV === 'production'
      ? 'Server error'
      : err.message || 'Server error';
  res.status(status).json({ message: msg });
});

const PORT = process.env.PORT || 5001;
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
});
const socketHandler = require("./socket/socket");

app.set("io", io);

socketHandler(io);


server.listen(PORT, () => {
  console.log(`Server running with Socket.io on port ${PORT}`);
});
