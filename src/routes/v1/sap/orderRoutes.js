const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', SAPController.getOrders);
router.post('/', upload.array('Attachments2_Lines'), SAPController.createOrders);
router.patch('/:docEntry', upload.array('Attachments2_Lines'), SAPController.updateOrder);
router.get('/:docEntry', SAPController.getOrderById);

module.exports = router;