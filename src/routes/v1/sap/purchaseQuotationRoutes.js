const router = require('express').Router();
const PurchaseQuotationController = require('../../../controllers/SapControllers/PurchaseQuotationController')
const purchaseQuotationController = new PurchaseQuotationController();
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', purchaseQuotationController.getAll);
router.post('/', upload.array('Attachments2_Lines'), purchaseQuotationController.create);
router.patch('/:id', upload.array('Attachments2_Lines'), purchaseQuotationController.patch);
router.get('/:id', purchaseQuotationController.getById);

module.exports = router;