const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured in environment variables');
}

// Create checkout session route
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { amount, currency = 'usd' } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency,
                    product_data: {
                        name: 'Parcel Delivery Fee',
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/payment/cancel`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Payment session creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Success route handler
router.get('/success', async (req, res) => {
    try {
        const { session_id } = req.query;
        
        // Verify the payment was successful
        const session = await stripe.checkout.sessions.retrieve(session_id);
        
        if (session.payment_status === 'paid') {
            // Redirect to success page with session ID
            res.redirect(`/frontend/success.html?session_id=${session_id}`);
        } else {
            res.redirect('/frontend/payment-failed.html');
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.redirect('/frontend/payment-failed.html');
    }
});

// Cancel route handler
router.get('/cancel', (req, res) => {
    res.redirect('/frontend/dashboard.html');
});

module.exports = router;