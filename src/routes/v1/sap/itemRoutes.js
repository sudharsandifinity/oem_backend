const router = require('express').Router();
const SAPController = require('../../../controllers/SAPController');

router.get('/', SAPController.getItems);
router.get("/children", SAPController.getChildItemsByParent);

module.exports = router;