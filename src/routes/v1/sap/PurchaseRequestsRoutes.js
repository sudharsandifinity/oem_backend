const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', SAPController.getPurchaseRequests);
router.post('/', upload.array('Attachments2_Lines'), SAPController.createPurchaseRequests);
router.patch('/:docEntry', upload.array('Attachments2_Lines'), SAPController.updatePurchaseRequests);
router.get('/:docEntry', SAPController.getPurchaseRequestById);

module.exports = router;