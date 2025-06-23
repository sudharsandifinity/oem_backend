const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

const sendEmail = (to, sub, text) => {
    const mailOptions = {
        from: "sudharsan@sudharsan.com",
        to,
        subject: sub,
        text: text
    };

    return transporter.sendMail(mailOptions);
};

const sendBranchAssignEmail = (to, sub, HTMLContent) => {
    const mailOptions = {
        from: "sudharsan@sudharsan.com",
        to,
        subject: sub,
        html: HTMLContent
    };

    return transporter.sendMail(mailOptions);
};


module.exports = { sendEmail, sendBranchAssignEmail };