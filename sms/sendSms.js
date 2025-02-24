const AfricasTalking = require('africastalking');
const credentials = require('./smsConfig');
const express = require('express');
const router = express.Router();

const africasTalking = AfricasTalking(credentials);
const sms = africasTalking.SMS;

router.post('/send-sms', async (req, res) => {
    const { phoneNumber, parcelId, status } = req.body;

    // Ensure the phone number is in the correct international format
    const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    try {
        const message = `Your parcel #${parcelId} status has been updated to: ${status}. Track your delivery on our platform.`;

        const result = await sms.send({
            to: [formattedPhoneNumber],
            message: message
        });

        console.log('SMS sent successfully:', result);
        res.status(200).json({
            success: true,
            messageId: result.SMSMessageData.Recipients[0].messageId
        });
    } catch (error) {
        console.error('SMS sending failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send SMS notification'
        });
    }
});

module.exports = router;