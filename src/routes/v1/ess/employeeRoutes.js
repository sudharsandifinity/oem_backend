const { syncEmployees, getEmployeeProfile, getAllEmployees } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/', getAllEmployees);
router.get('/me', getEmployeeProfile);
router.post('/sync', syncEmployees);

module.exports = router;