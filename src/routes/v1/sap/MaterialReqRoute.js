const router = require('express').Router();
const MaterialRequestController = require('../../../controllers/SapControllers/MaterialRequestController');
const mrController = new MaterialRequestController();
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', mrController.getMaterialRqs);
// router.post('/', upload.array('Attachments2_Lines'), SAPController.createOrders);
// router.patch('/:docEntry', upload.array('Attachments2_Lines'), SAPController.updateOrder);
// router.get('/:docEntry', SAPController.getOrderById);

module.exports = router;