const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMessageHistory
} = require("../controllers/messageController");

const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/:userId", authMiddleware, getMessageHistory);


module.exports = router;
