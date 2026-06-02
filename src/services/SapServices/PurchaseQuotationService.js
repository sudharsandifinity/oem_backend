const SapBaseSetvice = require("./SapBaseService");

class PurchaseQuotationService extends SapBaseSetvice {

    constructor(){
        super('P_QUOTATION');
    }

}

module.exports = PurchaseQuotationService;