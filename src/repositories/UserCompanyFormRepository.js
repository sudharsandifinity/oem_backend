const BaseRepository = require("./baseRepository");
const { UserCompanyForm, CompanyFormField, User } = require('../models');
const { encodeId } = require("../utils/hashids");

class UserCompanyFormRepository extends BaseRepository {

    constructor(){
        super(UserCompanyForm)
    }

    async findAll() {
        return await this.model.findAll({
            attributes: {
                exclude: ['companyFormFieldId', 'userId', 'UserId', 'CompanyFormFieldId']
            },
            include: [
                {
                    model: CompanyFormField,
                    attributes: {
                        exclude: ['formId', 'companyId', 'formSectionId']
                    }
                },
                {
                    model: User,
                    attributes: {
                        exclude: ['roleId', 'password']
                    }
                }
            ]
        });
    }

    async findById(id) {
        
        const userCompanyFormData = await this.model.findByPk(id, {
            attributes: {
            exclude: ['companyFormFieldId', 'userId', 'CompanyFormFieldId']
            },
            include: [
                {
                    model: CompanyFormField,
                    attributes: {
                        exclude: ['formId', 'companyId', 'formSectionId']
                    }
                },
                {
                    model: User,
                    attributes: {
                        exclude: ['roleId', 'RoleId', 'password']
                    }
                }
            ]
        });

        return userCompanyFormData;
    }

}

module.exports = UserCompanyFormRepository;
