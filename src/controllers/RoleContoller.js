const BaseController = require("./BaseController");

class RoleController extends BaseController{

    constructor(roleService){
        super(roleService, 'role');
    }

}

module.exports = RoleController;