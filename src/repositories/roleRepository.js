const BaseRepository = require('./baseRepository');
const { Role, Permission } = require('../models');

class RoleRepository extends BaseRepository{

    constructor(){
        super(Role);
    }

    async findAll(){
        return await this.model.findAll({
            include: [
                {
                    model: Permission,
                    through: { attributes: [] }
                }
            ]
        })
    }

    async findById(id){
        return await this.model.findByPk(id, {
            include: [
                {
                    model: Permission,
                    through: { attributes: [] }
                }
            ]
        });
    }
}

module.exports = RoleRepository;