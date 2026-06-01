const SapBaseSetvice = require("./SapBaseService");

class SalesOrderService extends SapBaseSetvice {

    constructor(){
        super('ORDERS');
    }

}

module.exports = SalesOrderService;