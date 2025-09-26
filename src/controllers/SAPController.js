const axios = require('axios');
const https = require('https');

const sapGetRequest = async (req, endpoint) => {
  const sessionId = req.cookies.B1SESSION;
  const routeId = req.cookies.ROUTEID;

  const url = `https://192.168.100.82:50000/b1s/v2${endpoint}`;

  return axios.get(url, {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    headers: {
      'Cookie': `B1SESSION=${sessionId}; ROUTEID=${routeId}`
    }
  });
};

const getBusinessPartners = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/BusinessPartners?$filter=CardType eq 'C'");
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching BusinessPartners', error: err.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/Orders");
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Orders', error: err.message });
  }
};

const getItems = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/Items?$select=ItemCode,ItemName,ForeignName");
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Items', error: err.message });
  }
};

module.exports = { getBusinessPartners, getOrders, getItems };
