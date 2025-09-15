const BaseRepository = require('./baseRepository');
const { Role, Permission, UserMenu, Company } = require('../models');

class RoleRepository extends BaseRepository{

    constructor(){
        super(Role);
    }

    async findAll(){
        return await this.model.findAll()
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
        });
    }
}

module.exports = RoleRepository;