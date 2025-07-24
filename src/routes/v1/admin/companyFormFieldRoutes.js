const router = require('express').Router();
const CompanyFormFieldRepository = require('../../../repositories/CompanyFormFieldRepository');
const CompanyFormFieldService = require('../../../services/CompanyFormFieldService');
const CompanyFormFieldController = require('../../../controllers/CompanyFormFieldController');
const { validate, createCompanyFormFieldSchema, validateParams, getByPkSchema, updateCompanyFormFieldSchema } = require('../../../validators/companyFormFieldValidation');

const companyFormFieldRepository = new CompanyFormFieldRepository();
const companyFormFieldService = new CompanyFormFieldService(companyFormFieldRepository);
const companyFormFieldController = new CompanyFormFieldController(companyFormFieldService);

router.get('/', companyFormFieldController.getAll);
router.post('/', validate(createCompanyFormFieldSchema), companyFormFieldController.create); 
router.get('/:id', validateParams(getByPkSchema), companyFormFieldController.getById); 
router.put('/:id', validateParams(getByPkSchema), validate(updateCompanyFormFieldSchema), companyFormFieldController.update); 
router.delete('/:id', validateParams(getByPkSchema), companyFormFieldController.delete); 

module.exports = router;