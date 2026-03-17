const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');
const upload = require('../../../middlewares/uploadMiddleware');


router.get('/', SAPController.getPurchaseOrders);
router.post('/', upload.array('Attachments2_Lines'),SAPController.createPurchaseOrders);
router.patch('/:docEntry',upload.array('Attachments2_Lines'), SAPController.updatePurchaseOrder);
router.get('/:docEntry', SAPController.getPurchaseOrderById);

module.exports = router;