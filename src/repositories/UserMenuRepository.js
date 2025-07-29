const BaseRepository = require("./baseRepository");
const { UserMenu } = require('../models');

class UserMenuRepository extends BaseRepository {

    constructor(){
        super(UserMenu);
    }

}

module.exports = UserMenuRepository;