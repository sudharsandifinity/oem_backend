const router = require('express').Router();
const FormRepository = require('../../../repositories/FormRepository');
const FormService = require('../../../services/FormService');
const FormController = require('../../../controllers/FormController');
const { validate, createFormSchema, validateParams, getByPkSchema, updateFormSchema } = require('../../../validators/formValidation');

const formRepository = new FormRepository();
const formService = new FormService(formRepository);
const formController = new FormController(formService);

router.get('/', formController.getAll);
router.post('/', validate(createFormSchema), formController.create); 
router.get('/:id', validateParams(getByPkSchema), formController.getById); 
router.put('/:id', validateParams(getByPkSchema), validate(updateFormSchema), formController.update); 
router.delete('/:id', validateParams(getByPkSchema), formController.delete); 

module.exports = router;