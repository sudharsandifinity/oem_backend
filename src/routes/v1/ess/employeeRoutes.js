const { getEmployes, syncEmployees } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/', getEmployes);
router.get('/sync', syncEmployees);

module.exports = router;