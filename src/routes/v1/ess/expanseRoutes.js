const { getAllExpType, createExpRequest, getAllExpList, getExp, resubmitExpReq, updateExpReq } = require('../../../controllers/ESSController');
const upload = require('../../../middlewares/uploadMiddleware');

router = require('express').Router();

router.get('/types', getAllExpType);
router.post('/request', upload.array('Attachments2_Lines'), createExpRequest);
router.patch('/resubmit/:id', upload.array('Attachments2_Lines'), resubmitExpReq);
router.get('/:id', getExp);
router.patch('/:id', updateExpReq);
router.get('/', getAllExpList);

module.exports = router;