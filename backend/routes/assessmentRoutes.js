const express = require('express');
const router = express.Router();
const {
    createAssessment,
    getAssessments,
    getAssessment,
    updateRecommendation
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .post(createAssessment)
    .get(getAssessments);

router.get('/:id', getAssessment);
router.put('/:id/recommendations/:recId', updateRecommendation);

module.exports = router;
