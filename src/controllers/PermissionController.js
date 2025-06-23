const BaseController = require("./BaseController");


class PermissionController extends BaseController{

    constructor(PermissionService){
        super(PermissionService, "permission");
    }

}

module.exports = PermissionController;