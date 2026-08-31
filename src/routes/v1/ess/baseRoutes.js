const { viewAttachment, getCostCenters, companySettings } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/attachments/:id/:filename/:ext', viewAttachment);
router.get('/cost-centers', getCostCenters);
router.get('/company-settings', companySettings);

module.exports = router;