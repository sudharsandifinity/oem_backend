const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');
const OrdersController = require('../../../controllers/SapControllers/SalesOrderContrller')
const ordersController = new OrdersController();
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', ordersController.getAll);
// router.post('/', upload.array('Attachments2_Lines'), SAPController.createOrders);
// router.patch('/:docEntry', upload.array('Attachments2_Lines'), SAPController.updateOrder);
router.post('/', upload.array('Attachments2_Lines'), ordersController.create);
router.patch('/:id', upload.array('Attachments2_Lines'), ordersController.update);
router.get('/:id', ordersController.getById);

module.exports = router;