const BaseRepository = require("./baseRepository");
const { UserMenu, Form } = require('../models');

class UserMenuRepository extends BaseRepository {

    constructor(){
        super(UserMenu);
    }

    async findAll(){
        return await this.model.findAll({ include: Form });
    }

}

module.exports = UserMenuRepository;