const BaseController = require("./BaseController");

class CompanyFormConroller extends BaseController {

    constructor(CompanyFormService){
        super(CompanyFormService, "Company Form");
    }

}

module.exports = CompanyFormConroller;