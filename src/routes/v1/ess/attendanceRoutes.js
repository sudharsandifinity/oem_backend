const { emploueeCheckIn, emploueeCheckOut } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/check-in', emploueeCheckIn);
router.get('/check-out', emploueeCheckOut);

module.exports = router;