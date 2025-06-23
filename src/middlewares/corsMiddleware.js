const cors = require('cors');

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // Allow non-browser clients like Postman
        const allowed = process.env.ALLOWED_ORIGINS.split(',');
        if (allowed.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

module.exports = cors(corsOptions);
