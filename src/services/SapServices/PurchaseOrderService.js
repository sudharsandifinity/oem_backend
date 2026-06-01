const SapBaseSetvice = require("./SapBaseService");

class PurchaseOrderService extends SapBaseSetvice {

    constructor(){
        super('PO');
    }

}

module.exports = PurchaseOrderService;