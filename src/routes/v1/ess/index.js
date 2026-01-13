const express = require('express');
const router = express.Router();

const HolidayRoutes = require('./holidayRoutes');
const ProjectRoutes = require('./projectRoutes');
const EmployeeRoutes = require('./employeeRoutes');
const AttendanceRoutes = require('./attendanceRoutes');
const ExpanseRoutes = require('./expanseRoutes');
const ApprovalRoutes = require('./approvalLogRoutes');
const CurrencyRoutes = require('./currencyRoutes');
const BaseRoutes = require('./baseRoutes');
const RequestRoutes = require('./requestRoutes');

router.use('/holidays', HolidayRoutes);
router.use('/projects', ProjectRoutes);
router.use('/employees', EmployeeRoutes);
router.use('/attendance', AttendanceRoutes);
router.use('/expanses', ExpanseRoutes);
router.use('/approvals', ApprovalRoutes);
router.use('/currency', CurrencyRoutes);
router.use('/general', BaseRoutes);
router.use('/requests', RequestRoutes);

module.exports = router;