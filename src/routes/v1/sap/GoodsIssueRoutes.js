const router = require('express').Router();
const GoodsIssueController = require('../../../controllers/SapControllers/GoodsIssueController');
const goodsIssueController = new GoodsIssueController();

router.get('/', goodsIssueController.getAll);
router.get('/:id', goodsIssueController.getById);
router.post('/', goodsIssueController.create);
router.patch('/:id', goodsIssueController.patch);

module.exports = router;