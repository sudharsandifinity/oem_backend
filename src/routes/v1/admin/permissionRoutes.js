const express = require('express');
const router = express.Router();
const PermissionRepository = require('../../../repositories/PermissionRepository');
const PermissionService = require('../../../services/PermissionService');
const PermissionController = require('../../../controllers/PermissionController');

const permissionRepository = new PermissionRepository();
const permissionService = new PermissionService(permissionRepository);
const permissionController = new PermissionController(permissionService);

router.get('/', permissionController.getAll);

module.exports = router;