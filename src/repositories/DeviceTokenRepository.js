const { DeviceToken } = require('../models');
const BaseRepository = require("./baseRepository")


class DeviceTokenRepository extends BaseRepository {

    constructor(){
        super(DeviceToken)
    }

}

module.exports = DeviceTokenRepository;