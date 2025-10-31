const BaseController = require("./BaseController");


class FormDataController extends BaseController{

    constructor(FormDataService){
        super(FormDataService, "Form Data")
    }

}

module.exports = FormDataController;