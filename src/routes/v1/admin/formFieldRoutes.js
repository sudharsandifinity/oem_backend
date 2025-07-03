const router = require('express').Router();
const FormFieldRepository = require('../../../repositories/FromFieldRepository');
const FormFieldService = require('../../../services/FromFieldService');
const FormFieldController = require('../../../controllers/FromFieldController');
const { validate, createFormFieldSchema, validateParams, getByPkSchema, updateFormFieldSchema } = require('../../../validators/formFieldValidation');

const formFieldRepository = new FormFieldRepository();
const formFieldService = new FormFieldService(formFieldRepository);
const formFieldController = new FormFieldController(formFieldService);

router.get('/', formFieldController.getAll);
router.post('/', validate(createFormFieldSchema), formFieldController.create); 
router.get('/:id', validateParams(getByPkSchema), formFieldController.getById); 
router.put('/:id', validateParams(getByPkSchema), validate(updateFormFieldSchema), formFieldController.update); 
router.delete('/:id', validateParams(getByPkSchema), formFieldController.delete); 

module.exports = router;