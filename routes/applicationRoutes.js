// routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middlewares/auth');

router.use(auth);

// Application routes
router.put('/:applicationId/status', applicationController.updateApplicationStatus);
router.get('/:bazarId/applications', applicationController.getApplications);
router.post('/:bazarId/apply', applicationController.applyToBazar);

module.exports = router;