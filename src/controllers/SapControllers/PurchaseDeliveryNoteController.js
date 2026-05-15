const SapBaseController = require("./SapBaseController");
const PurchaseDeliveryNoteService = require('../../services/SapServices/PurchaseDeliveryNoteService')

class PurchaseDeliveryNoteController extends SapBaseController {

    constructor(){
        super(new PurchaseDeliveryNoteService(), 'GRPO')
    }

}

module.exports = PurchaseDeliveryNoteController;
