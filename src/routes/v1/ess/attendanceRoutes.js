const { employeeCheckIn, employeeCheckOut } = require('../../../controllers/ESSController');

router = require('express').Router();

router.post('/check-in', employeeCheckIn);
router.patch('/check-out', employeeCheckOut);

module.exports = router;