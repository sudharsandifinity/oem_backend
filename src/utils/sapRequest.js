import axios from 'axios';
import https from 'https';
const { SAPSession } = require('../models');


export async function callSAP(userId, method, endpoint, data = {}) {
  const sapSession = await SAPSession.findOne({ where: { user_id: userId } });
  if (!sapSession) throw new Error('SAP session not found. Please log in.');

  const headers = {
    'Content-Type': 'application/json',
    'Cookie': `B1SESSION=${sapSession.b1_session}; ROUTEID=${sapSession.route_id}`,
  };

  try {
    const res = await axios({
      method,
      url: `https://192.168.100.82:50000/b1s/v2/${endpoint}`,
      data,
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      timeout: 10000,
    });

    return res.data;
  } catch (error) {
    if ([401, 400].includes(error.response?.status)) {
      console.log('SAP session expired, refreshing...');
      const { sapLogin } = await import('../services/AuthService.js');
      await sapLogin(userId);
      return callSAP(userId, method, endpoint, data);
    }

    throw error;
  }
}
