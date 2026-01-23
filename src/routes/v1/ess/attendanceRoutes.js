const { employeeCheckIn, employeeCheckOut, isCheckedIn, missedOutNotification } = require('../../../controllers/ESSController');

router = require('express').Router();

router.post('/check-in', employeeCheckIn);
router.patch('/check-out', employeeCheckOut);
router.get('/checkin-status', isCheckedIn);
router.get('/missed-out', missedOutNotification);

module.exports = router;