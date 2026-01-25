const mongoose = require('mongoose');

const PickupSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    pickupDate: {
        type: Date,
        required: [true, 'Pickup date is required']
    },
    timeSlot: {
        type: String,
        enum: ['Morning (8AM - 12PM)', 'Afternoon (12PM - 4PM)', 'Evening (4PM - 8PM)'],
        required: [true, 'Time slot is required']
    },
    wasteTypes: {
        type: [String],
        enum: ['Plastic', 'Glass', 'Metal', 'Paper', 'Organic Waste', 'Electronic Waste', 'Other'],
        default: []
    },
    notes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Pending', 'Scheduled', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    assignedDriver: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Pickup', PickupSchema);
