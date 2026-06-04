const router = require('express').Router();
const PurchaseInvoiceController = require('../../../controllers/SapControllers/PurchaseInvoiceController')
const purchaseInvoiceController = new PurchaseInvoiceController();
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', purchaseInvoiceController.getAll);
router.post('/', upload.array('Attachments2_Lines'), purchaseInvoiceController.create);
router.patch('/:id', upload.array('Attachments2_Lines'), purchaseInvoiceController.patch);
router.get('/:id', purchaseInvoiceController.getById);

module.exports = router;