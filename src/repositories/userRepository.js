const { Op } = require('sequelize');
const { User, Role, Branch, Company, UserMenu, UserBranch, Permission } = require('../models');
const BaseRepository = require('./baseRepository');

class UserRepository extends BaseRepository {
  
    constructor(){
        super(User)
    }

    async findAll() {
        return await this.model.findAll({
            include: [
                {
                    model: Role,
                    through: { attributes: [] },
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                    include: [
                    {
                        model: Permission,
                        through: { attributes: [] },
                        attributes: {exclude: ['createdAt', 'updatedAt']},
                    }
                    ]
                },
                {
                    model: Branch,
                    through: { attributes: [] },
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                    include: [
                        {
                            model: Company,
                            attributes: {exclude: ['createdAt', 'updatedAt']},
                        }
                    ]
                }
            ]
        });
    }

    async findById(id){
        return await this.model.findByPk(id, {
            include: [
                {
                    model: Role,
                    through: { attributes: [] },
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                    include: [
                        {
                            model: Permission,
                            through: { attributes: [] },
                            attributes: {exclude: ['createdAt', 'updatedAt']},
                        },
                        {
                            model: UserMenu,
                            attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
                            through: {
                                attributes: [
                                'can_list_view',
                                'can_create',
                                'can_edit',
                                'can_view',
                                'can_delete'
                                ]
                            },
                        }
                    ]
                },
                {
                    model: Branch,
                    through: { attributes: [] },
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                    include: [
                        {
                            model: Company,
                            attributes: {exclude: ['createdAt', 'updatedAt']},
                        }
                    ]
                }
            ]
        });
    }

    async findByEmail(email){
        return await this.model.findOne({ where: {email} });
    }

    async findByEmpId(empId){
        return await this.model.findOne({ where: {sap_emp_id: empId},
            include: [
                {
                    model: Role,
                    through: { attributes: [] },
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                    include: [
                        {
                            model: Permission,
                            through: { attributes: [] },
                            attributes: {exclude: ['createdAt', 'updatedAt']},
                        },
                        {
                            model: UserMenu,
                            attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
                            through: {
                                attributes: [
                                'can_list_view',
                                'can_create',
                                'can_edit',
                                'can_view',
                                'can_delete'
                                ]
                            },
                        }
                    ]
                },
                {
                    model: Branch,
                    through: { attributes: [] },
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                    include: [
                        {
                            model: Company,
                            attributes: {exclude: ['createdAt', 'updatedAt']},
                        }
                    ]
                }
            ]
        });
    }

    async getUserCompanyIds(userId) {

        console.log('uid repo', userId);
        const records = await UserBranch.findAll({
            where: { userId },
            attributes: ['companyId'],
            raw: true
        });
        console.log('recs', records);
        return [...new Set(records.map(r => r.companyId))];
    }

    async getUsersByCompanies(companyIds) {
        return await User.findAll({
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Branch,
                    required: true,
                    through: { attributes: [] },
                    include: [
                        {
                            model: Company,
                            where: {
                                id: {
                                    [Op.in]: companyIds
                                }
                            }
                        }
                    ]
                }
            ]
        });
    }

}

module.exports = UserRepository;