const { getAllExpType, createExpRequest, getAllExpList, getExp, resubmitExpReq, updateExpReq } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/types', getAllExpType);
router.post('/request', createExpRequest);
router.patch('/resubmit/:id', resubmitExpReq);
router.get('/:id', getExp)
router.patch('/:id', updateExpReq);
router.get('/', getAllExpList)

module.exports = router;