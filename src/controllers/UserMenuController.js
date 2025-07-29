const BaseController = require("./BaseController");

class UserMenuController extends BaseController {

    constructor(FromFieldService){
        super(FromFieldService, "User Menu")
    }

}

module.exports = UserMenuController;