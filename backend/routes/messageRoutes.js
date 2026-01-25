const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMessageHistory,
  getConversations,
  deleteConversation
} = require("../controllers/messageController");

const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/conversations", authMiddleware, getConversations); // New route
router.get("/:userId", authMiddleware, getMessageHistory);
router.delete("/:userId", authMiddleware, deleteConversation); // New route


module.exports = router;
