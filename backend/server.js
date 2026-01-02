const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const alertRoutes = require('./routes/alertRoutes');
const recordRoutes = require('./routes/recordRoutes');
const complianceRoutes = require('./routes/complianceRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const vetRoutes = require('./routes/vetRoutes');
const forumRoutes = require('./routes/forumRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware
app.use(helmet());
app.use(mongoSanitize()); // Prevent MongoDB injection
app.use(xss()); // Prevent XSS attacks

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Connect to MongoDB (with Memory Server fallback)
async function connectDB() {
  try {
    // Check if USE_MEMORY_DB is set or if MONGODB_URI fails
    if (process.env.USE_MEMORY_DB === 'true' || !process.env.MONGODB_URI || process.env.MONGODB_URI.includes('localhost')) {
      console.log('🚀 Starting MongoDB Memory Server...');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB Memory Server connected successfully');
      console.log('⚠️  Note: Data will be cleared when server restarts');
    } else {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ MongoDB connected successfully');
    }
  } catch (err) {
    console.log('⚠️  External MongoDB failed, falling back to Memory Server...');
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB Memory Server connected successfully (fallback)');
      console.log('⚠️  Note: Data will be cleared when server restarts');
    } catch (memErr) {
      console.error('❌ MongoDB connection error:', memErr.message);
      process.exit(1);
    }
  }
}

connectDB();

// API Routes
const apiVersion = process.env.API_VERSION || 'v1';

app.use(`/api/${apiVersion}/auth`, authRoutes);
app.use(`/api/${apiVersion}/farms`, farmRoutes);
app.use(`/api/${apiVersion}/assessments`, assessmentRoutes);
app.use(`/api/${apiVersion}/alerts`, alertRoutes);
app.use(`/api/${apiVersion}/records`, recordRoutes);
app.use(`/api/${apiVersion}/compliance`, complianceRoutes);
app.use(`/api/${apiVersion}/training`, trainingRoutes);
app.use(`/api/${apiVersion}/veterinarians`, vetRoutes);
app.use(`/api/${apiVersion}/forum`, forumRoutes);
app.use(`/api/${apiVersion}/upload`, uploadRoutes);
app.use(`/api/${apiVersion}/health`, healthRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Farm Biosecurity Management Portal API',
    version: apiVersion,
    status: 'running',
    endpoints: {
      health: `/api/${apiVersion}/health`,
      auth: `/api/${apiVersion}/auth`,
      farms: `/api/${apiVersion}/farms`,
      assessments: `/api/${apiVersion}/assessments`,
      alerts: `/api/${apiVersion}/alerts`,
      records: `/api/${apiVersion}/records`,
      compliance: `/api/${apiVersion}/compliance`,
      training: `/api/${apiVersion}/training`,
      veterinarians: `/api/${apiVersion}/veterinarians`,
      forum: `/api/${apiVersion}/forum`,
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
