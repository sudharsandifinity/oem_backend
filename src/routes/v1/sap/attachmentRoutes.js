router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');
const multer = require('multer');
const upload = multer({ dest: "uploads/" });

router.get('/', SAPController.getAttachments);
router.get('/:id', SAPController.getAttachment);
router.post('/', upload.single('Attachments2_Lines'), SAPController.newUploadMethod);
// router.put('/:id', SAPController.updateAttachment);
// router.delete('/:id', SAPController.deleteAttachment);

module.exports = router;