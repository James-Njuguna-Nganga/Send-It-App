const express = require('express');
const router = express.Router();
const parcelController = require('../controllers/parcelController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// Protected routes
router.post('/', authenticateToken, parcelController.createParcel);
router.get('/all', authenticateToken, isAdmin, parcelController.getAllParcels);
router.get('/user', authenticateToken, parcelController.getUserParcels);
router.get('/:parcelId', authenticateToken, parcelController.getParcelById);
router.put('/:parcelId', authenticateToken, parcelController.updateParcel);
router.put('/:parcelId/status', authenticateToken, isAdmin, parcelController.updateParcelStatus);
router.delete('/:parcelId', authenticateToken, parcelController.softDeleteParcel);

module.exports = router;