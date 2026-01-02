const express = require('express');
const router = express.Router();
const {
    createFarm,
    getFarms,
    getFarm,
    updateFarm,
    deleteFarm,
    uploadFarmPhotos
} = require('../controllers/farmController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
    .get(getFarms)
    .post(createFarm);

router.route('/:id')
    .get(getFarm)
    .put(updateFarm)
    .delete(deleteFarm);

router.post('/:id/photos', uploadFarmPhotos);

module.exports = router;
