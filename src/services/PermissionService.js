const BaseService = require("./baseService");


class PermissionService extends BaseService {

    constructor(PermissionRepository){
        super(PermissionRepository);
    }

}

module.exports = PermissionService;