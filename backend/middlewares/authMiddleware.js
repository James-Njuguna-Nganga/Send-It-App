const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Check JWT_SECRET configuration
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is missing in environment variables');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verification successful:', {
            userId: decoded.id,
            role: decoded.role,
            isAdmin: decoded.isAdmin
        });

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        console.log('Checking admin privileges for user:', req.user);
        
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }

        console.log('Admin access granted');
        next();
    } catch (error) {
        console.error('Admin check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error checking admin privileges'
        });
    }
};

module.exports = {
    authenticateToken,
    isAdmin
};