const router = require('express').Router();
const ESSController = require('../../../controllers/ESSController');

router.get('/', ESSController.AllDepartments);

module.exports = router;