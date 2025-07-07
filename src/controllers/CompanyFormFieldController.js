const BaseController = require("./BaseController");

class CompanyFormFieldController extends BaseController {

    constructor(FromFieldService){
        super(FromFieldService, "Company Form Field")
    }

}

module.exports = CompanyFormFieldController;