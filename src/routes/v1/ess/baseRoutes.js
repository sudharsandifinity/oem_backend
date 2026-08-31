const { viewAttachment, getCostCenters } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/attachments/:id/:filename/:ext', viewAttachment);
router.get('/cost-centers', getCostCenters);

module.exports = router;