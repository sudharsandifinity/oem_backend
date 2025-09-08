const BaseRepository = require("./baseRepository");
const { UserMenu, Form, FormField } = require('../models');

class UserMenuRepository extends BaseRepository {

    constructor(){
        super(UserMenu);
    }

    async findAll() {
        return await this.model.findAll({
            include: [
            {
                model: Form,
                include: [FormField],
            },
            ],
        });
    }

    async findById(id) {
        return await this.model.findByPk(id, {
            include: [
            {
                model: Form,
                include: [FormField],
            },
            ],
        });
    }

}

module.exports = UserMenuRepository;