const router = require('express').Router();
const CompanyRepository = require('../../../repositories/CompanyRepository');
const CompanyService = require('../../../services/CompanyService');
const CompanyController = require('../../../controllers/CompanyController');
const { validate, createCompanySchema, validateParams, getByPkSchema, updateCompanySchema } = require('../../../validators/companyValidation');

const companyRepository = new CompanyRepository();
const companyService = new CompanyService(companyRepository);
const companyController = new CompanyController(companyService);

router.get('/', companyController.getAll);
router.post('/', validate(createCompanySchema), companyController.create); 
router.get('/:id', validateParams(getByPkSchema), companyController.getById); 
router.put('/:id', validateParams(getByPkSchema), validate(updateCompanySchema), companyController.update); 
router.delete('/:id', validateParams(getByPkSchema), companyController.delete); 

module.exports = router;