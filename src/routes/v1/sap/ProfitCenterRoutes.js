const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');

router.get('/', SAPController.getProfitCenters);

module.exports = router;