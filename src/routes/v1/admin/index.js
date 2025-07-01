const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const roleRoutes = require('./roleRoutes');
const permissionRoutes = require('./permissionRoutes');
const companyRoutes = require('./comapanyRoutes');
const branchRoutes = require('./branchRoutes');
const formRoutes = require('./formRoutes');
const companyFormRoutes = require('./companyFormRoutes');

router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/companies', companyRoutes);
router.use('/branches', branchRoutes);
router.use('/forms', formRoutes);
router.use('/company-forms', companyFormRoutes);

module.exports = router;