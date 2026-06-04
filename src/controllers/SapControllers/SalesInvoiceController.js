const SalesInvoiceService = require('../../services/SapServices/SalesInvoiceService');
const SapDocumentController = require("./SapDocumentController");

class SalesInvoiceController extends SapDocumentController {

    constructor(){
        super(new SalesInvoiceService());
    }

}

module.exports = SalesInvoiceController;
