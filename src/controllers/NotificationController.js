const BaseController = require("./BaseController");

class NotificationController extends BaseController {

  constructor(NotificationService){
    super(NotificationService, "Notification");
  }

  getUserNotifications = async (req, res) => {
    try{
      const notifications = await this.service.getByUser(req.user.id);
      return res.status(200).json(notifications);
    }catch(error){
      this.handleError(res, `getting ${this.entityName}s`, error);
    }
  }

}

module.exports = NotificationController;