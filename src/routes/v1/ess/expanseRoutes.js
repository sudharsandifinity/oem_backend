const { getAllExpType, createExpRequest, getAllExpList } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/', getAllExpList)
router.get('/types', getAllExpType);
router.post('/request', createExpRequest);

module.exports = router;