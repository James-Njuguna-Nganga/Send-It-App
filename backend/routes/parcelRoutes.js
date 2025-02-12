const express = require('express');
const router = express.Router();
const { createParcel, softDeleteParcel } = require('../controllers/parcelController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, createParcel);
router.delete('/:parcelId', authenticateToken, softDeleteParcel);

module.exports = router;
