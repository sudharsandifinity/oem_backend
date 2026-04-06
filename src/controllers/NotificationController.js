// const { sendPushNotification } = require('../services/notificationService');
// // Assume you have a User model or database setup
// // const User = require('../models/User'); 

// // 1. Save the token from the mobile app
// const saveDeviceToken = async (req, res) => {
//   try {
//     const { userId, fcmToken } = req.body;

//     if (!userId || !fcmToken) {
//       return res.status(400).json({ error: 'userId and fcmToken are required' });
//     }

//     // TODO: Save this token to your database under the user's record
//     // await User.findByIdAndUpdate(userId, { fcmToken: fcmToken });

//     res.status(200).json({ message: 'Token saved successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to save token' });
//   }
// };

// // 2. A test endpoint to trigger a notification (useful for development)
// const testNotification = async (req, res) => {
//   try {
//     const { deviceToken } = req.body;
    
//     await sendPushNotification(
//       deviceToken,
//       'Test Alert',
//       'This is a test notification from your Express backend!',
//       { route: 'ExpenseScreen' }
//     );

//     res.status(200).json({ message: 'Notification sent!' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to send notification' });
//   }
// };

// module.exports = {
//   saveDeviceToken,
//   testNotification
// };

const BaseController = require("./BaseController");

class NotificationController extends BaseController {

  constructor(NotificationService){
    super(NotificationService, "Notification");
  }

}

module.exports = NotificationController;