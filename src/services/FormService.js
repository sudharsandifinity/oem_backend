const logger = require("../config/logger");
const { encodeId, decodeId } = require("../utils/hashids");
const BaseService = require("./baseService");
const CompanyRepository = require("../repositories/CompanyRepository");

class FormService extends BaseService{

    constructor(FormRepository){
        super(FormRepository);
        this.companyRepository = new CompanyRepository();
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
        return result;
    }

    async create(data){
        const existing = await this.repository.findByName(data.name);

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

    async assignGlobalForms(companyId, globalFormIds) {

        // companyId = decodeId(companyId);
        globalFormIds = globalFormIds.map(globalFormId => decodeId(globalFormId));


        const idMap = {}; // oldId -> newId

        // Step 1: Duplicate forms
        for (const globalFormId of globalFormIds) {
            const globalForm = await this.repository.findById(globalFormId);
            if (!globalForm) continue;

            const formData = globalForm.toJSON();
            delete formData.id;
            delete formData.createdAt;
            delete formData.updatedAt;

            formData.companyId = companyId;
            formData.parentFormId = null; // fix later

            console.log('form data', formData);
            

            const newForm = await this.repository.create(formData);
            idMap[globalForm.id] = newForm.id;
        }

        // Step 2: Fix parentFormId relationships
        for (const [oldId, newId] of Object.entries(idMap)) {
            const globalForm = await this.repository.findById(oldId);

            if (globalForm.parentFormId && idMap[globalForm.parentFormId]) {
                await this.repository.update(newId, {
                    parentFormId: idMap[globalForm.parentFormId]
                });
            }
        }

        // Step 3: Return updated company forms
        return await this.repository.findByCompanyId(companyId);
    }

}

module.exports = FormService;