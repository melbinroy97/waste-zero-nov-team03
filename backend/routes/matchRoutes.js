const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getVolunteerMatches,
  getNGOMatches,
} = require("../controllers/matchController");

const router = express.Router();

/**
 * Volunteer → Get matched opportunities
 */
router.get("/", authMiddleware, getVolunteerMatches);

/**
 * NGO → Get matched volunteers for an opportunity
 */
router.get("/:opportunityId", authMiddleware, getNGOMatches);

module.exports = router;
