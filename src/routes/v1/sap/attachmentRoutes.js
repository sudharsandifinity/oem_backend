router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', SAPController.getAttachments);
router.get('/:id', SAPController.getAttachment);
router.post('/', upload.single('Attachments2_Lines'), SAPController.uploadToSAP);
// router.put('/:id', SAPController.updateAttachment);
// router.delete('/:id', SAPController.deleteAttachment);

module.exports = router;