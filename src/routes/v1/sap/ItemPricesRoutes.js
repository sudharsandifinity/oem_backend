const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');

router.get('/', SAPController.getItemPrices);

module.exports = router;