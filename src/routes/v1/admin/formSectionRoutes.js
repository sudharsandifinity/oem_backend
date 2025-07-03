const router = require('express').Router();
const FormSectionRepository = require('../../../repositories/FormSectionRepository');
const FormSectionService = require('../../../services/FormSectionService');
const FormSectionController = require('../../../controllers/FormSectionController');
const { validate, createFormSectionSchema, validateParams, getByPkSchema, updateFormSectionSchema } = require('../../../validators/formSectionValidation');

const formSectionRepository = new FormSectionRepository();
const formSectionService = new FormSectionService(formSectionRepository);
const formSectionController = new FormSectionController(formSectionService);

router.get('/', formSectionController.getAll);
router.post('/', validate(createFormSectionSchema), formSectionController.create); 
router.get('/:id', validateParams(getByPkSchema), formSectionController.getById); 
router.put('/:id', validateParams(getByPkSchema), validate(updateFormSectionSchema), formSectionController.update); 
router.delete('/:id', validateParams(getByPkSchema), formSectionController.delete); 

module.exports = router;