const router = require('express').Router();
const MaterialRequestController = require('../../../controllers/SapControllers/MaterialRequestController');
const mrController = new MaterialRequestController();
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', mrController.getMaterialRqs);
router.get('/:id', mrController.getById);
router.post('/', mrController.create);
router.patch('/:id', mrController.patch);

module.exports = router;