const SapBaseSetvice = require("./SapBaseService");

class DraftService extends SapBaseSetvice {

    constructor(){
        super('DRAFT');
    }

}

module.exports = DraftService;