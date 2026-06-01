const SalesOrderService = require('../../services/SapServices/SalesOrderService');
const SapDocumentController = require("./SapDocumentController");

class SalesOrderContrller extends SapDocumentController {

    constructor(){
        super(new SalesOrderService());
    }

}

module.exports = SalesOrderContrller;
