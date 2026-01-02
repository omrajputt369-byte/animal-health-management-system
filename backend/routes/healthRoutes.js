const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        environment: process.env.NODE_ENV,
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        version: process.env.API_VERSION || 'v1'
    };

    try {
        res.status(200).json(healthcheck);
    } catch (error) {
        healthcheck.message = error.message;
        res.status(503).json(healthcheck);
    }
});

module.exports = router;
