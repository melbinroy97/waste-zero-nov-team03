const express = require('express');
const router = express.Router();
const { 
    createPickup, 
    getMyPickups, 
    getAllPickups, 
    updatePickupStatus 
} = require('../controllers/pickupController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, createPickup);
router.get('/my', authMiddleware, getMyPickups);

// Admin / NGO routes
router.get('/', authMiddleware, roleMiddleware('ADMIN', 'NGO'), getAllPickups); 
router.put('/:id/status', authMiddleware, roleMiddleware('ADMIN', 'NGO'), updatePickupStatus);

module.exports = router;
