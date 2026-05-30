const SapBaseController = require("./SapBaseController");
const PurchaseDeliveryNoteService = require('../../services/SapServices/PurchaseDeliveryNoteService')

class PurchaseDeliveryNoteController extends SapBaseController {

    constructor(){
        super(new PurchaseDeliveryNoteService())
    }

}

module.exports = PurchaseDeliveryNoteController;
