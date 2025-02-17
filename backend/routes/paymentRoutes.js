const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
    createCheckoutSession,
    handlePaymentSuccess,
    handlePaymentCancel
} = require('../controllers/paymentController');

router.post('/create-checkout-session', authenticateToken, createCheckoutSession);
router.get('/success', handlePaymentSuccess);
router.get('/cancel', handlePaymentCancel);

module.exports = router;