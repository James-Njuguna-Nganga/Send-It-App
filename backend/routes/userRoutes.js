const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;
