const { syncEmployees, getEmployeeProfile, getAllEmployees } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/', getAllEmployees);
router.get('/me', getEmployeeProfile);
router.get('/sync', syncEmployees);

module.exports = router;