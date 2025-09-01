const logger = require("../config/logger");
const { encodeId, decodeId } = require("../utils/hashids");
const BaseService = require("./baseService");
const CompanyRepository = require("../repositories/CompanyRepository");
const FromFieldRepository = require("../repositories/FromFieldRepository");

class FormService extends BaseService{

    constructor(FormRepository){
        super(FormRepository);
        this.companyRepository = new CompanyRepository();
        this.fromFieldRepository = new FromFieldRepository();
    }

    async getAll(){
        const forms = await this.repository.findAll();

        return forms.map(form => {
            const json = form.toJSON();
            json.id = encodeId(json.id);
            json.parentFormId = encodeId(json.parentFormId);
            json.companyId = encodeId(json.companyId);
            json.branchId = encodeId(json.branchId);

            if (json.Company) {
                json.Company.id = encodeId(json.Company.id);
            }
            if (json.Branch) {
                json.Branch.id = encodeId(json.Branch.id);
                json.Branch.companyId = encodeId(json.Branch.companyId);
                json.Branch.CompanyId = encodeId(json.Branch.CompanyId);
            }
            if (json.FormFields) {
                json.FormFields = json.FormFields.map(formField => ({
                    ...formField,
                    id: encodeId(formField.id),
                    formId: encodeId(formField.formId),
                    formSectionId: encodeId(formField.formSectionId)
                }));
            }
            return json;
        })
    }

    async getById(id){
        const form = await this.repository.findById(id);
        if(!form) return null;
        const result = form.toJSON();
        result.id = encodeId(result.id);
        result.parentFormId = encodeId(result.parentFormId);
        result.companyId = encodeId(result.companyId);
        result.branchId = encodeId(result.branchId);
        result.FormFields = result.FormFields.map(field => ({
            ...field,
            id: encodeId(field.id),
            formId: encodeId(field.formId),
            formSectionId: encodeId(field.formSectionId),
        }));
        return result;
    }

    async create(data){
        // const existing = await this.repository.findByName(data.name);

        // if(existing) {
        //     logger.warn('Form name is already exists', {Name: data.name});
        //     throw new Error('Form name is already exist!');
        // }

        ["companyId", "branchId", "parentFormId"].forEach(key => {
            if (data[key] === "" || data[key] === undefined) {
                data[key] = null;
            }
        });

        ["companyId", "branchId", "parentFormId"].forEach(key => {
            if(data[key]){
                data[key] = decodeId(data[key]);
            }
        });

        const form = await this.repository.create(data);
        const formData = this.getById(form.id);
        return formData;
    }

    async update(id, data) {
        if (data.name) {
            const existing = await this.repository.findByName(data.name);
            if (existing && existing.id != id) {
                logger.warn('Form name is already exists', {Name: data.name});
                throw new Error('Form name is already exist!');
            }
        }

        ["companyId", "branchId", "parentFormId"].forEach(key => {
            if (data[key] === "" || data[key] === undefined) {
                data[key] = null;
            }
        });

        ["companyId", "branchId", "parentFormId"].forEach(key => {
            if(data[key]){
                data[key] = decodeId(data[key]);
            }
        });

        await this.repository.update(id, data);
        const formData = await this.getById(id);
        return formData;
    }

    async getAllActiveGlobalForms(){
        const allGlobalforms = await this.repository.findAllActiveGlobalForms();

        return allGlobalforms.map(globalform => {
            const json = globalform.toJSON();
            json.id = encodeId(json.id);
            json.parentFormId = encodeId(json.parentFormId);
            json.companyId = encodeId(json.companyId);
            json.branchId = encodeId(json.branchId);
            return json;
        })
    }

    async assignGlobalForms(companyId, branchId, globalFormIds) {

        globalFormIds = globalFormIds.map(globalFormId => decodeId(globalFormId));

        for (const globalFormId of globalFormIds) {
            const globalForm = await this.getById(globalFormId);
            
            if (!globalForm) continue;

            const formData = globalForm;
            delete formData.id;
            delete formData.createdAt;
            delete formData.updatedAt;

            formData.companyId = companyId;
            formData.branchId = branchId;

            ["companyId", "branchId", "parentFormId"].forEach(key => {
                if (formData[key] === "" || formData[key] === undefined) {
                    formData[key] = null;
                }
            });

            ["companyId", "branchId", "parentFormId"].forEach(key => {
                if(formData[key]){
                    formData[key] = decodeId(formData[key]);
                }
            });
            
            const newForm = await this.repository.create(formData);
            

            if (formData.FormFields && Array.isArray(formData.FormFields)) {
                for (const field of formData.FormFields) {

                    delete field.id;
                    field.formId = newForm.id;
                    delete field.createdAt;
                    delete field.updatedAt;

                    if(field.formSectionId){
                        field.formSectionId = decodeId(field.formSectionId)
                    }
                    
                    await this.fromFieldRepository.create(field);
                }
            }
        }
        return;
    }

}

module.exports = FormService;