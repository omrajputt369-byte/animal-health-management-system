const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    preferredLanguage: {
        type: String,
        enum: ['en', 'hi', 'te'],
        default: 'hi'
    },
    role: {
        type: String,
        enum: ['farmer', 'veterinarian', 'admin'],
        default: 'farmer'
    },
    fcmTokens: [{
        type: String
    }],
    lastLogin: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
userSchema.index({ phone: 1 });
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update last login
userSchema.methods.updateLastLogin = async function () {
    this.lastLogin = new Date();
    await this.save();
};

module.exports = mongoose.model('User', userSchema);
