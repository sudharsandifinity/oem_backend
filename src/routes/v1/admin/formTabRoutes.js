const router = require('express').Router();
const FormTabRepository = require('../../../repositories/FormTabRepository');
const FormTabService = require('../../../services/FromTabService');
const FormTabController = require('../../../controllers/FromTabController');
const { validate, createFormTabSchema, validateParams, getByPkSchema, updateFormTabSchema } = require('../../../validators/formTabValidation');

const formTabRepository = new FormTabRepository();
const formTabService = new FormTabService(formTabRepository);
const formTabController = new FormTabController(formTabService);

router.get('/', formTabController.getAll);
router.post('/', validate(createFormTabSchema), formTabController.create); 
router.get('/:id', validateParams(getByPkSchema), formTabController.getById); 
router.put('/:id', validateParams(getByPkSchema), validate(updateFormTabSchema), formTabController.update); 
router.delete('/:id', validateParams(getByPkSchema), formTabController.delete); 

module.exports = router;