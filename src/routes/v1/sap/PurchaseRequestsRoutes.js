const router = require('express').Router();
const PurchaseRequestController = require('../../../controllers/SapControllers/PurchaseRequestController')
const purchaseRequestController = new PurchaseRequestController();
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', purchaseRequestController.getAll);
router.post('/', upload.array('Attachments2_Lines'), purchaseRequestController.create);
router.patch('/:id', upload.array('Attachments2_Lines'), purchaseRequestController.patch);
router.get('/:id', purchaseRequestController.getById);

module.exports = router;