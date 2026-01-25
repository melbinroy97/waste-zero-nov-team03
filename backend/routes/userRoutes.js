const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMe, updateMe, changePassword, getStats } = require('../controllers/userController');

// All routes below are protected
router.get('/me', authMiddleware, getMe);
router.get('/stats', authMiddleware, getStats);
router.put('/me', authMiddleware, updateMe);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;