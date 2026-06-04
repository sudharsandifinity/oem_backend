const SapBaseSetvice = require("./SapBaseService");

class PurchaseInvoiceService extends SapBaseSetvice {

    constructor(){
        super('P_INVOICE');
    }

}

module.exports = PurchaseInvoiceService;