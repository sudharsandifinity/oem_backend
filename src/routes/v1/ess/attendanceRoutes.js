const { employeeCheckIn, employeeCheckOut, isCheckedIn, missedOutNotification, getAttandanceData, createRegularizeRequest } = require('../../../controllers/ESSController');
const { validate, createAttendanceRegularizationDraftSchema } = require('../../../validators/attRegulationValidation');

router = require('express').Router();

router.get('/data', getAttandanceData);
router.post('/check-in', employeeCheckIn);
router.patch('/check-out', employeeCheckOut);
router.get('/checkin-status', isCheckedIn);
router.get('/missed-out', missedOutNotification);
router.post('/regularize', validate(createAttendanceRegularizationDraftSchema), createRegularizeRequest);

module.exports = router;