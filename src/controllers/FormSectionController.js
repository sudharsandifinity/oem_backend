const BaseController = require("./BaseController");

class FormSectionController extends BaseController{

    constructor(FormSectionService){
        super(FormSectionService, "Form Section")
    }

}

module.exports = FormSectionController;