const jwt = require("jsonwebtoken");

const socketHandler = (io) => {
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        socket.disconnect();
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Join user-specific room
      socket.join(userId);
      onlineUsers.set(userId, socket.id);

      console.log("User connected:", userId);

      socket.on("disconnect", () => {
        onlineUsers.delete(userId);
        console.log("User disconnected:", userId);
      });
    } catch (err) {
      socket.disconnect();
    }
  });
};

module.exports = socketHandler; // ✅ VERY IMPORTANT
