const express = require('express');
const { createParcel, updateParcelStatus, getParcelsByUser } = require('../controllers/parcelController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticateToken, createParcel);
router.put('/status', authenticateToken, updateParcelStatus);
router.get('/:userId', authenticateToken, getParcelsByUser);

module.exports = router;