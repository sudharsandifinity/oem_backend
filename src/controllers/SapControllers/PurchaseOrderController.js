const PurchaseOrderService = require('../../services/SapServices/PurchaseOrderService');
const SapDocumentController = require("./SapDocumentController");

class PurchaseOrderController extends SapDocumentController {

    constructor(){
        super(new PurchaseOrderService());
    }

}

module.exports = PurchaseOrderController;
