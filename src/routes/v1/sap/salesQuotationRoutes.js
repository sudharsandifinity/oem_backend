const router = require('express').Router();
const SalesQuotationController = require('../../../controllers/SapControllers/SalesQuotationController')
const salesQuotationController = new SalesQuotationController();
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', salesQuotationController.getAll);
router.post('/', upload.array('Attachments2_Lines'), salesQuotationController.create);
router.patch('/:id', upload.array('Attachments2_Lines'), salesQuotationController.patch);
router.get('/:id', salesQuotationController.getById);

module.exports = router;