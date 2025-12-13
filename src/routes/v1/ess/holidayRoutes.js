const { getHolidays } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/', getHolidays);

module.exports = router;