const router = require('express').Router();
const CompanyAdmin = require('../../../controllers/CompanyAdmin');

const companyAdmin = new CompanyAdmin();

router.get('/users', companyAdmin.CompanyUsers);

module.exports = router;