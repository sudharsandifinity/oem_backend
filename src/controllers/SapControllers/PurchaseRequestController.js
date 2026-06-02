const PurchaseRequestService = require('../../services/SapServices/PurchaseRequestService');
const SapDocumentController = require("./SapDocumentController");

class PurchaseRequestController extends SapDocumentController {

    constructor(){
        super(new PurchaseRequestService());
    }

}

module.exports = PurchaseRequestController;
