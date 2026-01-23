const { getAllLogsList, getApprovalRequestsList, RequestResponse } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/logs', getAllLogsList);
router.get('/requests', getApprovalRequestsList);
router.patch('/response/:id', RequestResponse);

module.exports = router;