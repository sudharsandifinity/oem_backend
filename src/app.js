const express = require('express');
const corsMiddleware = require('./middlewares/corsMiddleware');
const mainRoute = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const cookieParser = require('cookie-parser');

const app = express();
app.use(loggerMiddleware);
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get('/api/health', (req, res) => res.send('OK'));
app.use(mainRoute);

module.exports = app;