const Job = require('../models/Job');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Admin)
exports.createJob = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.createdBy = req.user.id;

        const job = await Job.create(req.body);

        res.status(201).json(new ApiResponse(true, job, 'Job created successfully'));
    } catch (err) {
        next(err);
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
    try {
        // Advanced filtering
        let query;
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Finding resource
        query = Job.find(JSON.parse(queryStr));

        // Search by title (partial match)
        if (req.query.title) {
            query = query.find({ title: { $regex: req.query.title, $options: 'i' } });
        }
        // Search by company (partial match)
        if (req.query.company) {
            query = query.find({ companyName: { $regex: req.query.company, $options: 'i' } });
        }
        // Search by location
        if (req.query.location) {
            query = query.find({ location: { $regex: req.query.location, $options: 'i' } });
        }
        // Search by jobType
        if (req.query.jobType) {
            query = query.find({ jobType: req.query.jobType });
        }


        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Job.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const jobs = await query;

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        pagination.total = total;
        pagination.totalPages = Math.ceil(total / limit);

        res.status(200).json(new ApiResponse(true, { jobs, pagination }));
    } catch (err) {
        next(err);
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id).populate('createdBy', 'name email');

        if (!job) {
            return next(new ApiError(404, `Job not found with id of ${req.params.id}`));
        }

        res.status(200).json(new ApiResponse(true, job));
    } catch (err) {
        next(err);
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Admin)
exports.updateJob = async (req, res, next) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return next(new ApiError(404, `Job not found with id of ${req.params.id}`));
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json(new ApiResponse(true, job, 'Job updated successfully'));
    } catch (err) {
        next(err);
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Admin)
exports.deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return next(new ApiError(404, `Job not found with id of ${req.params.id}`));
        }

        await job.deleteOne();

        res.status(200).json(new ApiResponse(true, {}, 'Job deleted successfully'));
    } catch (err) {
        next(err);
    }
};
