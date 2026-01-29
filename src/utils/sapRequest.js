const axios = require('axios');
const https = require('https');
const { SAPSession } = require('../models');
const AuthService = require('../services/AuthService.js');
const authService = new AuthService();


async function callSAP(req, method, endpoint, data = {}, headerCont = {}, options = {}) {
  const userId = req.user.id;
  const sapSession = await SAPSession.findOne({ where: { user_id: userId }, order: [['createdAt', 'DESC']] });
  if (!sapSession) throw new Error('SAP session not found. Please log in.');

  const headers = {
    headerCont,
    'Cookie': `B1SESSION=${sapSession.b1_session}; ROUTEID=${sapSession.route_id}`,
    'Prefer': 'odata.maxpagesize=0'
  };

   try {
    const config = {
      method,
      url: `${sapSession.base_url}/${endpoint}`,
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      responseType: options.responseType || 'json'
    };
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      config.data = data;
    }
    const res = await axios(config);

    return res;
  } catch (error) {
    if ([401].includes(error.response?.status)) {
      console.log('SAP session expired, refreshing...');
      // console.log('userId', userId);
      // console.log('req', req.user);
      await authService.sapLogin(req = {}, userId);
      return callSAP(userId, method, endpoint, data);
    }

    throw error;
  }
}


module.exports = { callSAP }