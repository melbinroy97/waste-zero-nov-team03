const Message = require("../models/Message");
const User = require("../models/User");
const isMatched = require("../utils/isMatched");

/**
 * @desc    Send a message (only between matched users)
 * @route   POST /api/messages
 * @access  Private
 */
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    // Validate input
    if (!receiverId || !content) {
      return res.status(400).json({
        message: "receiverId and content are required",
      });
    }

    // Logged-in user (from JWT)
    const sender = await User.findById(req.user.id);
    if (!sender) {
      return res.status(401).json({ message: "Sender not found" });
    }

    // Receiver
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Match validation (Milestone 3 rule)
    const matched = await isMatched(sender, receiver);
    if (!matched) {
      return res.status(403).json({
        message: "Users are not matched",
      });
    }

    // Save message to DB
    const message = await Message.create({
      sender_id: sender._id,
      receiver_id: receiver._id,
      content,
    });

    // 🔥 REAL-TIME SOCKET EMIT
    const io = req.app.get("io");
    if (io) {
      io.to(receiver._id.toString()).emit("newMessage", {
        senderId: sender._id,
        receiverId: receiver._id,
        content: message.content,
        createdAt: message.createdAt,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({
      message: "Failed to send message",
    });
  }
};

/**
 * @desc    Get message history with another user
 * @route   GET /api/messages/:userId
 * @access  Private
 */
exports.getMessageHistory = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const currentUserId = req.user.id;

    // Fetch conversation (both directions)
    const messages = await Message.find({
      $or: [
        { sender_id: currentUserId, receiver_id: otherUserId },
        { sender_id: otherUserId, receiver_id: currentUserId },
      ],
    })
      .sort({ createdAt: 1 }) // oldest → newest
      .limit(50); // safety limit

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};
