const router = require('express').Router();
const UserMenuRepository = require('../../../repositories/UserMenuRepository');
const UserMenuService = require('../../../services/UserMenuService');
const UserMenuController = require('../../../controllers/UserMenuController');
const { validate, createUserMenuSchema, validateParams, getByPkSchema, updateUserMenuSchema } = require('../../../validators/userManuValidation');

const userMenuRepository = new UserMenuRepository();
const userMenuService = new UserMenuService(userMenuRepository);
const userMenuController = new UserMenuController(userMenuService);

router.get('/', userMenuController.getAll);
router.post('/', validate(createUserMenuSchema), userMenuController.create); 
router.get('/:id', validateParams(getByPkSchema), userMenuController.getById); 
router.put('/:id', validateParams(getByPkSchema), validate(updateUserMenuSchema), userMenuController.update); 
router.delete('/:id', validateParams(getByPkSchema), userMenuController.delete); 

module.exports = router;