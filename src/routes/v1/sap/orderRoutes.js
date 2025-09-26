const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');

router.get('/', SAPController.getOrders);
router.post('/', SAPController.createOrders);
router.patch('/:docEntry', SAPController.updateOrder);
router.get('/:docEntry', SAPController.getOrderById);

module.exports = router;