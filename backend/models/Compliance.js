const mongoose = require('mongoose');

const complianceChecklistItemSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    titleHi: {
        type: String
    },
    category: {
        type: String,
        enum: ['infrastructure', 'documentation', 'practices', 'training', 'health'],
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedDate: {
        type: Date
    },
    notes: {
        type: String
    }
});

const complianceSchema = new mongoose.Schema({
    farmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
    },
    checklistItems: [complianceChecklistItemSchema],
    overallScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    certificationStatus: {
        type: String,
        enum: ['not_started', 'in_progress', 'pending_review', 'certified'],
        default: 'not_started'
    },
    certificationDate: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for quick lookup
complianceSchema.index({ farmId: 1 });

// Method to calculate compliance score
complianceSchema.methods.calculateScore = function () {
    if (this.checklistItems.length === 0) return 0;

    const completedCount = this.checklistItems.filter(item => item.isCompleted).length;
    return Math.round((completedCount / this.checklistItems.length) * 100);
};

// Pre-save hook to update score
complianceSchema.pre('save', function (next) {
    this.overallScore = this.calculateScore();
    this.lastUpdated = new Date();

    // Update certification status based on score
    if (this.overallScore === 100) {
        this.certificationStatus = 'pending_review';
    } else if (this.overallScore > 0) {
        this.certificationStatus = 'in_progress';
    }

    next();
});

module.exports = mongoose.model('Compliance', complianceSchema);
