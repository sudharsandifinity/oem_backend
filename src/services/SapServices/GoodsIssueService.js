const SapBaseSetvice = require("./SapBaseService");

class GoodsIssueService extends SapBaseSetvice {

    constructor(){
        super('GOODSISSUE');
    }

}

module.exports = GoodsIssueService;