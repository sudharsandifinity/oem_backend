const { User, Role, Branch, Company, UserRole, Permission } = require('../models');
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

}

module.exports = UserRepository;