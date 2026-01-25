const User = require('../models/User');
const Pickup = require('../models/Pickup');
const bcrypt = require('bcryptjs');

// Helper for colors
const getCategoryColor = (category) => {
    const colors = {
        'Plastic': 'hsl(217 91% 60%)',
        'Paper': 'hsl(24 93% 58%)',
        'Glass': 'hsl(142 66% 41%)',
        'Metal': 'hsl(280 65% 55%)',
        'Electronic Waste': 'hsl(0 72% 51%)',
        'Organic Waste': 'hsl(120 40% 50%)',
        'Other': 'hsl(0 0% 50%)'
    };
    return colors[category] || 'hsl(0 0% 50%)';
};

// GET /api/users/stats
const getStats = async (req, res) => {
  try {
    const pickups = await Pickup.find({ user: req.user._id });

    // Metrics
    const totalPickups = pickups.length;
    let itemsRecycled = 0;
    const breakdown = {};

    pickups.forEach(p => {
        if(p.status === 'Completed') {
            itemsRecycled += p.wasteTypes.length;
            p.wasteTypes.forEach(type => {
                breakdown[type] = (breakdown[type] || 0) + 1;
            });
        }
    });

    // Breakdown
    const recyclingBreakdown = Object.keys(breakdown).map(k => ({
        name: k,
        count: breakdown[k],
        percentage: 0,
        color: getCategoryColor(k)
    }));

     const totalItems = recyclingBreakdown.reduce((acc, curr) => acc + curr.count, 0);
    recyclingBreakdown.forEach(item => {
        item.percentage = totalItems > 0 ? Math.round((item.count / totalItems) * 100) : 0;
    });

     res.json({
        metrics: {
            totalPickups,
            pickupsTrend: 0, // No historical data yet
            itemsRecycled: itemsRecycled * 10, // Simulating quantity per type
            itemsTrend: 0,
            volunteerHours: totalPickups * 2, // Simulating 2 hours per pickup
            hoursTrend: 0,
            co2Saved: parseFloat((itemsRecycled * 2.5).toFixed(1)), // 2.5kg per item
            co2Trend: 0
        },
        recyclingBreakdown
    });

  } catch (error) {
    console.error('getStats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      location: user.location,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (err) {
    console.error('getMe error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/users/me
const updateMe = async (req, res) => {
  try {
    const { name, location, bio, skills } = req.body;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (skills) user.skills = Array.isArray(skills) ? skills : [];

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        location: user.location,
        bio: user.bio,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error('updateMe error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/users/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('changePassword error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMe,
  updateMe,
  changePassword,
  getStats
};