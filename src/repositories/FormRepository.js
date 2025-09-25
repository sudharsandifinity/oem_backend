const BaseRepository = require("./baseRepository")
const { Form, Company, Branch, FormTab, SubForm, FormField } = require('../models');

class FormRepository extends BaseRepository{

    constructor(){
        super(Form);
    }

    async findAll(){
        return await this.model.findAll({ 
            include: [ Company, Branch, 
                {
                    model: FormTab,
                    include: [{
                        model: SubForm,
                        include: [FormField]
                    }],
                } 
            ] 
        });
    }

    async findById(id) {
        return await this.model.findByPk(id, {
            include: [ Company, Branch, 
                {
                    model: FormTab,
                    include: [{
                        model: SubForm,
                        include: [FormField]
                    }],
                } 
            ] 
        });
    }

    async findAllActiveGlobalForms() {
        return await this.model.findAll({ where: {status: 1, scope: 'global'}});
    }

    async findByCompanyId(companyId) {
        return await this.model.findAll({ where: { companyId } });
    }

    // async findGlobalFormsByIds(formIds) {
    //     return await Form.findAll({
    //     where: { id: formIds, scope: "global" }
    //     });
    // }

    // async bulkCreate(formsData) {
    //     return await Form.bulkCreate(formsData);
    // }
    
}

module.exports = FormRepository;