const mongoose = require('mongoose');

const riskAssessmentSchema = new mongoose.Schema({
    farmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
    },
    assessmentDate: {
        type: Date,
        default: Date.now
    },
    questionnaireVersion: {
        type: String,
        default: '1.0'
    },
    responses: [{
        questionId: {
            type: String,
            required: true
        },
        question: {
            type: String,
            required: true
        },
        answer: {
            type: mongoose.Schema.Types.Mixed // Can be String, Number, Boolean, or Array
        },
        riskLevel: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            required: true
        }
    }],
    overallRiskScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    riskCategory: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    recommendations: [{
        priority: {
            type: String,
            enum: ['immediate', 'high', 'medium', 'low'],
            required: true
        },
        category: {
            type: String,
            required: true
        },
        recommendation: {
            type: String,
            required: true
        },
        implemented: {
            type: Boolean,
            default: false
        },
        implementedDate: {
            type: Date
        }
    }]
}, {
    timestamps: true
});

// Indexes
riskAssessmentSchema.index({ farmId: 1, assessmentDate: -1 });
riskAssessmentSchema.index({ overallRiskScore: 1 });
riskAssessmentSchema.index({ riskCategory: 1 });

// Method to calculate risk category from score
riskAssessmentSchema.methods.calculateRiskCategory = function () {
    if (this.overallRiskScore >= 75) return 'critical';
    if (this.overallRiskScore >= 50) return 'high';
    if (this.overallRiskScore >= 25) return 'medium';
    return 'low';
};

module.exports = mongoose.model('RiskAssessment', riskAssessmentSchema);
