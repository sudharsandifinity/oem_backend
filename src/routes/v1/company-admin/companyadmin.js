const router = require('express').Router();
const CompanyAdmin = require('../../../controllers/CompanyAdmin');
const { syncEmployees } = require('../../../controllers/ESSController');
const { validateParams, getByPkSchema, validate, createRoleSchema, updateRoleSchema } = require('../../../validators/roleValidation');
const { roleController } = require('../admin/roleRoutes');

const companyAdmin = new CompanyAdmin();

router.get('/companies', companyAdmin.AdminCompanies);
router.get('/users', companyAdmin.CompanyUsers);
router.get('/menus', companyAdmin.CompanyMenus);
router.post('/employees/sync', syncEmployees);

router.get('/roles', companyAdmin.CompanyRoles);
router.get('/roles/:id', validateParams(getByPkSchema),roleController.getById);
router.post('/roles', validate(createRoleSchema),roleController.create);
router.put('/roles/:id', validateParams(getByPkSchema), validate(updateRoleSchema), roleController.update);
router.delete('/roles/:id', validateParams(getByPkSchema),roleController.delete);

module.exports = router;