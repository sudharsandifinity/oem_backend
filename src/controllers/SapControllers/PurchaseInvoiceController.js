const PurchaseInvoiceService = require('../../services/SapServices/PurchaseInvoiceService');
const SapDocumentController = require("./SapDocumentController");

class PurchaseInvoiceController extends SapDocumentController {

    constructor(){
        super(new PurchaseInvoiceService());
    }

}

module.exports = PurchaseInvoiceController;
