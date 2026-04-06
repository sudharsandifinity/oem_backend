const admin = require('../config/firebase');
const BaseService = require('./baseService');

class NotificationService extends BaseService{

  constructor(NotificationRepository){
    super(NotificationRepository)
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

}

module.exports = NotificationService;