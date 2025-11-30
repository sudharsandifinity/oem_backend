const BaseController = require("./BaseController");

class FromTabController extends BaseController {

    constructor(FromTabService){
        super(FromTabService, "Form Tab")
    }

}

module.exports = FromTabController;