const router = require('express').Router();
const MaterialRequestController = require('../../../controllers/SapControllers/MaterialRequestController');
const mrController = new MaterialRequestController();
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', mrController.projectBasedFilter);
router.get('/list', mrController.getAll);
router.get('/approvals', mrController.getPendingApprovals);
router.get('/:id', mrController.getById);
router.post('/', mrController.create);
router.patch('/:id/approve', mrController.approve);
router.patch('/:id/reject', mrController.reject);
router.patch('/:id', mrController.patch);

module.exports = router;