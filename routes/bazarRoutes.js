// routes/bazarRoutes.js
const express = require('express');
const router = express.Router();
const bazarController = require('../controllers/bazarController');
const auth = require('../middlewares/auth');

router.use(auth);

// Bazar routes
router.post('/', bazarController.createBazar);
router.get('/', bazarController.getBazars);
router.put('/:id', bazarController.updateBazar);
router.delete('/:id', bazarController.deleteBazar);

module.exports = router;