const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');

router.get('/', SAPController.getProjects);

module.exports = router;