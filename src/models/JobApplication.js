const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
        required: true
    },
    status: {
        type: String,
        enum: ['applied', 'withdrawn'],
        default: 'applied'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent user from applying to the same job twice
jobApplicationSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
