const router = require('express').Router();
const UserCompanyFormRepository = require('../../../repositories/UserCompanyFormRepository');
const UserCompanyFormService = require('../../../services/UserCompanyFormService');
const UserCompanyFormController = require('../../../controllers/UserCompanyFormController');
const { validate, createUserCompanyFormSchema, validateParams, getByPkSchema, updateUserCompanyFormSchema } = require('../../../validators/userCompanyFormValidation');

const userCompanyFormRepository = new UserCompanyFormRepository();
const userCompanyFormService = new UserCompanyFormService(userCompanyFormRepository);
const userCompanyFormController = new UserCompanyFormController(userCompanyFormService);

router.get('/', userCompanyFormController.getAll);
router.post('/', validate(createUserCompanyFormSchema), userCompanyFormController.create); 
router.get('/:id', validateParams(getByPkSchema), userCompanyFormController.getById); 
router.put('/:id', validateParams(getByPkSchema), validate(updateUserCompanyFormSchema), userCompanyFormController.update); 
router.delete('/:id', validateParams(getByPkSchema), userCompanyFormController.delete); 

module.exports = router;