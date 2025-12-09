const express = require('express');
const router = express.Router();

const HolidayRoutes = require('./holidayRoutes');

router.use('/holidays', HolidayRoutes);

module.exports = router;