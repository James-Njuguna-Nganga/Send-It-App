const stripe = require('stripe')('sk_test_51QsLSZP6n3bd1t1sB6QQimTkgoUGnRJuL1hfB3LqmkNLRXt1pTeKedsKoTUSSSjAlM05kyXbcm5UFCsRJKnYD6pj00gZvMhh0b');
const express = require('express');
const router = express.Router();
const path = require('path');

// Set up static file serving
router.use('/static', express.static(path.join(__dirname, '..', 'frontend')));

// Create payment session
async function createPaymentSession(parcelId, amount) {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Parcel Delivery #${parcelId}`,
                        description: 'Payment for parcel delivery service',
                    },
                    unit_amount: amount * 100, // Convert to cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `http://localhost:5000/payment/success?session_id={CHECKOUT_SESSION_ID}&parcel=${parcelId}`,
            cancel_url: `http://localhost:5000/payment/cancel?parcel=${parcelId}`,
            metadata: {
                parcelId: parcelId.toString()
            }
        });

        return session;
    } catch (error) {
        console.error('Payment session creation error:', error);
        throw error;
    }
}

// Create payment endpoint
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { parcelId, amount } = req.body;

        if (!parcelId || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Parcel ID and amount are required'
            });
        }

        const session = await createPaymentSession(parcelId, amount);

        res.json({
            success: true,
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {
        console.error('Create checkout session error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating checkout session'
        });
    }
});

// Success endpoint
router.get('/success', async (req, res) => {
    const { session_id, parcel } = req.query;

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        
        if (session.payment_status === 'paid') {
            res.redirect(`/static/payment-status.html?status=paid&parcel=${parcel}&session_id=${session_id}`);
        } else {
            res.redirect('/static/payment-status.html?status=failed');
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.redirect('/static/payment-status.html?status=failed');
    }
});

// Cancel endpoint
router.get('/cancel', (req, res) => {
    res.redirect('/static/payment-status.html?status=cancelled');
});

module.exports = router;