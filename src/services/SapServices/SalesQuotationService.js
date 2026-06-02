const SapBaseSetvice = require("./SapBaseService");

class SalesQuotationService extends SapBaseSetvice {

    constructor(){
        super('S_QUOTATION');
    }

}

module.exports = SalesQuotationService;