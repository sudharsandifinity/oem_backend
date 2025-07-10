const BaseController = require("./BaseController");

class UserCompanyFormController extends BaseController {

    constructor(userCompanyFormService){
        super(userCompanyFormService, "User Company Form")
    }

}

module.exports = UserCompanyFormController;