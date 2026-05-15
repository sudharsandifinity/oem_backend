const SapBaseController = require("./SapBaseController");
const GoodsIssueService = require('../../services/SapServices/GoodsIssueService')

class GoodsIssueController extends SapBaseController {

    constructor(){
        super(new GoodsIssueService(), 'GOODSISSUE')
    }

}

module.exports = GoodsIssueController;
