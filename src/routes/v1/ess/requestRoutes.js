const { createRequest, updateMyAprvls, resubmitTExp, getTravelExpanses, getMyAprs, getTravelExpanse, getOTRequests, getOTRequest, createOTRequest, resubmitOTR, getLeaveRequests, getLeaveequest, createLeaveRequest, getLeaveTypes, resubmitLeaveReq, getAirTickets, getAirTicket, createAirTicket, resubmitAirTicket, getExpanses, getExpanse, createERequest, getAllExpType, resubmitExp, getPettyCashes, getResignations, getResignation, createResignation, resubmitResignation, listAllCertificates, listCertificatesByEmpId, addCertReq, ViewCerts, listWarnByEmpId, addWarnReq, ViewWarnLtr, LoanTypes,  createLoan, getLoans } = require('../../../controllers/ESSController');
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
router.patch('/resubmit/air-ticket/:id', upload.array('Attachments2_Lines'), resubmitAirTicket);

router.get('/expanse/types', getAllExpType);
router.get('/expanses', getExpanses);
router.get('/expanse/:id', getExpanse);
router.post('/expanse', upload.array('Attachments2_Lines'), createERequest);
router.patch('/resubmit/expanse/:id', upload.array('Attachments2_Lines'), resubmitExp);

router.get('/petty-cashes', getPettyCashes);

router.get('/resignations', getResignations);
router.get('/resignation/:id', getResignation);
router.post('/resignation', upload.array('Attachments2_Lines'), createResignation);
router.patch('/resubmit/resignation/:id', upload.array('Attachments2_Lines'), resubmitResignation);

router.get('/all-certificates', listAllCertificates);
router.get('/certificates', listCertificatesByEmpId);
router.post('/certificate', addCertReq);
router.get('/certificate/:id', ViewCerts);

router.get('/warnings', listWarnByEmpId);
router.post('/warning', addWarnReq);
router.get('/warning/:id', ViewWarnLtr);

router.get('/loan/types', LoanTypes);
router.get('/loans', getLoans);
router.post('/loan', upload.array('Attachments2_Lines'), createLoan);



module.exports = router;