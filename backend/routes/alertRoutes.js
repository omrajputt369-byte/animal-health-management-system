const express = require('express');
const router = express.Router();
const {
    getAlerts,
    getAlert,
    getNearbyAlerts,
    acknowledgeAlert
} = require('../controllers/alertController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getAlerts);
router.get('/nearby', getNearbyAlerts);
router.get('/:id', getAlert);
router.post('/:id/acknowledge', acknowledgeAlert);

module.exports = router;
