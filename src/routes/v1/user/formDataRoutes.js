const router = require('express').Router();
const FormDataRepository = require('../../../repositories/FormDataRepository');
const FormDataService = require('../../../services/FormDataService');
const FormDataController = require('../../../controllers/FormDataController');

const formDataRepository = new FormDataRepository();
const formDataService = new FormDataService(formDataRepository);
const formDataController = new FormDataController(formDataService);

router.get('/', formDataController.getAll);
router.post('/', formDataController.create);

module.exports = router;