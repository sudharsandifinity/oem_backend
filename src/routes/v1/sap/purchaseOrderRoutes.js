const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');
const PurchaseOrderController = require('../../../controllers/SapControllers/PurchaseOrderController')
const purchaseOrderController = new PurchaseOrderController();
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', purchaseOrderController.getAll);
// router.post('/', SAPController.createPurchaseOrders);
// router.patch('/:docEntry', SAPController.updatePurchaseOrder);
router.post('/', upload.array('Attachments2_Lines'), purchaseOrderController.create);
router.patch('/:id', upload.array('Attachments2_Lines'), purchaseOrderController.patch);
router.get('/:id', purchaseOrderController.getById);

module.exports = router;