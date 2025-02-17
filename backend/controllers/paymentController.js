
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment session
const createCheckoutSession = async (req, res) => {
    try {
        const { parcelId, amount } = req.body;

        if (!parcelId || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Parcel ID and amount are required'
            });
        }

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
            success_url: `${process.env.FRONTEND_URL}/payment-success.html?session_id={CHECKOUT_SESSION_ID}&parcel=${parcelId}`,
            cancel_url: `${process.env.FRONTEND_URL}/dashboard.html`,
            metadata: {
                parcelId: parcelId.toString()
            }
        });

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
};

// Handle successful payments
const handlePaymentSuccess = async (req, res) => {
    const { session_id, parcel } = req.query;

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        
        if (session.payment_status === 'paid') {
            res.redirect(`/payment-success.html?parcel=${parcel}&status=paid`);
        } else {
            res.redirect('/payment-failed.html');
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.redirect('/payment-failed.html');
    }
};

// Handle cancelled payments
const handlePaymentCancel = (req, res) => {
    res.redirect('/dashboard.html');
};

module.exports = {
    createCheckoutSession,
    handlePaymentSuccess,
    handlePaymentCancel
};