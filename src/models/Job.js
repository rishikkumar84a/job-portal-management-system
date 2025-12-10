const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a job title'],
        trim: true,
        index: true
    },
    companyName: {
        type: String,
        required: [true, 'Please add a company name'],
        trim: true,
        index: true
    },
    location: {
        type: String,
        required: [true, 'Please add a location'],
        trim: true,
        index: true
    },
    jobType: {
        type: String,
        required: [true, 'Please select a job type'],
        enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
        index: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    requirements: {
        type: String,
        required: [true, 'Please add job requirements']
    },
    salaryRange: {
        min: {
            type: Number
        },
        max: {
            type: Number
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
