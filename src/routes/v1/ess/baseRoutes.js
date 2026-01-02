const { viewAttachment } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/attachments/:id/:filename/:ext', viewAttachment);

module.exports = router;