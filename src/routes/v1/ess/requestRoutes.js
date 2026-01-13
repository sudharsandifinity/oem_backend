const { createRequest, updateMyAprvls, resubmitTExp, getTravelExpanses, getMyAprs, getTravelExpanse, getOTRequests, getOTRequest, createOTRequest, resubmitOTR, getLeaveRequests, getLeaveequest, createLeaveRequest, getLeaveTypes, resubmitLeaveReq, getAirTickets, getAirTicket, createAirTicket, resubmitAirTicket, getExpanses, getExpanse, createERequest, getAllExpType, resubmitExp } = require('../../../controllers/ESSController');
const upload = require('../../../middlewares/uploadMiddleware');

router = require('express').Router();

router.get('/travel-expanse', getTravelExpanses);
router.get('/travel-expanse/:id', getTravelExpanse);
router.post('/travel-expanse', upload.array('Attachments2_Lines'), createRequest);
router.patch('/resubmit/travel-expanse/:id', upload.array('Attachments2_Lines'), resubmitTExp);

router.get('/pending', getMyAprs);
router.patch('/approvals/:id', upload.array('Attachments2_Lines'), updateMyAprvls);

router.get('/ot-requests', getOTRequests);
router.get('/ot-requests/:id', getOTRequest);
router.post('/ot-requests', upload.array('Attachments2_Lines'), createOTRequest);
router.patch('/resubmit/ot-requests/:id', upload.array('Attachments2_Lines'), resubmitOTR);

router.get('/leave-types', getLeaveTypes);
router.get('/leave-requests', getLeaveRequests);
router.get('/leave-requests/:id', getLeaveequest);
router.post('/leave-requests', upload.array('Attachments2_Lines'), createLeaveRequest);
router.patch('/resubmit/leave-request/:id', upload.array('Attachments2_Lines'), resubmitLeaveReq);

router.get('/air-tickets', getAirTickets);
router.get('/air-ticket/:id', getAirTicket);
router.post('/air-ticket', upload.array('Attachments2_Lines'), createAirTicket);
router.patch('/resubmit/leave-request/:id', upload.array('Attachments2_Lines'), resubmitAirTicket);

router.get('/expanse/types', getAllExpType);
router.get('/expanses', getExpanses);
router.get('/expanse/:id', getExpanse);
router.post('/expanse', upload.array('Attachments2_Lines'), createERequest);
router.patch('/resubmit/expanse/:id', upload.array('Attachments2_Lines'), resubmitExp);

module.exports = router;