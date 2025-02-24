require('dotenv').config();
const { createCheckoutSession } = require('./create_price');

async function testPayment() {
    try {
        const session = await createCheckoutSession(
            1000,
            'usd',
            'http://localhost:5000',
            { parcelId: '1' }
        );
        console.log('Payment URL:', session.url);
    } catch (error) {
        console.error('Payment error:', error);
    }
}

testPayment();