const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', SAPController.getSalesQuotations);
router.post('/', upload.array('Attachments2_Lines'), SAPController.createSalesQuotations);
router.patch('/:docEntry', upload.array('Attachments2_Lines'), SAPController.updateSalesQuotations);
router.get('/:docEntry', SAPController.getSalesQuotationById);

module.exports = router;