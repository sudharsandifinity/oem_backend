const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');

router.get('/', SAPController.getDimensions);

module.exports = router;