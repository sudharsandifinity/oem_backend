const express = require('express');
const router = express.Router();
const notificationController = require('../../../controllers/notificationController');

router.post('/save-token', notificationController.saveDeviceToken);
router.post('/test', notificationController.testNotification);

module.exports = router;