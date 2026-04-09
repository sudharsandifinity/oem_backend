const express = require('express');
const router = express.Router();

const FormDataRoutes = require('./formDataRoutes');
const { router: NotificationRoutes } = require('./notificaitonRoutes');
const { router: DeviceTokenRoutes } = require('./deviceTokenRoutes');

router.use('/form-data', FormDataRoutes);
router.use('/notifications', NotificationRoutes);
router.use('/device-tokens', DeviceTokenRoutes);

module.exports = router;