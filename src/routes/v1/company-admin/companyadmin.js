const router = require('express').Router();
const CompanyAdmin = require('../../../controllers/CompanyAdmin');
const { syncEmployees } = require('../../../controllers/ESSController');

const companyAdmin = new CompanyAdmin();

router.get('/companies', companyAdmin.AdminCompanies);
router.get('/users', companyAdmin.CompanyUsers);
router.get('/menus', companyAdmin.CompanyMenus);
router.post('/employees/sync', syncEmployees);

module.exports = router;