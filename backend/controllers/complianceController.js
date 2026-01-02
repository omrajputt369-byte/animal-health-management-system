const Compliance = require('../models/Compliance');
const Farm = require('../models/Farm');
const complianceChecklist = require('../data/complianceChecklist.json');

// @desc    Get compliance checklist for a farm
// @route   GET /api/v1/compliance/:farmId
// @access  Private
exports.getCompliance = async (req, res) => {
    try {
        const { farmId } = req.params;

        // Find existing compliance or create new one
        let compliance = await Compliance.findOne({ farmId });

        if (!compliance) {
            // Initialize new compliance with default checklist
            compliance = await Compliance.create({
                farmId,
                checklistItems: complianceChecklist.map(item => ({
                    itemId: item.itemId,
                    title: item.title,
                    titleHi: item.titleHi,
                    category: item.category,
                    isCompleted: false
                }))
            });
        }

        // Update farm's compliance score
        await Farm.findByIdAndUpdate(farmId, {
            complianceScore: compliance.overallScore
        });

        res.status(200).json({
            success: true,
            data: {
                compliance,
                availableChecklist: complianceChecklist
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Toggle a checklist item completion
// @route   PUT /api/v1/compliance/:farmId/item/:itemId
// @access  Private
exports.toggleChecklistItem = async (req, res) => {
    try {
        const { farmId, itemId } = req.params;
        const { notes } = req.body;

        let compliance = await Compliance.findOne({ farmId });

        if (!compliance) {
            return res.status(404).json({
                success: false,
                message: 'Compliance record not found'
            });
        }

        // Find and toggle the item
        const itemIndex = compliance.checklistItems.findIndex(
            item => item.itemId === itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Checklist item not found'
            });
        }

        // Toggle completion status
        compliance.checklistItems[itemIndex].isCompleted =
            !compliance.checklistItems[itemIndex].isCompleted;

        // Update completion date if completed
        if (compliance.checklistItems[itemIndex].isCompleted) {
            compliance.checklistItems[itemIndex].completedDate = new Date();
        } else {
            compliance.checklistItems[itemIndex].completedDate = null;
        }

        // Add notes if provided
        if (notes) {
            compliance.checklistItems[itemIndex].notes = notes;
        }

        await compliance.save();

        // Update farm's compliance score
        await Farm.findByIdAndUpdate(farmId, {
            complianceScore: compliance.overallScore
        });

        res.status(200).json({
            success: true,
            data: {
                compliance,
                updatedItem: compliance.checklistItems[itemIndex]
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get compliance summary/stats
// @route   GET /api/v1/compliance/:farmId/summary
// @access  Private
exports.getComplianceSummary = async (req, res) => {
    try {
        const { farmId } = req.params;

        const compliance = await Compliance.findOne({ farmId });

        if (!compliance) {
            return res.status(200).json({
                success: true,
                data: {
                    score: 0,
                    completedCount: 0,
                    totalCount: complianceChecklist.length,
                    status: 'not_started'
                }
            });
        }

        const completedCount = compliance.checklistItems.filter(
            item => item.isCompleted
        ).length;

        res.status(200).json({
            success: true,
            data: {
                score: compliance.overallScore,
                completedCount,
                totalCount: compliance.checklistItems.length,
                status: compliance.certificationStatus,
                lastUpdated: compliance.lastUpdated
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
