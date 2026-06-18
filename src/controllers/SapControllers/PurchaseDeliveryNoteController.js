const PurchaseDeliveryNoteService = require('../../services/SapServices/PurchaseDeliveryNoteService');
const SapDocumentController = require("./SapDocumentController");

class PurchaseDeliveryNoteController extends SapDocumentController {

    constructor(){
        super(new PurchaseDeliveryNoteService())
    }

}

module.exports = PurchaseDeliveryNoteController;
