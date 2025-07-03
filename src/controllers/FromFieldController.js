const BaseController = require("./BaseController");

class FromFieldController extends BaseController {

    constructor(FromFieldService){
        super(FromFieldService, "Form Field")
    }

}

module.exports = FromFieldController;