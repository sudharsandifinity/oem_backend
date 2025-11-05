const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');

router.get('/sales-order', SAPController.getSOTax);
router.get('/purchase-order', SAPController.getPOTax);

module.exports = router;