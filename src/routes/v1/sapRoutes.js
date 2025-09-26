const router = require('express').Router();
const SAPController = require('../../controllers/SAPController');

router.get('/business-partners', SAPController.getBusinessPartners);

module.exports = router;