const { getProjects } = require('../../../controllers/ESSController');

router = require('express').Router();

router.get('/', getProjects);

module.exports = router;