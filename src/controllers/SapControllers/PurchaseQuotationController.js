const PurchaseQuotationService = require('../../services/SapServices/PurchaseQuotationService');
const SapDocumentController = require("./SapDocumentController");

class PurchaseQuotationController extends SapDocumentController {

    constructor(){
        super(new PurchaseQuotationService());
    }

}

module.exports = PurchaseQuotationController;
