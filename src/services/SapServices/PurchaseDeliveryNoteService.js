const SapBaseService = require("./SapBaseService");

class PurchaseDeliveryNoteService extends SapBaseService{
    constructor(){
        super('GRPO')
    }
}

module.exports = PurchaseDeliveryNoteService;