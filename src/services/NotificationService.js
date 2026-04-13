const admin = require('../config/firebase');
const { Notification, DeviceToken } = require('../models');
const BaseService = require('./baseService');

class NotificationService extends BaseService{

  constructor(NotificationRepository){
    super(NotificationRepository);
  }

  async getByUser(id) {
    const usernotifications = await Notification.findAll({ where: { 'userId':id }});
    return usernotifications;
  }

  async sendPushNotification(deviceToken, title, body, customData = {}) {
    try {
      const message = {
        notification: {
          title: title,
          body: body,
        },
        android: {
          notification: {
            color: '#354e80ff', 
          }
        },
        data: customData,
        token: deviceToken
      };

      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  };

  async sendMulticast(tokens, title, body, customData = {}) {
    try {
      if (!tokens.length) return;

      const message = {
        notification: { title, body },
        data: customData,
        tokens: tokens
      };

      const response = await admin.messaging().sendEachForMulticast(message);

      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.log("Invalid token:", tokens[idx]);
        }
      });

      return response;
    } catch (error) {
      console.error("Multicast error:", error);
    }
  }

  async createAndSend(data) {

    console.log('createndsend');
    const notification = await this.repository.create(data);
    console.log('snotification', notification);
    
    // const tokensData = await deviceTokenService.getByUser(data.userId);
    const tokensData = await DeviceToken.findAll({ where: {userId: data.userId} });
    console.log('tokenddata', tokensData);
    
    const tokens = tokensData.map(t => t.token);

    console.log('ssrvice tokens', tokens);
    
    await this.sendMulticast(
      tokens,
      data.title,
      data.body || "You have a new notification",
      {
        type: data.type || "",
        referenceId: String(data.referenceId || ""),
        url: data.url || ""
      }
    );

    return notification;
  }

}

module.exports = NotificationService;