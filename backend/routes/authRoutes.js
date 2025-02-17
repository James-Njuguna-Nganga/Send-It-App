const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me',  authController.getCurrentUser);
router.post('/create-admin', authenticateToken, isAdmin, authController.createAdmin);

module.exports = router;