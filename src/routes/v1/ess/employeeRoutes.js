const { getEmployes } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/', getEmployes);

module.exports = router;