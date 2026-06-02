const router = require('express').Router();
const PurchaseDeliveryNoteController = require('../../../controllers/SapControllers/PurchaseDeliveryNoteController');
const purchaseDeliveryNoteController = new PurchaseDeliveryNoteController();
const SAPController = require('../../../controllers/SAPController');
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', purchaseDeliveryNoteController.getAll);
router.get('/:id', purchaseDeliveryNoteController.getById);
router.post('/',upload.array('Attachments2_Lines'), purchaseDeliveryNoteController.create);
router.patch('/:id',upload.array('Attachments2_Lines'), purchaseDeliveryNoteController.patch);

module.exports = router;