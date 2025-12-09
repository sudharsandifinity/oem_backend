const express = require('express');
const router = express.Router();

const HolidayRoutes = require('./holidayRoutes');
const ProjectRoutes = require('./projectRoutes');
const EmployeeRoutes = require('./employeeRoutes');

router.use('/holidays', HolidayRoutes);
router.use('/projects', ProjectRoutes);
router.use('/employees', EmployeeRoutes);

module.exports = router;