const { syncEmployees, getEmployeeProfile, getAllEmployees, getEmpBenifits, getEmpSalary } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/', getAllEmployees);
router.get('/me', getEmployeeProfile);
router.post('/sync', syncEmployees);
router.get('/benifits', getEmpBenifits);
router.get('/salary', getEmpSalary);

module.exports = router;