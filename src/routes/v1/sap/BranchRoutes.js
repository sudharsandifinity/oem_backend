const router = require('express').Router();
const SapBranchController = require('../../../controllers/SapControllers/SapBranchController');
const sapBranchController = new SapBranchController();

router.get('/', sapBranchController.getAll);
router.post('/sync', sapBranchController.getSapBranches);

module.exports = router;