const logger = require("../config/logger");
const { encodeId, decodeId } = require("../utils/hashids");
const BaseService = require("./baseService");
const {Form,Company,FormSection} = require('../models')

class CompanyFormFieldService extends BaseService{

    constructor(companyFormFieldRepository, formFieldRepository) {
        super(companyFormFieldRepository);
        this.formFieldRepository = formFieldRepository;
    }

    // async getAll(){
    //     const formFields = await this.repository.findAll();

    //     return formFields.map(formField => {
    //         const json = formField.toJSON();
    //         json.id = encodeId(json.id);

    //         if(json.Form){
    //             json.Form.id = encodeId(json.Form.id)
    //         }
    //         if(json.Company){
    //             json.Company.id = encodeId(json.Company.id)
    //         }
    //         if(json.FormSection){
    //             json.FormSection.id = encodeId(json.FormSection.id)
    //         }
    //         return json;
    //     })
    // }

    async getAll() {
        try {
            const companyFields = await this.repository.findAll({
                where: { status: 1 },
                include: [Form, FormSection, Company]
            });

            const defaultFields = await this.formFieldRepository.findAll({
                where: { status: 1 },
                include: [Form, FormSection]
            });

            const overriddenFieldNames = companyFields.map(f => f.field_name);

            const filteredDefaults = defaultFields.filter(
                f => !overriddenFieldNames.includes(f.field_name)
            );

            const allFields = [...companyFields, ...filteredDefaults];

            return allFields.map(field => {
                const json = field.toJSON();
                json.id = encodeId(json.id);
                if (json.Form) json.Form.id = encodeId(json.Form.id);
                if (json.Company) json.Company.id = encodeId(json.Company.id);
                if (json.FormSection) json.FormSection.id = encodeId(json.FormSection.id);
                return json;
            });

        } catch (error) {
            logger.error("Error while getting Company Form Fields", error);
            throw {
                message: "Error while getting Company Form Fields",
                error: error.message || error
            };
        }
    }

    async getById(id){
        const data = await this.repository.findById(id);
        if (!data) return null;
        const result = data.toJSON();
        result.id = encodeId(result.id);
        result.Company.id = encodeId(result.Company.id);
        result.Form.id = encodeId(result.Form.id);
        result.FormSection.id = encodeId(result.FormSection.id);
        return result;
    }

    async create(data){

        if(data.companyId){
            data.companyId = decodeId(data.companyId)
        }

        if(data.formId){
            data.formId = decodeId(data.formId)
        }

        if(data.formSectionId){
            data.formSectionId = decodeId(data.formSectionId)
        }

        const FormField = await this.repository.create(data);
        const result = await this.getById(FormField.id)
        return result;
    }

    async update(id, data){
        if(data.companyId){
            data.companyId = decodeId(data.companyId)
        }
        
        if (data.formId) {
            data.formId = decodeId(data.formId);
        }
        if (data.formSectionId) {
            data.formSectionId = decodeId(data.formSectionId);
        }
        
        const item = await this.repository.update(id, data);
        const result = await this.getById(item.id)
        return result;
    }

}

module.exports = CompanyFormFieldService;