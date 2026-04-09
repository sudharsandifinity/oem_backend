const router = require('express').Router();
const DeviceTokenRepository = require('../../../repositories/DeviceTokenRepository');
const DeviceTokenService = require('../../../services/DeviceTokenService');
const DeviceTokenController = require('../../../controllers/DeviceTokenController');

const deviceTokenRepository = new DeviceTokenRepository();
const deviceTokenService = new DeviceTokenService(deviceTokenRepository);
const deviceTokenController = new DeviceTokenController(deviceTokenService);

// router.get('/all', deviceTokenController.getAll);
// router.get('/:id', deviceTokenController.getById);
router.post('/', deviceTokenController.create);
router.patch('/:id', deviceTokenController.update);

module.exports = { router };