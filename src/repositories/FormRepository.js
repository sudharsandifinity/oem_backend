const BaseRepository = require("./baseRepository")
const { Form, Company, Branch } = require('../models');

class FormRepository extends BaseRepository{

    constructor(){
        super(Form);
    }

    async findAll(){
        return await this.model.findAll({ include: [ Company, Branch ] });
    }

    async findAllActiveGlobalForms() {
        return await this.model.findAll({ where: {status: 1, scope: 'global'}});
    }

    async findByCompanyId(companyId) {
        return await Form.findAll({ where: { companyId } });
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