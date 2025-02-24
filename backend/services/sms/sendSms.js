const AfricasTalking = require('africastalking');
const credentials = require('../../config/smsConfig');

const africasTalking = AfricasTalking(credentials);
const sms = africasTalking.SMS;

const sendParcelStatusSMS = async (phoneNumber, parcelId, status) => {
    try {
        const message = `Your parcel #${parcelId} status has been updated to: ${status}. Track your delivery on our platform.`;
        
        const result = await sms.send({
            to: phoneNumber,
            message: message,
            // from: credentials.shortCode
        });

        console.log('SMS sent successfully:', result);
        return {
            success: true,
            messageId: result.SMSMessageData.Recipients[0].messageId
        };
    } catch (error) {
        console.error('SMS sending failed:', error);
        throw new Error('Failed to send SMS notification');
    }
};

module.exports = {
    sendParcelStatusSMS
};