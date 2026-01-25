const Opportunity = require("../models/Opportunity");
const User = require("../models/User");

/**
 * @desc    Get matched opportunities for a Volunteer
 * @route   GET /api/matches
 * @access  Volunteer only
 */
exports.getVolunteerMatches = async (req, res) => {
  try {
    console.log(`[getVolunteerMatches] Request from user: ${req.user._id}, role: ${req.user.role}`);

    // Role check (case-insensitive)
    if (req.user.role.toUpperCase() !== "VOLUNTEER") {
      return res.status(403).json({ 
        message: `Access denied. matches are for Volunteers only. Your role is: ${req.user.role}` 
      });
    }

    const volunteer = req.user;

    // Fetch only OPEN opportunities
    const opportunities = await Opportunity.find({ status: "Open" })
      .populate("NGOID", "name location");

    const matches = opportunities.filter((opp) => {
      const skillMatch = opp.requiredSkills.some((skill) =>
        volunteer.skills.includes(skill)
      );

      const locationMatch =
        opp.location.toLowerCase() === volunteer.location.toLowerCase();

      return skillMatch && locationMatch;
    });

    res.status(200).json({
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch matches" });
  }
};

/**
 * @desc    Get matched volunteers for an NGO's opportunity
 * @route   GET /api/matches/:opportunityId
 * @access  NGO only (must own opportunity)
 */
exports.getNGOMatches = async (req, res) => {
  try {
    const { opportunityId } = req.params;

    // Find opportunity
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // NGO ownership check
    if (opportunity.NGOID.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Fetch volunteers
    const volunteers = await User.find({ role: "VOLUNTEER" });

    const matchedVolunteers = volunteers.filter((vol) => {
      const skillMatch = vol.skills.some((skill) =>
        opportunity.requiredSkills.includes(skill)
      );

      const locationMatch =
        vol.location.toLowerCase() === opportunity.location.toLowerCase();

      return skillMatch && locationMatch;
    });

    res.status(200).json({
      count: matchedVolunteers.length,
      data: matchedVolunteers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch NGO matches" });
  }
};
