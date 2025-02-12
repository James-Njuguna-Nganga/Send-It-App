const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// User routes
router.get('/profile', authenticateToken, userController.getUserProfile);
router.get('/:id',userController.getUser);
router.put('/profile', authenticateToken, userController.updateUser);

// Admin routes
router.get('/all', authenticateToken, isAdmin, userController.getAllUsers);

module.exports = router;