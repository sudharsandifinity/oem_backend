const BaseRepository = require("./baseRepository");
const { FormSection } = require('../models')

class FormSectionRepository extends BaseRepository{
    
    constructor(){
        super(FormSection)
    }

    async findByName(section_name){
        return await this.model.findOne({ where: { section_name }});
    }

}

module.exports = FormSectionRepository;