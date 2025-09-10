const { User, Role, Branch, UserRole, Permission } = require('../models');
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
                include: [
                {
                    model: Permission,
                    through: { attributes: [] }
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
                include: [
                {
                    model: Permission,
                    through: { attributes: [] }
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