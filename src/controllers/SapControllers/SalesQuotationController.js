const SalesQuotationService = require('../../services/SapServices/SalesQuotationService');
const SapDocumentController = require("./SapDocumentController");

class SalesQuotationController extends SapDocumentController {

    constructor(){
        super(new SalesQuotationService());
    }

}

module.exports = SalesQuotationController;
