const BaseRepository = require("./baseRepository");
const { FormTab } = require('../models')

class FormTabRepository extends BaseRepository{
    
    constructor(){
        super(FormTab)
    }

}

module.exports = FormTabRepository;