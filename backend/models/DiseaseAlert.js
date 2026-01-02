const mongoose = require('mongoose');

const diseaseAlertSchema = new mongoose.Schema({
    alertType: {
        type: String,
        enum: ['outbreak', 'warning', 'advisory'],
        required: true
    },
    disease: {
        type: String,
        required: [true, 'Disease name is required'],
        trim: true
    },
    affectedSpecies: {
        type: String,
        enum: ['cow', 'buffalo', 'both'],
        required: true
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    location: {
        district: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
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
        },
        radius: {
            type: Number, // in km
            default: 20
        }
    },
    description: {
        type: String,
        required: true
    },
    source: {
        type: String,
        default: 'DADF'
    },
    actionRequired: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    affectedFarms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm'
    }],
    notificationsSent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes
diseaseAlertSchema.index({ 'location.coordinates': '2dsphere' });
diseaseAlertSchema.index({ isActive: 1, startDate: -1 });
diseaseAlertSchema.index({ affectedSpecies: 1 });
diseaseAlertSchema.index({ severity: 1 });

// Method to find affected farms within radius
diseaseAlertSchema.methods.findAffectedFarms = async function () {
    const Farm = mongoose.model('Farm');

    const farms = await Farm.find({
        'location.coordinates': {
            $near: {
                $geometry: this.location.coordinates,
                $maxDistance: this.location.radius * 1000 // Convert km to meters
            }
        },
        livestockType: this.affectedSpecies === 'both' ?
            { $in: ['cow', 'buffalo', 'both'] } :
            { $in: [this.affectedSpecies, 'both'] }
    });

    this.affectedFarms = farms.map(farm => farm._id);
    await this.save();

    return farms;
};

module.exports = mongoose.model('DiseaseAlert', diseaseAlertSchema);
