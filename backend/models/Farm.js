const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farmName: {
        type: String,
        required: [true, 'Farm name is required'],
        trim: true
    },
    location: {
        address: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            match: [/^\d{6}$/, 'Please provide a valid 6-digit pincode']
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                index: '2dsphere'
            }
        }
    },
    farmSize: {
        type: Number, // in acres
        required: true,
        min: [0.1, 'Farm size must be at least 0.1 acres']
    },
    livestockType: {
        type: String,
        enum: ['cow', 'buffalo', 'both'],
        required: true
    },
    livestockCount: {
        cows: {
            type: Number,
            default: 0,
            min: 0
        },
        buffaloes: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    farmingType: {
        type: String,
        enum: ['commercial', 'backyard'],
        default: 'backyard'
    },
    infrastructure: {
        shedConstruction: {
            type: Boolean,
            default: false
        },
        disinfectionUnit: {
            type: Boolean,
            default: false
        },
        quarantineArea: {
            type: Boolean,
            default: false
        },
        wasteDisposal: {
            type: String,
            enum: ['proper', 'basic', 'none'],
            default: 'basic'
        },
        photos: [{
            type: String // Cloudinary URLs
        }]
    },
    biosecurityScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    complianceScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    lastAssessmentDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for performance
farmSchema.index({ userId: 1 });
farmSchema.index({ 'location.coordinates': '2dsphere' });
farmSchema.index({ livestockType: 1 });
farmSchema.index({ 'location.district': 1, 'location.state': 1 });

// Virtual for total livestock
farmSchema.virtual('totalLivestock').get(function () {
    return this.livestockCount.cows + this.livestockCount.buffaloes;
});

// Ensure virtuals are included in JSON
farmSchema.set('toJSON', { virtuals: true });
farmSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Farm', farmSchema);
