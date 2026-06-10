const router = require('express').Router();
const UOMController = require('../../../controllers/SapControllers/UOMController')
const uomController = new UOMController();
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', uomController.getAll);
router.get('/:id', uomController.getById);

module.exports = router;