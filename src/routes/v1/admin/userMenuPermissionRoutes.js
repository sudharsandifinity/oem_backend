const router = require('express').Router();
const UserMenuPermissionRepository = require('../../../repositories/UserMenuPermissionRepository');
const UserMenuPermissionService = require('../../../services/UserMenuPermissionService');
const UserMenuPermissionController = require('../../../controllers/UserMenuPermissionController');
const { validate, createUserMenuPermissionSchema, validateParams, getByPkSchema, updateUserMenuPermissionSchema } = require('../../../validators/userMenuPermissionValidation');

const userMenuPermissionRepository = new UserMenuPermissionRepository();
const userMenuPermissionService = new UserMenuPermissionService(userMenuPermissionRepository);
const userMenuPermissionController = new UserMenuPermissionController(userMenuPermissionService);

router.get('/', userMenuPermissionController.getAll);
router.post('/', validate(createUserMenuPermissionSchema), userMenuPermissionController.create); 
router.get('/:id', validateParams(getByPkSchema), userMenuPermissionController.getById); 
router.put('/:id', validateParams(getByPkSchema), validate(updateUserMenuPermissionSchema), userMenuPermissionController.update); 
router.delete('/:id', validateParams(getByPkSchema), userMenuPermissionController.delete); 

module.exports = router;