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

const sapPostRequest = async (req, endpoint, payload) => {
  const sessionId = req.cookies.B1SESSION;
  const routeId = req.cookies.ROUTEID;

  const url = `https://192.168.100.82:50000/b1s/v2${endpoint}`;

  return axios.post(url, payload, {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    headers: {
      'Cookie': `B1SESSION=${sessionId}; ROUTEID=${routeId}`,
      'Content-Type': 'application/json'
    }
  });
};

const sapPutRequest = async (req, endpoint, payload) => {
  const sessionId = req.cookies.B1SESSION;
  const routeId = req.cookies.ROUTEID;

  const url = `https://192.168.100.82:50000/b1s/v2${endpoint}`;

  return axios.patch(url, payload, {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    headers: {
      'Cookie': `B1SESSION=${sessionId}; ROUTEID=${routeId}`,
      'Content-Type': 'application/json'
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

const createOrders = async (req, res) => {
  try {
    const payload = req.body;

    const response = await sapPostRequest(req, "/Orders", payload);

    res.status(201).json({
      message: 'Order created successfully',
      data: response.data
    });
  } catch (err) {
    console.error('SAP Order creation error:', err.message);
    res.status(500).json({
      message: 'Error creating Order in SAP',
      error: err.message
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;
    const payload = req.body;

    const response = await sapPutRequest(req, `/Orders(${docEntry})`, payload);

    res.status(200).json({
      message: 'Order updated successfully',
      data: response.data
    });
  } catch (err) {
    console.error('SAP Order update error:', err.message);
    res.status(500).json({
      message: 'Error updating Order in SAP',
      error: err.message
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;
    const response = await sapGetRequest(req, `/Orders(${docEntry})`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP getOrderById error:', err.message);
    res.status(500).json({ message: 'Error fetching order', error: err.message });
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

module.exports = { getBusinessPartners, getOrders, getItems, createOrders, updateOrder, getOrderById };
