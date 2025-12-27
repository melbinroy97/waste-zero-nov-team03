const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    description: {
        type: String,
        default: ''
    },
    requiredSkills: {
        type: [String],
        default: []
    },
    duration: {
        type: Date,
        default: '1D',
        required: [true, 'Duration is required']
    },
    location: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Open', 'Closed', 'In-progress'],
        required: [true, 'Status is required']
    },
    NGOID: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });


const Opportunity = mongoose.model('Opportunity', OpportunitySchema);

module.exports = Opportunity;