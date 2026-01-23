const { currencyList } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/', currencyList);

module.exports = router;