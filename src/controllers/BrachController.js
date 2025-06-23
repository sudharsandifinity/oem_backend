const BaseController = require("./BaseController");


class BranchController extends BaseController{

    constructor(BaseService){
        super(BaseService, "Branch");
    }

}

module.exports = BranchController;