const { getEmployes, syncEmployees, getEmployeeProfile } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/', getEmployes);
router.get('/me', getEmployeeProfile);
router.get('/sync', syncEmployees);

module.exports = router;