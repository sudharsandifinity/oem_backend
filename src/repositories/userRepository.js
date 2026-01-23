const { User, Role, Branch, Company, UserMenu, Permission } = require('../models');
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

}

module.exports = UserRepository;