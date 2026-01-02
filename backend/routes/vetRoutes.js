const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.use(protect);

// Placeholder routes
router.get('/', (req, res) => {
    res.json({ success: true, message: 'Veterinarian directory - Coming soon', data: { veterinarians: [] } });
});

module.exports = router;
