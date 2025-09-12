const BaseRepository = require('./baseRepository');
const { Role, Permission, UserMenu } = require('../models');

class RoleRepository extends BaseRepository{

    constructor(){
        super(Role);
    }

    async findAll(){
        return await this.model.findAll({
            include: [
                {
                    model: Permission,
                    through: { attributes: [] },
                    attributes: { exclude: ['status', 'createdAt', 'updatedAt'] }
                },
                {
                    model: UserMenu,
                    through: { attributes: [] },
                    attributes: { exclude: ['status', 'createdAt', 'updatedAt'] }
                }
            ]
        })
    }

    async findById(id){
        return await this.model.findByPk(id, {
            include: [
                {
                    model: Permission,
                    through: { attributes: [] },
                    attributes: { exclude: ['status', 'createdAt', 'updatedAt'] }
                },
                {
                    model: UserMenu,
                    through: { attributes: [] },
                    attributes: { exclude: ['status', 'createdAt', 'updatedAt'] }
                }
            ]
        });
    }
}

module.exports = RoleRepository;