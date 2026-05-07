const router = require('express').Router();
const BOQController = require('../../../controllers/SapControllers/BOQController');
const sapBOQController = new BOQController();

router.get('/active', sapBOQController.getOpenBoqs);

module.exports = router;