const {logger} = require("../config/logger");
const { encodeId, decodeId } = require("../utils/hashids");
const BaseService = require("./baseService");
const CompanyRepository = require("../repositories/CompanyRepository");
const FromFieldRepository = require("../repositories/FromFieldRepository");
const FormTabService = require("./FromTabService")
const FromTabRepository = require("../repositories/FormTabRepository");

class FormService extends BaseService{

    constructor(FormRepository){
        super(FormRepository);
        this.companyRepository = new CompanyRepository();
        this.fromFieldRepository = new FromFieldRepository();
        this.formTabRepository = new FromTabRepository();
        this.formTabService = new FormTabService(this.formTabRepository);
    }

    async getAll() {
        const forms = await this.repository.findAll();

        return forms.map(form => {
            const json = form.toJSON();

            json.id = encodeId(json.id);
            if (json.parentFormId) json.parentFormId = encodeId(json.parentFormId);
            if (json.companyId) json.companyId = encodeId(json.companyId);
            if (json.branchId) json.branchId = encodeId(json.branchId);

            if (json.Company) {
                if (json.Company.id) json.Company.id = encodeId(json.Company.id);
            }

            if (json.Branch) {
                if (json.Branch.id) json.Branch.id = encodeId(json.Branch.id);
                if (json.Branch.companyId) json.Branch.companyId = encodeId(json.Branch.companyId);
                if (json.Branch.CompanyId) json.Branch.CompanyId = encodeId(json.Branch.CompanyId);
            }

            if (Array.isArray(json.FormFields)) {
                json.FormFields = json.FormFields.map(field => ({
                    ...field,
                    id: encodeId(field.id),
                    formId: encodeId(field.formId),
                    formSectionId: encodeId(field.formSectionId)
                }));
            }

            if (Array.isArray(json.FormTabs)) {
                json.FormTabs = json.FormTabs.map(tab => {
                    if (tab.id) tab.id = encodeId(tab.id);
                    if (tab.formId) tab.formId = encodeId(tab.formId);

                    if (Array.isArray(tab.SubForms)) {
                        tab.SubForms = tab.SubForms.map(subForm => {
                            if (subForm.id) subForm.id = encodeId(subForm.id);
                            if (subForm.formTabId) subForm.formTabId = encodeId(subForm.formTabId);

                            if (Array.isArray(subForm.FormFields)) {
                                subForm.FormFields = subForm.FormFields.map(field => {
                                    if (field.id) field.id = encodeId(field.id);
                                    if (field.subFormId) field.subFormId = encodeId(field.subFormId);
                                    if (field.formSectionId) field.formSectionId = encodeId(field.formSectionId);
                                    return field;
                                });
                            }

                            return subForm;
                        });
                    }

                    return tab;
                });
            }

            return json;
        });
    }

    async getById(id) {
        const form = await this.repository.findById(id);
        if (!form) return null;

        const result = form.toJSON();

        result.id = encodeId(result.id);
        if (result.parentFormId) result.parentFormId = encodeId(result.parentFormId);
        if (result.companyId) result.companyId = encodeId(result.companyId);
        if (result.branchId) result.branchId = encodeId(result.branchId);

        if (Array.isArray(result.FormTabs)) {
            result.FormTabs = result.FormTabs.map(tab => {
                if (tab.id) tab.id = encodeId(tab.id);
                if (tab.formId) tab.formId = encodeId(tab.formId);

                if (Array.isArray(tab.SubForms)) {
                    tab.SubForms = tab.SubForms.map(subForm => {
                        if (subForm.id) subForm.id = encodeId(subForm.id);
                        if (subForm.formTabId) subForm.formTabId = encodeId(subForm.formTabId);

                        if (Array.isArray(subForm.FormFields)) {
                            subForm.FormFields = subForm.FormFields.map(field => {
                                if (field.id) field.id = encodeId(field.id);
                                if (field.subFormId) field.subFormId = encodeId(field.subFormId);
                                if (field.formSectionId) field.formSectionId = encodeId(field.formSectionId);
                                return field;
                            });
                        }

                        return subForm;
                    });
                }

                return tab;
            });
        }

        return result;
    }

    async create(data){
        // const existing = await this.repository.findByName(data.name);

        // if(existing) {
        //     logger.warn('Form name is already exists', {Name: data.name});
        //     throw new Error('Form name is already exist!');
        // }
        const {FormTabs, ...formPayload} = data;

        ["companyId", "branchId", "parentFormId"].forEach(key => {
            if (formPayload[key] === "" || formPayload[key] === undefined) {
                formPayload[key] = null;
            }
        });

        ["companyId", "branchId", "parentFormId"].forEach(key => {
            if(formPayload[key]){
                formPayload[key] = decodeId(formPayload[key]);
            }
        });

        const form = await this.repository.create(formPayload);
        const formTabPayload = FormTabs.map(formtab => (
            {
                formId: form.id,
                name: formtab.name,
                display_name: formtab.display_name,
                status: formtab.status,
            }
        ))  

        await this.formTabService.create(formTabPayload)
        const formData = this.getById(form.id);
        return formData;
    }

    async update(id, data) {

        const {FormTabs, ...formPayload} = data;

        if (formPayload.name) {
            const existing = await this.repository.findByName(formPayload.name);
            if (existing && existing.id != id) {
                logger.warn('Form name is already exists', {Name: formPayload.name});
                throw new Error('Form name is already exist!');
            }
        }

        ["companyId", "branchId", "parentFormId"].forEach(key => {
            if (formPayload[key] === "" || formPayload[key] === undefined) {
                formPayload[key] = null;
            }
        });

        ["companyId", "branchId", "parentFormId"].forEach(key => {
            if(formPayload[key]){
                formPayload[key] = decodeId(formPayload[key]);
            }
        });

        await this.repository.update(id, formPayload);

        if (Array.isArray(FormTabs)) {
            for (const tab of FormTabs) {
                if (tab.id) {
                    await this.formTabService.update(decodeId(tab.id), {
                        name: tab.name,
                        display_name: tab.display_name,
                        status: tab.status
                    });
                }
                else {
                    await this.formTabService.create({
                        formId: id,
                        name: tab.name,
                        display_name: tab.display_name,
                        status: tab.status
                    });
                }
            }
        }
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