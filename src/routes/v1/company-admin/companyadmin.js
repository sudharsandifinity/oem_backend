const router = require('express').Router();
const CompanyAdmin = require('../../../controllers/CompanyAdmin');
const { syncEmployees } = require('../../../controllers/ESSController');
const { validateParams, getByPkSchema, validate, createRoleSchema, updateRoleSchema } = require('../../../validators/CARoleValidation');
const { roleController } = require('../admin/roleRoutes');
const UserRepository = require("../../../repositories/userRepository");
const UserService = require("../../../services/userService");
const UserController = require("../../../controllers/UserController");
const { companyUserUpdateSchema, createCompanyUserSchema } = require('../../../validators/userValidator');

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const companyAdmin = new CompanyAdmin();

router.get('/companies', companyAdmin.AdminCompanies);
router.get('/menus', companyAdmin.CompanyMenus);
router.post('/employees/sync', syncEmployees);

router.get('/users', companyAdmin.CompanyUsers);
router.get('/users/:id', validateParams(getByPkSchema), companyAdmin.getByIdCAdmin);
router.post('/users', validate(createCompanyUserSchema), userController.create);
router.put('/users/:id',validateParams(getByPkSchema), validate(companyUserUpdateSchema), userController.update);

router.get('/roles', companyAdmin.CompanyRoles);
router.get('/roles/:id', validateParams(getByPkSchema),roleController.getById);
router.post('/roles', validate(createRoleSchema),roleController.create);
router.put('/roles/:id', validateParams(getByPkSchema), validate(updateRoleSchema), roleController.update);
router.delete('/roles/:id', validateParams(getByPkSchema),roleController.delete);

module.exports = router;