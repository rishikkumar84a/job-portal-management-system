const express = require('express');
const {
    getUserApplications,
    withdrawApplication
} = require('../controllers/applicationController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/me', getUserApplications);
router.delete('/:id', withdrawApplication);

module.exports = router;
