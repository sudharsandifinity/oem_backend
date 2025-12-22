const express = require('express');
const router = express.Router();

const HolidayRoutes = require('./holidayRoutes');
const ProjectRoutes = require('./projectRoutes');
const EmployeeRoutes = require('./employeeRoutes');
const AttendanceRoutes = require('./attendanceRoutes');
const ExpanseRoutes = require('./expanseRoutes');
const ApprovalRoutes = require('./approvalLogRoutes');

router.use('/holidays', HolidayRoutes);
router.use('/projects', ProjectRoutes);
router.use('/employees', EmployeeRoutes);
router.use('/attendance', AttendanceRoutes);
router.use('/expanses', ExpanseRoutes);
router.use('/approvals', ApprovalRoutes);

module.exports = router;