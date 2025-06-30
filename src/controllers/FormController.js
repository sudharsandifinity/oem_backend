const BaseController = require("./BaseController");

class FormController extends BaseController{

    constructor(FormService){
        super(FormService, "Form");
    }

}

module.exports = FormController;