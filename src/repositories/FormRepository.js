const BaseRepository = require("./baseRepository")
const { Form } = require('../models');

class FormRepository extends BaseRepository{

    constructor(){
        super(Form);
    }
    
}

module.exports = FormRepository;