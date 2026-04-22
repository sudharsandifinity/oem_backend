const BaseController = require("./BaseController");

class DeviceTokenController extends BaseController {

  constructor(DeviceTokenService){
    super(DeviceTokenService, "Device Token");
  }

  create = async (req, res) => {
      try{
          const item = await this.service.create(req);
          return res.status(201).json(item);
      }catch(error){
          this.handleError(res, `creating the ${this.entityName}`, error);
      }
  }

  getUserTokens = async (req, res) => {
      try{
          const notifications = await this.service.getByUser(req.user.id);
          return res.status(200).json(notifications);
      }catch(error){
          this.handleError(res, `getting ${this.entityName}s`, error);
      }
  }

}

module.exports = DeviceTokenController;