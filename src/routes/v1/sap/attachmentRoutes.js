router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');
const multer = require('multer');
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', SAPController.getAttachments);
router.get('/:id', SAPController.getAttachment);
router.post('/', upload.array('Attachments2_Lines'), SAPController.createAttachment);
// router.put('/:id', SAPController.updateAttachment);
// router.delete('/:id', SAPController.deleteAttachment);

module.exports = router;