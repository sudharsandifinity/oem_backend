const router = require('express').Router();
const SalesInvoiceController = require('../../../controllers/SapControllers/SalesInvoiceController')
const salesInvoiceController = new SalesInvoiceController();
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', salesInvoiceController.getAll);
router.post('/', upload.array('Attachments2_Lines'), salesInvoiceController.create);
router.patch('/:id', upload.array('Attachments2_Lines'), salesInvoiceController.patch);
router.get('/:id', salesInvoiceController.getById);

module.exports = router;