const router = require('express').Router();
const CompanyFormRepository = require('../../../repositories/CompanyFormRepository');
const CompanyFormService = require('../../../services/CompanyFormService');
const CompanyFormController = require('../../../controllers/CompanyFormController');
const { validate, createCompanyFormSchema, validateParams, getByPkSchema, updateCompanyFormSchema } = require('../../../validators/companyFormValidation');

const companyFormRepository = new CompanyFormRepository();
const companyFormService = new CompanyFormService(companyFormRepository);
const companyFormController = new CompanyFormController(companyFormService);

router.get('/', companyFormController.getAll);
router.post('/', validate(createCompanyFormSchema), companyFormController.create); 
router.get('/:id', validateParams(getByPkSchema), companyFormController.getById); 
router.put('/:id', validateParams(getByPkSchema), validate(updateCompanyFormSchema), companyFormController.update); 
router.delete('/:id', validateParams(getByPkSchema), companyFormController.delete); 

module.exports = router;