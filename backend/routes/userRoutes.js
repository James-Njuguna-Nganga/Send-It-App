const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// Protected admin routes
router.get('/all', authenticateToken, isAdmin, userController.getAllUsers);

// Protected user routes
router.get('/profile', authenticateToken, userController.getUserProfile);
router.put('/profile', authenticateToken, userController.updateUser);
router.get('/:id', authenticateToken, userController.getUser);
router.delete('/profile', authenticateToken, userController.deleteUser);
router.put('/change-password', authenticateToken, userController.changePassword);

module.exports = router;