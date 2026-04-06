const router = require('express').Router();
const NotificationRepository = require('../../../repositories/NotificationRepository');
const NotificationService = require('../../../services/NotificationService');
const NotificationController = require('../../../controllers/NotificationController');

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

router.get('/', notificationController.getAll);
router.get('/:id', notificationController.getById);
router.post('/', notificationController.create);

module.exports = { router, notificationService };