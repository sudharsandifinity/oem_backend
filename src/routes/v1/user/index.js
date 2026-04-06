const express = require('express');
const router = express.Router();

const FormDataRoutes = require('./formDataRoutes');
const { router: NotificationRoutes } = require('./notificaitonRoutes');

router.use('/form-data', FormDataRoutes);
router.use('/notifications', NotificationRoutes);

module.exports = router;