const { Notification } = require('../models');
const BaseRepository = require("./baseRepository")


class NotificationRepository extends BaseRepository {

    constructor(){
        super(Notification)
    }

}

module.exports = NotificationRepository;