const BaseRepository = require("./baseRepository");
const { UserMenuPermission, UserMenu } = require('../models');

class UserMenuPermissionRepository extends BaseRepository {

    constructor(){
        super(UserMenuPermission)
    }

    async findAll() {
        return await this.model.findAll({
            include: [{
                model: UserMenu,
                as: 'menu'
            }]
        });
    }

    async findById(id) {
        return await this.model.findByPk(id, {
            include: [{
                model: UserMenu,
                as: 'menu'
            }]
        });
    }

}

module.exports = UserMenuPermissionRepository;