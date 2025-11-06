const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');

router.get('/freights', SAPController.getFreight);

module.exports = router;