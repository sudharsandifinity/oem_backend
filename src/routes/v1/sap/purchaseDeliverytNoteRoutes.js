const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');
const upload = require('../../../middlewares/uploadMiddleware');


router.get('/', SAPController.getPurchaseDeliveryNotes);
router.post('/', upload.array('Attachments2_Lines'),SAPController.createPurchaseDeliveryNotes);
router.patch('/:docEntry',upload.array('Attachments2_Lines'), SAPController.updatePurchaseDeliveryNote);
router.get('/:docEntry', SAPController.getPurchaseDeliveryNotesById);

module.exports = router;