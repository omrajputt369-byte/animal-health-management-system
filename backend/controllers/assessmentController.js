const RiskAssessment = require('../models/RiskAssessment');
const Farm = require('../models/Farm');
const { calculateRiskScore, generateRecommendations } = require('../services/riskCalculator');

// @desc    Create risk assessment
// @route   POST /api/v1/assessments
// @access  Private
exports.createAssessment = async (req, res, next) => {
    try {
        const { farmId, responses } = req.body;

        // Verify farm belongs to user
        const farm = await Farm.findById(farmId);
        if (!farm) {
            return res.status(404).json({
                success: false,
                message: 'Farm not found'
            });
        }

        if (farm.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Calculate risk score
        const overallRiskScore = calculateRiskScore(responses);

        // Generate recommendations
        const recommendations = generateRecommendations(responses, overallRiskScore);

        // Determine risk category
        let riskCategory;
        if (overallRiskScore >= 75) riskCategory = 'critical';
        else if (overallRiskScore >= 50) riskCategory = 'high';
        else if (overallRiskScore >= 25) riskCategory = 'medium';
        else riskCategory = 'low';

        // Create assessment
        const assessment = await RiskAssessment.create({
            farmId,
            responses,
            overallRiskScore,
            riskCategory,
            recommendations
        });

        // Update farm biosecurity score
        farm.biosecurityScore = 100 - overallRiskScore; // Inverse of risk
        farm.lastAssessmentDate = new Date();
        await farm.save();

        res.status(201).json({
            success: true,
            message: 'Risk assessment completed successfully',
            data: { assessment }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all assessments for a farm
// @route   GET /api/v1/assessments?farmId=xxx
// @access  Private
exports.getAssessments = async (req, res, next) => {
    try {
        const { farmId } = req.query;

        if (!farmId) {
            return res.status(400).json({
                success: false,
                message: 'Farm ID is required'
            });
        }

        // Verify farm belongs to user
        const farm = await Farm.findById(farmId);
        if (!farm) {
            return res.status(404).json({
                success: false,
                message: 'Farm not found'
            });
        }

        if (farm.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const assessments = await RiskAssessment.find({ farmId })
            .sort({ assessmentDate: -1 });

        res.status(200).json({
            success: true,
            count: assessments.length,
            data: { assessments }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single assessment
// @route   GET /api/v1/assessments/:id
// @access  Private
exports.getAssessment = async (req, res, next) => {
    try {
        const assessment = await RiskAssessment.findById(req.params.id)
            .populate('farmId', 'farmName livestockType');

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: 'Assessment not found'
            });
        }

        // Verify farm belongs to user
        const farm = await Farm.findById(assessment.farmId);
        if (farm.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        res.status(200).json({
            success: true,
            data: { assessment }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update recommendation status
// @route   PUT /api/v1/assessments/:id/recommendations/:recId
// @access  Private
exports.updateRecommendation = async (req, res, next) => {
    try {
        const { id, recId } = req.params;
        const { implemented } = req.body;

        const assessment = await RiskAssessment.findById(id);

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: 'Assessment not found'
            });
        }

        // Find and update recommendation
        const recommendation = assessment.recommendations.id(recId);
        if (!recommendation) {
            return res.status(404).json({
                success: false,
                message: 'Recommendation not found'
            });
        }

        recommendation.implemented = implemented;
        if (implemented) {
            recommendation.implementedDate = new Date();
        }

        await assessment.save();

        res.status(200).json({
            success: true,
            message: 'Recommendation updated successfully',
            data: { assessment }
        });
    } catch (error) {
        next(error);
    }
};
