const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getCompliance,
    toggleChecklistItem,
    getComplianceSummary
} = require('../controllers/complianceController');

// Protect all routes
router.use(protect);

// Get compliance checklist for a farm
router.get('/:farmId', getCompliance);

// Get compliance summary for a farm
router.get('/:farmId/summary', getComplianceSummary);

// Toggle a checklist item
router.put('/:farmId/item/:itemId', toggleChecklistItem);

module.exports = router;
