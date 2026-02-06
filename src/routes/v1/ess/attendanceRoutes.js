const { employeeCheckIn, employeeCheckOut, isCheckedIn, missedOutNotification, getAttandanceData, createRegularizeRequest } = require('../../../controllers/ESSController');
const regularizationResponse = require('../../../services/SAPService');
const upload = require('../../../middlewares/uploadMiddleware');
const { validate, createAttendanceRegularizationDraftSchema } = require('../../../validators/attRegulationValidation');
const reqularize_response = new regularizationResponse();

router = require('express').Router();

router.get('/data', getAttandanceData);
router.post('/check-in', employeeCheckIn);
router.patch('/check-out', employeeCheckOut);
router.get('/checkin-status', isCheckedIn);
router.get('/missed-out', missedOutNotification);
router.post('/regularize', validate(createAttendanceRegularizationDraftSchema), createRegularizeRequest);
router.patch('/approvals/:id', upload.array('Attachments2_Lines'), reqularize_response.regularizationResponse);

module.exports = router;