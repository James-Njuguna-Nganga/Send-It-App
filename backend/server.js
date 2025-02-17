require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection } = require('./config/db');
const { authenticateToken } = require('./middlewares/authMiddleware');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Check if .env file exists
const envPath = path.resolve(__dirname, '.env');
if (!require('fs').existsSync(envPath)) {
    console.error('.env file not found. Please create one based on .env.example');
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Environment validation with detailed logging
const requiredEnvVars = ['JWT_SECRET', 'DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(varName => {
    const exists = !!process.env[varName];
    if (!exists) {
        console.error(`Missing ${varName} in environment variables`);
    }
    return !exists;
});

if (missingEnvVars.length > 0) {
    console.error('Environment configuration error:');
    console.error('Missing required variables:', missingEnvVars);
    console.error('Please check your .env file');
    process.exit(1);
}

// Log successful environment loading
console.log('Environment variables loaded successfully');
console.log('Database:', process.env.DB_NAME);
console.log('Server:', process.env.DB_SERVER);

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const parcelRoutes = require('./routes/parcelRoutes');

// Debug routes for development
if (process.env.NODE_ENV === 'development') {
    app.get('/api/debug/config', (req, res) => {
        res.json({
            environment: process.env.NODE_ENV,
            jwtConfigured: !!process.env.JWT_SECRET,
            databaseConfigured: {
                server: !!process.env.DB_SERVER,
                database: !!process.env.DB_NAME,
                user: !!process.env.DB_USER,
                password: !!process.env.DB_PASSWORD
            }
        });
    });

    app.get('/api/debug/auth', authenticateToken, (req, res) => {
        res.json({
            authenticated: true,
            user: {
                id: req.user.id,
                role: req.user.role,
                isAdmin: req.user.isAdmin
            }
        });
    });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/api/payments', paymentRoutes);

// Basic route for API health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Test database connection before starting server
        console.log('Testing database connection...');
        const isConnected = await testConnection();
        
        if (!isConnected) {
            throw new Error('Database connection test failed');
        }

        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log(`Server Status:`);
            console.log('-'.repeat(50));
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
            console.log(`📚 Database: ${process.env.DB_NAME}`);
            console.log(`🔒 JWT: Configured`);
            console.log('='.repeat(50));
        });
    } catch (error) {
        console.error('Server startup error:', error.message);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

startServer();