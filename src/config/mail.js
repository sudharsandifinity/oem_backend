const nodemailer = require('nodemailer');

const env = (key, fallback) => {
    const value = process.env[key];
    return value === undefined || String(value).trim() === '' ? fallback : String(value).trim();
};

const SMTP_EMAIL = env('SMTP_EMAIL');
const SMTP_FROM = env('SMTP_FROM', SMTP_EMAIL);

const buildTransportOptions = () => {
    const host = env('SMTP_HOST');
    const secure = env('SMTP_SECURE', 'false').toLowerCase() === 'true';
    const base = host
        ? { host, port: Number(env('SMTP_PORT', secure ? '465' : '587')), secure, requireTLS: !secure }
        : { service: env('SMTP_SERVICE', 'gmail') };

    return { ...base, auth: { user: SMTP_EMAIL, pass: env('SMTP_PASSWORD') } };
};

const transporter = nodemailer.createTransport(buildTransportOptions());

const sendEmail = (to, sub, text) => {
    const mailOptions = {
        from: SMTP_FROM,
        to,
        subject: sub,
        text: text
    };

    return transporter.sendMail(mailOptions);
};

const sendBranchAssignEmail = (to, sub, HTMLContent) => {
    const mailOptions = {
        from: SMTP_FROM,
        to,
        subject: sub,
        html: HTMLContent
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail, sendBranchAssignEmail, transporter };
