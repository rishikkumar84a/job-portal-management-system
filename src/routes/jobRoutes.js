const express = require('express');
const {
    createJob,
    getJobs,
    getJob,
    updateJob,
    deleteJob
} = require('../controllers/jobController');
const { applyForJob } = require('../controllers/applicationController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router
    .route('/')
    .get(getJobs)
    .post(protect, authorize('admin'), createJob);

router
    .route('/:id')
    .get(getJob)
    .put(protect, authorize('admin'), updateJob)
    .delete(protect, authorize('admin'), deleteJob);

router.post('/:id/apply', protect, authorize('candidate'), applyForJob);

module.exports = router;
