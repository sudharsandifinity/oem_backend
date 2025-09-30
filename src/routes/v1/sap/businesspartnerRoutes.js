const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');

router.get('/customers', SAPController.getBusinessPartners);
router.get('/vendors', SAPController.getVendors);

module.exports = router;