const mongoose = require('mongoose');
const Opportunity = require('../models/Opportunity');

 const createOpportunity = async (req, res) => {
    try {
        const {
            title,
            description,
            requiredSkills,
            duration,
            location,
            status,
        } = req.body;

        const NGOID = req.user._id;

        if (!title || !status || !duration) {
            return res.status(400).json({ success: false, message: "Title, status and duration is required" });
        }

        const opportunity = await Opportunity.create({
            title,
            description,
            requiredSkills,
            duration,
            location,
            status,
            NGOID,
        });

        return res.status(201).json({
            success: true,
            message: "Opportunity created successfully",
            opportunity,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error, opportunity cannot be created" });
    }
}

 const getAllOpportunities = async (req, res) => {
    try {
        const { location, skills, status } = req.query;

        const filter = {};

        // If user is NGO, only show their own opportunities
        if (req.user && req.user.role === 'NGO') {
            filter.NGOID = req.user._id;
        }

        // Filter by location
        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }

        // Filter by status
        if (status) {
            filter.status = status;
        }

        // Filter by skills
        if (skills) {
            // skills=react,node,express
            const skillsArray = skills.split(",");
            filter.requiredSkills = { $in: skillsArray };
        }

        const opportunities = await Opportunity.find(filter)
            .populate({
                path: "NGOID",
                select: "name location", // NGO name & location
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: opportunities.length,
            data: opportunities,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch opportunities",
            error: error.message,
        });
    }
};

 const getOpportunityById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId (prevents server crash)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid opportunity ID",
            });
        }

        const opportunity = await Opportunity.findById(id).populate({
            path: "NGOID",
            select: "name email location phone",
        });

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: "Opportunity not found",
            });
        }

        res.status(200).json({
            success: true,
            data: opportunity,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch opportunity",
            error: error.message,
        });
    }
};

 const updateOpportunity = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid opportunity ID",
            });
        }

        const opportunity = await Opportunity.findById(id);

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: "Opportunity not found",
            });
        }

        // Authorization: only owning NGO can update
        if (opportunity.NGOID.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this opportunity",
            });
        }

        // Whitelist allowed fields
        const allowedFields = [
            "title",
            "description",
            "requiredSkills",
            "duration",
            "location",
            "status",
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update",
            });
        }

        const updatedOpportunity = await Opportunity.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Opportunity updated successfully",
            data: updatedOpportunity,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update opportunity",
            error: error.message,
        });
    }
};

 const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid opportunity ID",
      });
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found",
      });
    }

    // Authorization: only owning NGO can delete
    if (opportunity.NGOID.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this opportunity",
      });
    }

    await opportunity.deleteOne();

    res.status(200).json({
      success: true,
      message: "Opportunity deleted successfully",
      data: {
        id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete opportunity",
      error: error.message,
    });
  }
};
module.exports = {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity
};