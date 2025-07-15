const router = require('express').Router();
const CompanyFormDataRepository = require('../../../repositories/CompanyFormDataRepository');
const CompanyFormDataService = require('../../../services/CompanyFormDataService');
const CompanyFormDataController = require('../../../controllers/CompanyFormDataController');
const { validate, createCompanyFormDataSchema, validateParams, getByPkSchema, updateCompanyFormDataSchema } = require('../../../validators/companyFormDataValidation');

const companyFormDataRepository = new CompanyFormDataRepository();
const companyFormDataService = new CompanyFormDataService(companyFormDataRepository);
const companyFormDataController = new CompanyFormDataController(companyFormDataService);

router.get('/', companyFormDataController.getAll);
router.post('/', validate(createCompanyFormDataSchema), companyFormDataController.create); 
router.get('/:id', validateParams(getByPkSchema), companyFormDataController.getById); 
router.put('/:id', validateParams(getByPkSchema), validate(updateCompanyFormDataSchema), companyFormDataController.update); 
router.delete('/:id', validateParams(getByPkSchema), companyFormDataController.delete); 

module.exports = router;