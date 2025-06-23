const router = require('express').Router();
const BranchRepository = require('../../../repositories/BranchRepository');
const BranchService = require('../../../services/BranchService');
const BranchController = require('../../../controllers/BrachController');
const { validate, createBranchSchema, validateParams, getByPkSchema, updateBranchSchema } = require('../../../validators/branchValidation');

const branchRepository = new BranchRepository();
const branchService = new BranchService(branchRepository);
const branchController = new BranchController(branchService);

router.get('/', branchController.getAll);
router.post('/', validate(createBranchSchema), branchController.create); 
router.get('/:id', validateParams(getByPkSchema), branchController.getById); 
router.put('/:id', validateParams(getByPkSchema), validate(updateBranchSchema), branchController.update); 
router.delete('/:id', validateParams(getByPkSchema), branchController.delete); 

module.exports = router;