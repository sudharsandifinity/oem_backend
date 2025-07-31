const BaseController = require("./BaseController");

class UserMenuPermissionController extends BaseController {

    constructor(FromFieldService){
        super(FromFieldService, "User Menu Permission")
    }

}

module.exports = UserMenuPermissionController;