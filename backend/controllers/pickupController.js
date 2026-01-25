const Pickup = require('../models/Pickup');

// @desc    Create a new pickup request
// @route   POST /api/pickups
// @access  Private
exports.createPickup = async (req, res) => {
    try {
        const { address, city, pickupDate, timeSlot, wasteTypes, notes } = req.body;

        const pickup = await Pickup.create({
            user: req.user.id,
            address,
            city,
            pickupDate,
            timeSlot,
            wasteTypes,
            notes
        });

        res.status(201).json({ success: true, data: pickup });
    } catch (error) {
        console.error('Create pickup error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get current user's pickups
// @route   GET /api/pickups/my
// @access  Private
exports.getMyPickups = async (req, res) => {
    try {
        const pickups = await Pickup.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: pickups.length, data: pickups });
    } catch (error) {
        console.error('Get my pickups error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get all pickups (Admin only)
// @route   GET /api/pickups
// @access  Private/Admin
exports.getAllPickups = async (req, res) => {
    try {
        const pickups = await Pickup.find().populate('user', 'name email');
        res.status(200).json({ success: true, count: pickups.length, data: pickups });
    } catch (error) {
        console.error('Get all pickups error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update pickup status
// @route   PUT /api/pickups/:id/status
// @access  Private/Admin
exports.updatePickupStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const pickup = await Pickup.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true, runValidators: true }
        );

        if (!pickup) {
            return res.status(404).json({ success: false, message: 'Pickup not found' });
        }

        res.status(200).json({ success: true, data: pickup });
    } catch (error) {
        console.error('Update pickup status error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
