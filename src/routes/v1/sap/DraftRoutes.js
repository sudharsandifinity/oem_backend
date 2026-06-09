const router = require('express').Router();
const DraftController = require('../../../controllers/SapControllers/DraftController')
const draftController = new DraftController();
const upload = require('../../../middlewares/uploadMiddleware');

router.get('/', draftController.getAll);
router.post('/', upload.array('Attachments2_Lines'), draftController.create);
// router.patch('/:id', upload.array('Attachments2_Lines'), draftController.update);
router.get('/:id', draftController.getById);

module.exports = router;