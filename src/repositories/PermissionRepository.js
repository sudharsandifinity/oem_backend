const { Permission } = require('../models');
const BaseRepository = require("./baseRepository");


class PermissionRepository extends BaseRepository{

    constructor(){
        super(Permission);
    }

}

module.exports = PermissionRepository;