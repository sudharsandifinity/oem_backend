const { syncEmployees, getEmployeeProfile, getAllEmployees, getEmpBenifits, getEmpSalary, termination } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/', getAllEmployees);
router.get('/me', getEmployeeProfile);
router.post('/sync', syncEmployees);
router.get('/benifits', getEmpBenifits);
router.get('/salary', getEmpSalary);
router.patch('/termination', termination);

module.exports = router;