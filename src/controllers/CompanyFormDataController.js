const BaseController = require("./BaseController");

class CompanyFormDataController extends BaseController {

    constructor(CompanyFormDataService){
        super(CompanyFormDataService, 'Company Form Data')
    }

}

module.exports = CompanyFormDataController;