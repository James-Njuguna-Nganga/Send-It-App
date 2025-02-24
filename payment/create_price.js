const stripe = require('stripe')('sk_test_51QsLSZP6n3bd1t1sB6QQimTkgoUGnRJuL1hfB3LqmkNLRXt1pTeKedsKoTUSSSjAlM05kyXbcm5UFCsRJKnYD6pj00gZvMhh0b');
const dotenv = require('dotenv');

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables.');
}

/**
 * Create a Stripe checkout session
 * @param {number} amount - 
 * @param {string} [currency='usd']
 * @param {string} [domain='http://localhost:5000'] 
 * @param {Object} [metadata] 
 * @returns {Promise<Object>} 
 */
const createCheckoutSession = async (
    amount,
    currency = 'usd',
    domain = 'http://localhost:5000',
    metadata = {}
) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency,
                    product_data: {
                        name: 'Parcel Delivery Fee',
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        // success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
        success_url: `http://127.0.0.1:52230/frontend/success.html?session_id={CHECKOUT_SESSION_ID}&parcel=${1}`,
        cancel_url: `${domain}/cancel`,
        metadata,
    });
    return session;
};

/**
 * Retrieve a checkout session by ID
 * @param {string} sessionId - Stripe session ID
 * @returns {Promise<Object>} Stripe checkout session
 */
const getCheckoutSession = async (sessionId) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return session;
    } catch (error) {
        throw new Error(`Failed to retrieve checkout session: ${error.message}`);
    }
};

const LOCATIONS = [
    'Nairobi',
    'Nyeri',
    'Kisumu',
    'Kiambu',
    'Narok',
    'Nanyuki',
    'Meru',
];

module.exports = {
    stripe,
    createCheckoutSession,
    getCheckoutSession,
    LOCATIONS
};