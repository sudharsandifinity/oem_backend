const { emploueeCheckIn, emploueeCheckOut } = require('../../../controllers/ESSController');

router = require('express').Router();

router.post('/check-in', emploueeCheckIn);
router.patch('/check-out', emploueeCheckOut);

module.exports = router;