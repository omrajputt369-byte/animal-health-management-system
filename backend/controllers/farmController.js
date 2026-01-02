const Farm = require('../models/Farm');

// @desc    Create new farm
// @route   POST /api/v1/farms
// @access  Private
exports.createFarm = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.userId = req.user.id;

        const farm = await Farm.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Farm created successfully',
            data: { farm }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all farms for logged in user
// @route   GET /api/v1/farms
// @access  Private
exports.getFarms = async (req, res, next) => {
    try {
        const farms = await Farm.find({ userId: req.user.id, isActive: true });

        res.status(200).json({
            success: true,
            count: farms.length,
            data: { farms }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single farm
// @route   GET /api/v1/farms/:id
// @access  Private
exports.getFarm = async (req, res, next) => {
    try {
        const farm = await Farm.findById(req.params.id);

        if (!farm) {
            return res.status(404).json({
                success: false,
                message: 'Farm not found'
            });
        }

        // Make sure user owns the farm
        if (farm.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this farm'
            });
        }

        res.status(200).json({
            success: true,
            data: { farm }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update farm
// @route   PUT /api/v1/farms/:id
// @access  Private
exports.updateFarm = async (req, res, next) => {
    try {
        let farm = await Farm.findById(req.params.id);

        if (!farm) {
            return res.status(404).json({
                success: false,
                message: 'Farm not found'
            });
        }

        // Make sure user owns the farm
        if (farm.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this farm'
            });
        }

        farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Farm updated successfully',
            data: { farm }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete farm
// @route   DELETE /api/v1/farms/:id
// @access  Private
exports.deleteFarm = async (req, res, next) => {
    try {
        const farm = await Farm.findById(req.params.id);

        if (!farm) {
            return res.status(404).json({
                success: false,
                message: 'Farm not found'
            });
        }

        // Make sure user owns the farm
        if (farm.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this farm'
            });
        }

        // Soft delete
        farm.isActive = false;
        await farm.save();

        res.status(200).json({
            success: true,
            message: 'Farm deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload farm photos
// @route   POST /api/v1/farms/:id/photos
// @access  Private
exports.uploadFarmPhotos = async (req, res, next) => {
    try {
        const farm = await Farm.findById(req.params.id);

        if (!farm) {
            return res.status(404).json({
                success: false,
                message: 'Farm not found'
            });
        }

        // Make sure user owns the farm
        if (farm.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to upload photos for this farm'
            });
        }

        const { photos } = req.body; // Array of Cloudinary URLs from frontend

        if (!photos || !Array.isArray(photos)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide photos array'
            });
        }

        // Add photos to farm
        farm.infrastructure.photos.push(...photos);
        await farm.save();

        res.status(200).json({
            success: true,
            message: 'Photos uploaded successfully',
            data: { farm }
        });
    } catch (error) {
        next(error);
    }
};
