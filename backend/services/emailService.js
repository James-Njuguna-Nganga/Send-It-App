const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.sendWelcomeEmail = (email) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Welcome to Send-It',
        text: 'Thank you for registering with Send-It!'
    };
    transporter.sendMail(mailOptions);
};

exports.sendStatusUpdateEmail = (email, status) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Parcel Status Update',
        text: `Your parcel status has been updated to: ${status}`
    };
    transporter.sendMail(mailOptions);
};