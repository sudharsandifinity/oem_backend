const router = require('express').Router();
const CompanyRepository = require('../../repositories/CompanyRepository');
const CompanyService = require('../../services/CompanyService');
const CompanyController = require('../../controllers/CompanyController');

const companyRepository = new CompanyRepository();
const companyService = new CompanyService(companyRepository);
const companyController = new CompanyController(companyService);

router.get('/companies', companyController.getActiveList);

module.exports = router;