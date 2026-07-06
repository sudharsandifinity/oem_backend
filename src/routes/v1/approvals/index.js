const router = require('express').Router();
const ApprovalController = require('../../../controllers/ApprovalController');

const approvalController = new ApprovalController();

router.get('/my-pending', approvalController.myPending);
router.get('/my-sent-back', approvalController.mySentBack);
router.get('/requests/:id', approvalController.getRequest);
router.post('/requests/:id/approve', approvalController.approve);
router.post('/requests/:id/reject', approvalController.reject);
router.post('/requests/:id/resubmit', approvalController.resubmit);

module.exports = router;
