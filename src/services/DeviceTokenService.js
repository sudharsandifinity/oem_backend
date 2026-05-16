const BaseService = require('./baseService');
const { DeviceToken } = require('../models');
const { encodeId } = require('../utils/hashids');

class DeviceTokenService extends BaseService{

  constructor(DeviceTokenRepository){
    super(DeviceTokenRepository)
  }

  async getByUser(id) {
    const usernotifications = await DeviceToken.findAll({ where: { 'userId':id }});
    return usernotifications;
  }

  // async create(req){
  //   let payload = {
  //       "userId": req.user.id || null,
  //       "token": req.body.token || null,
  //       "platform": req.body.platform || null
  //   }

  //   const item = await this.repository.create(payload);
  //   const result = item.toJSON();
  //   result.id = encodeId(result.id);
  //   return result;
  // }

  async create(req) {
    const payload = {
      userId: req.user.id || null,
      token: req.body.token || null,
      platform: req.body.platform || null
    };

    const [item] = await DeviceToken.findOrCreate({
      where: { token: payload.token },
      defaults: payload
    });

    const result = item.toJSON();
    result.id = encodeId(result.id);
    return result;
  }

}

module.exports = DeviceTokenService;