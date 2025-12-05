const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', SAPController.getPurchaseQuotations);
router.post('/', upload.array('Attachments2_Lines'), SAPController.createPurchaseQuotations);
router.patch('/:docEntry', upload.array('Attachments2_Lines'), SAPController.updatePurchaseQuotations);
router.get('/:docEntry', SAPController.getPurchaseQuotationById);

module.exports = router;