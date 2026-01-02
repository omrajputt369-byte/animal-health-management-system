const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.use(protect);

// Placeholder for file upload
// In production, integrate with Cloudinary
router.post('/', (req, res) => {
    res.json({
        success: true,
        message: 'Upload endpoint - Integrate with Cloudinary',
        data: { url: 'https://via.placeholder.com/400' }
    });
});

module.exports = router;
