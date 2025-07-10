const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const roleRoutes = require('./roleRoutes');
const permissionRoutes = require('./permissionRoutes');
const companyRoutes = require('./comapanyRoutes');
const branchRoutes = require('./branchRoutes');
const formRoutes = require('./formRoutes');
const companyFormRoutes = require('./companyFormRoutes');
const formSectionRoutes = require('./formSectionRoutes');
const formFieldRoutes = require('./formFieldRoutes');
const companyFormFieldRoutes = require('./companyFormFieldRoutes');
const userCompanyFormRoutes = require('./userCompanyFormRoutes');

router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/companies', companyRoutes);
router.use('/branches', branchRoutes);
router.use('/forms', formRoutes);
router.use('/company-forms', companyFormRoutes);
router.use('/form-sections', formSectionRoutes);
router.use('/form-fields', formFieldRoutes);
router.use('/company-form-fields', companyFormFieldRoutes);
router.use('/user-company-form', userCompanyFormRoutes);

module.exports = router;