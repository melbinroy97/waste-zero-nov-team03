const Message = require("../models/Message");
const User = require("../models/User");
const isMatched = require("../utils/isMatched");
const mongoose = require("mongoose");

/**
 * @desc    Get list of users the current user has had conversations with
 * @route   GET /api/messages/conversations/list
 * @access  Private
 */
exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Aggregation to find all unique users communicated with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender_id: new mongoose.Types.ObjectId(currentUserId) },
            { receiver_id: new mongoose.Types.ObjectId(currentUserId) },
          ],
          deletedFor: { $ne: new mongoose.Types.ObjectId(currentUserId) }, // Filter out deleted messages
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender_id", new mongoose.Types.ObjectId(currentUserId)] },
              "$receiver_id",
              "$sender_id",
            ],
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 1,
          "userDetails.name": 1,
          "userDetails.role": 1,
          "userDetails.email": 1,
          "lastMessage._id": 1,
          "lastMessage.content": 1,
          "lastMessage.createdAt": 1,
          "lastMessage.read": 1,
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    return res.status(500).json({
      message: "Failed to fetch conversations",
    });
  }
};

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
      $and: [
        {
          $or: [
            { sender_id: currentUserId, receiver_id: otherUserId },
            { sender_id: otherUserId, receiver_id: currentUserId },
          ],
        },
        { deletedFor: { $ne: currentUserId } },
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

/**
 * @desc    Delete conversation (clear history for current user)
 * @route   DELETE /api/messages/:userId
 * @access  Private
 */
exports.deleteConversation = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user.id;

    // Soft delete: Add current user ID to deletedFor array
    await Message.updateMany(
      {
        $or: [
          { sender_id: currentUserId, receiver_id: targetUserId },
          { sender_id: targetUserId, receiver_id: currentUserId },
        ],
      },
      {
        $addToSet: { deletedFor: currentUserId },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return res.status(500).json({
      message: "Failed to delete conversation",
    });
  }
};
