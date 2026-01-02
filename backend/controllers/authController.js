const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { phone, email, password, name, preferredLanguage } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this phone number already exists'
            });
        }

        // Create user
        const user = await User.create({
            phone,
            email,
            password,
            name,
            preferredLanguage: preferredLanguage || 'hi'
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    preferredLanguage: user.preferredLanguage,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { phone, password } = req.body;

        // Validate input
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide phone number and password'
            });
        }

        // Find user with password
        const user = await User.findOne({ phone }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        await user.updateLastLogin();

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    preferredLanguage: user.preferredLanguage,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    try {
        // Client should remove token from localStorage/cookies
        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    preferredLanguage: user.preferredLanguage,
                    role: user.role,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, email, preferredLanguage } = req.body;

        const fieldsToUpdate = {};
        if (name) fieldsToUpdate.name = name;
        if (email) fieldsToUpdate.email = email;
        if (preferredLanguage) fieldsToUpdate.preferredLanguage = preferredLanguage;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    preferredLanguage: user.preferredLanguage,
                    role: user.role
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update FCM token for push notifications
// @route   POST /api/v1/auth/fcm-token
// @access  Private
exports.updateFCMToken = async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'FCM token is required'
            });
        }

        const user = await User.findById(req.user.id);

        // Add token if not already present
        if (!user.fcmTokens.includes(token)) {
            user.fcmTokens.push(token);
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: 'FCM token updated successfully'
        });
    } catch (error) {
        next(error);
    }
};
