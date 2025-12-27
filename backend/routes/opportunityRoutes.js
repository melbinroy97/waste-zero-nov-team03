const express = require('express');
const {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity
} = require('../controllers/opportunityController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Create opportunity (NGO only)
router.post('/', authMiddleware, roleMiddleware('NGO'), createOpportunity);

// Get all opportunities (any logged-in user)
router.get('/', authMiddleware, getAllOpportunities);

// Get opportunity by ID
router.get('/:id', authMiddleware, getOpportunityById);

// Update opportunity (NGO only)
router.put('/:id', authMiddleware, roleMiddleware('NGO'), updateOpportunity);

// Delete opportunity (NGO only)
router.delete('/:id', authMiddleware, roleMiddleware('NGO'), deleteOpportunity);

module.exports = router;