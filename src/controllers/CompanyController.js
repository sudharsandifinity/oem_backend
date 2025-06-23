const BaseController = require("./BaseController");

class CompanyController extends BaseController{

    constructor(CompanyService){
        super(CompanyService, 'Company')
    }

}

module.exports = CompanyController;