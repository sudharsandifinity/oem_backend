const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');

router.get('/', SAPController.getPurchaseOrders);
router.post('/', SAPController.createPurchaseOrders);
router.patch('/:docEntry', SAPController.updatePurchaseOrder);
router.get('/:docEntry', SAPController.getPurchaseOrderById);

module.exports = router;