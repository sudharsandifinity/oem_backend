const router = require('express').Router();
const PurchaseDeliveryNoteController = require('../../../controllers/SapControllers/PurchaseDeliveryNoteController');
const purchaseDeliveryNoteController = new PurchaseDeliveryNoteController();
const SAPController = require('../../../controllers/SAPController');
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', purchaseDeliveryNoteController.getAll);
router.get('/:id', purchaseDeliveryNoteController.getById);
router.patch('/:docEntry',upload.array('Attachments2_Lines'), SAPController.updatePurchaseDeliveryNote);
router.get('/:docEntry', SAPController.getPurchaseDeliveryNotesById);

module.exports = router;