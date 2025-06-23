const BaseRepository = require('./baseRepository');
const { Role, Permission } = require('../models');

class RoleRepository extends BaseRepository{

    constructor(){
        super(Role);
    }

    async findAll(){
        return await this.model.findAll({ include: Permission })
    }

    async findById(id){
        return await this.model.findByPk(id, {include: Permission});
    }

    async findByIdWithPermissions(id) {
        return await this.model.findByPk(id, {
            include: Permission,
        });
    }
}

module.exports = RoleRepository;