const SapBaseSetvice = require("./SapBaseService");

class PurchaseRequestService extends SapBaseSetvice {

    constructor(){
        super('PR');
    }

}

module.exports = PurchaseRequestService;