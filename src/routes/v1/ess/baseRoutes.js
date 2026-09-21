const { viewAttachment, getCostCenters, companySettings, sapCacheStats, sapCacheClear } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/attachments/:id/:filename/:ext', viewAttachment);
router.get('/cost-centers', getCostCenters);
router.get('/company-settings', companySettings);

router.get('/sap-cache', sapCacheStats);
router.post('/sap-cache/clear', sapCacheClear);

module.exports = router;