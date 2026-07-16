const router = require('express').Router();
const CompanyAdmin = require('../../../controllers/CompanyAdmin');
const { syncEmployees } = require('../../../controllers/ESSController');
const { validateParams, getByPkSchema, validate, createRoleSchema, updateRoleSchema } = require('../../../validators/CARoleValidation');
const UserRepository = require("../../../repositories/userRepository");
const UserService = require("../../../services/userService");
const UserController = require("../../../controllers/UserController");
const { companyUserUpdateSchema, createCompanyUserSchema } = require('../../../validators/userValidator');
const ApprovalFlowController = require('../../../controllers/ApprovalFlowController');

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const companyAdmin = new CompanyAdmin();
const approvalFlowController = new ApprovalFlowController();

router.get('/companies', companyAdmin.AdminCompanies);
router.get('/menus', companyAdmin.CompanyMenus);
router.post('/employees/sync', syncEmployees);

router.get('/users', companyAdmin.CompanyUsers);
router.get('/users/:id', validateParams(getByPkSchema), companyAdmin.getByIdCAdmin);
router.post('/users', validate(createCompanyUserSchema), userController.create);
router.patch('/users/:id',validateParams(getByPkSchema), validate(companyUserUpdateSchema), userController.update);

router.get('/projects', companyAdmin.CompanyProjects);
router.post('/projects/sync', companyAdmin.SyncCompanyProjects);

router.get('/approval-flows', approvalFlowController.getFlow);
router.put('/approval-flows', approvalFlowController.saveFlow);

router.get('/roles', companyAdmin.CompanyRoles);
router.get('/roles/:id', validateParams(getByPkSchema), companyAdmin.GetCompanyRole);
router.post('/roles', validate(createRoleSchema), companyAdmin.CreateCompanyRole);
router.put('/roles/:id', validateParams(getByPkSchema), validate(updateRoleSchema), companyAdmin.UpdateCompanyRole);
router.delete('/roles/:id', validateParams(getByPkSchema), companyAdmin.DeleteCompanyRole);

module.exports = router;