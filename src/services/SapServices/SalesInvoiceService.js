const SapBaseSetvice = require("./SapBaseService");

class SalesInvoiceService extends SapBaseSetvice {

    constructor(){
        super('S_INVOICE');
    }

}

module.exports = SalesInvoiceService;