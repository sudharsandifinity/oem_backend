const express = require('express');
const RoleRepository = require('../../../repositories/roleRepository');
const RoleService = require('../../../services/roleService');
const RoleController = require('../../../controllers/RoleContoller');
const { validateParams, getByPkSchema, validate, createRoleSchema, updateRoleSchema } = require('../../../validators/roleValidation');
const router = express.Router();

const roleRepository = new RoleRepository();
const roleService = new RoleService(roleRepository);
const roleController = new RoleController(roleService);

router.get('/', roleController.getAll);
router.get('/:id', validateParams(getByPkSchema),roleController.getById);
router.post('/', validate(createRoleSchema),roleController.create);
router.put('/:id', validateParams(getByPkSchema), validate(updateRoleSchema), roleController.update);
router.delete('/:id', validateParams(getByPkSchema),roleController.delete);

module.exports = router;