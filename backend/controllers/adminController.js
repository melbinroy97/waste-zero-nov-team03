const User = require("../models/User");
const Opportunity = require("../models/Opportunity");
const AdminLog = require("../models/AdminLog");

/* ===============================
   DASHBOARD OVERVIEW
================================ */
exports.getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeVolunteers = await User.countDocuments({
      role: "VOLUNTEER",
      status: "ACTIVE",
    });
    const activeNGOs = await User.countDocuments({
      role: "NGO",
      status: "ACTIVE",
    });
    const totalOpportunities = await Opportunity.countDocuments();

    const recentActivities = await AdminLog.find()
      .populate("adminId", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      activeVolunteers,
      activeNGOs,
      totalOpportunities,
      recentActivities,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load overview" });
  }
};

/* ===============================
   USER MANAGEMENT
================================ */
exports.getUsers = async (req, res) => {
  try {
    const { role, status } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["ACTIVE", "SUSPENDED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (req.user.id === req.params.id) {
      return res
        .status(400)
        .json({ message: "Admin cannot modify own account" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    await AdminLog.create({
      action: "UPDATE_USER_STATUS",
      adminId: req.user.id,
      targetId: user._id,
      metadata: { status },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status" });
  }
};

/* ===============================
   OPPORTUNITY MODERATION
================================ */
exports.getOpportunities = async (req, res) => {
  try {
    const { status, location } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (location) filter.location = location;

    const opportunities = await Opportunity.find(filter).populate(
      "NGOID",
      "name location"
    );

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch opportunities" });
  }
};

exports.deleteOpportunity = async (req, res) => {
  try {
    await Opportunity.findByIdAndDelete(req.params.id);

    await AdminLog.create({
      action: "DELETE_OPPORTUNITY",
      adminId: req.user.id,
      targetId: req.params.id,
    });

    res.json({ message: "Opportunity deleted by admin" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete opportunity" });
  }
};

/* ===============================
   REPORTS & ANALYTICS
================================ */
exports.getReports = async (req, res) => {
  try {
    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const opportunitiesByStatus = await Opportunity.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      usersByRole,
      opportunitiesByStatus,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate reports" });
  }
};

/* ===============================
   ADMIN LOGS
================================ */
exports.getLogs = async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .populate("adminId", "name email")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};
