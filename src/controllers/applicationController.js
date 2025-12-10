const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Candidate)
exports.applyForJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return next(new ApiError(404, `Job not found with id of ${req.params.id}`));
        }

        // Check if user already applied
        const existingApplication = await JobApplication.findOne({
            user: req.user.id,
            job: req.params.id
        });

        if (existingApplication) {
            return next(new ApiError(400, 'You have already applied for this job'));
        }

        const application = await JobApplication.create({
            user: req.user.id,
            job: req.params.id,
            status: 'applied'
        });

        res.status(201).json(new ApiResponse(true, application, 'Application submitted successfully'));
    } catch (err) {
        next(err);
    }
};

// @desc    Get current user's applications
// @route   GET /api/applications/me
// @access  Private
exports.getUserApplications = async (req, res, next) => {
    try {
        const applications = await JobApplication.find({ user: req.user.id })
            .populate('job', 'title companyName location');

        res.status(200).json(new ApiResponse(true, applications));
    } catch (err) {
        next(err);
    }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private
exports.withdrawApplication = async (req, res, next) => {
    try {
        const application = await JobApplication.findById(req.params.id);

        if (!application) {
            return next(new ApiError(404, `Application not found with id of ${req.params.id}`));
        }

        // Make sure user owns the application
        if (application.user.toString() !== req.user.id) {
            return next(new ApiError(403, 'User not authorized to withdraw this application'));
        }

        // Option 1: Delete
        // await application.deleteOne();

        // Option 2: Update status to 'withdrawn'
        application.status = 'withdrawn';
        await application.save();

        res.status(200).json(new ApiResponse(true, application, 'Application withdrawn successfully'));
    } catch (err) {
        next(err);
    }
};
