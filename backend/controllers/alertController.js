const DiseaseAlert = require('../models/DiseaseAlert');
const Farm = require('../models/Farm');

// @desc    Get all active disease alerts
// @route   GET /api/v1/alerts
// @access  Private
exports.getAlerts = async (req, res, next) => {
    try {
        const alerts = await DiseaseAlert.find({ isActive: true })
            .sort({ startDate: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            count: alerts.length,
            data: { alerts }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single alert
// @route   GET /api/v1/alerts/:id
// @access  Private
exports.getAlert = async (req, res, next) => {
    try {
        const alert = await DiseaseAlert.findById(req.params.id);

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: 'Alert not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { alert }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get nearby alerts based on farm location
// @route   GET /api/v1/alerts/nearby?farmId=xxx
// @access  Private
exports.getNearbyAlerts = async (req, res, next) => {
    try {
        const { farmId } = req.query;

        if (!farmId) {
            return res.status(400).json({
                success: false,
                message: 'Farm ID is required'
            });
        }

        // Get farm
        const farm = await Farm.findById(farmId);

        if (!farm) {
            return res.status(404).json({
                success: false,
                message: 'Farm not found'
            });
        }

        // Verify farm belongs to user
        if (farm.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        if (!farm.location.coordinates || !farm.location.coordinates.coordinates) {
            return res.status(400).json({
                success: false,
                message: 'Farm location coordinates not set'
            });
        }

        // Find nearby alerts using geospatial query
        const alerts = await DiseaseAlert.find({
            isActive: true,
            'location.coordinates': {
                $near: {
                    $geometry: farm.location.coordinates,
                    $maxDistance: 50000 // 50km radius
                }
            },
            $or: [
                { affectedSpecies: farm.livestockType },
                { affectedSpecies: 'both' },
                { affectedSpecies: farm.livestockType === 'both' ? { $in: ['cow', 'buffalo'] } : farm.livestockType }
            ]
        }).sort({ severity: -1, startDate: -1 });

        // Calculate distance for each alert
        const alertsWithDistance = alerts.map(alert => {
            const distance = calculateDistance(
                farm.location.coordinates.coordinates,
                alert.location.coordinates.coordinates
            );

            return {
                ...alert.toObject(),
                distanceKm: Math.round(distance)
            };
        });

        res.status(200).json({
            success: true,
            count: alertsWithDistance.length,
            data: { alerts: alertsWithDistance }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Acknowledge alert (mark as read)
// @route   POST /api/v1/alerts/:id/acknowledge
// @access  Private
exports.acknowledgeAlert = async (req, res, next) => {
    try {
        const alert = await DiseaseAlert.findById(req.params.id);

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: 'Alert not found'
            });
        }

        // Here you could track which users have acknowledged the alert
        // For now, just return success

        res.status(200).json({
            success: true,
            message: 'Alert acknowledged'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Array} coord1 - [longitude, latitude]
 * @param {Array} coord2 - [longitude, latitude]
 * @returns {Number} Distance in kilometers
 */
function calculateDistance(coord1, coord2) {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}
