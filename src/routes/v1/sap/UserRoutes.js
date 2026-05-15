const router = require('express').Router();
const ESSController = require('../../../controllers/ESSController');

router.get('/', ESSController.AllUsers);

module.exports = router;