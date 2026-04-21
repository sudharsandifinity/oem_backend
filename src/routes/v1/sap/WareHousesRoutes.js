const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');

router.get('/', SAPController.getWarehouses);

module.exports = router;