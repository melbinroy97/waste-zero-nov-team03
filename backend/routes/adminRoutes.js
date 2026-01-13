const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const adminController = require("../controllers/adminController");

const router = express.Router();

// Dashboard
router.get("/overview", authMiddleware, adminMiddleware, adminController.getOverview);

// Users
router.get("/users", authMiddleware, adminMiddleware, adminController.getUsers);
router.patch(
  "/users/:id/status",
  authMiddleware,
  adminMiddleware,
  adminController.updateUserStatus
);

// Opportunities
router.get(
  "/opportunities",
  authMiddleware,
  adminMiddleware,
  adminController.getOpportunities
);
router.delete(
  "/opportunities/:id",
  authMiddleware,
  adminMiddleware,
  adminController.deleteOpportunity
);

// Reports & Logs
router.get("/reports", authMiddleware, adminMiddleware, adminController.getReports);
router.get("/logs", authMiddleware, adminMiddleware, adminController.getLogs);

module.exports = router;
