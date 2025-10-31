const axios = require('axios');
const https = require('https');
const FormDataRepository = require('../repositories/FormDataRepository');
const FormDataService = require('../services/FormDataService');
const { decodeId } = require('../utils/hashids');
const formDataRepository = new FormDataRepository();
const formDataService = new FormDataService(formDataRepository);

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
  const { top = 20, skip = 0 } = req.query;

  try {
    const query = `/Orders?$orderby=DocEntry desc&$top=${top}&$skip=${skip}`;
    const response = await sapGetRequest(req, query);
    const sapOrders = response.data?.value || response.data || [];

    const formDatas = await formDataService.getAll();

    const formDataMap = {};
    formDatas.forEach(fd => {
      formDataMap[fd.DocEntry] = fd;
    });

    const merged = sapOrders.map(order => ({
      ...order,
      formData: formDataMap[order.DocEntry]?.data || null
    }));

    res.status(200).json({
      count: merged.length,
      data: merged
    });

  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Orders', error: err.message });
  }
};

const createOrders = async (req, res) => {
  try {
    const { data: formData, ...sapData } = req.body;

    const response = await sapPostRequest(req, "/Orders", sapData);

    if (response && response.data.DocEntry) {
        await formDataService.create({
          module: "Sales Order",
          DocEntry: response.data.DocEntry,
          data: formData || {}
        });
    }

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
    const { data: formData, ...sapData } = req.body;
    
    const orderResponse = await sapGetRequest(req, `/Orders(${docEntry})`);
    const order = orderResponse.data;

    if (!order) {
      return res.status(404).json({ message: `Order with DocEntry ${docEntry} not found` });
    }
    
    const sapResponse = await sapPutRequest(req, `/Orders(${docEntry})`, sapData);
    const FormDatas = await formDataService.getAll();
    const existingFormData = await FormDatas.find(fd => fd.DocEntry === docEntry);

    let updatedFormData;

    if (existingFormData) {
      updatedFormData = await formDataService.update(decodeId(existingFormData.id), {
        module: "Sales Order",
        DocEntry: docEntry,
        data: formData || {}
      });
    } else {
      updatedFormData = await formDataService.create({
        module: "Sales Order",
        DocEntry: docEntry,
        data: formData || {}
      });
    }

    const getUpdatedFormData = await formDataService.getById(decodeId(updatedFormData.id));

    const merged = {
      ...order,
      formData: getUpdatedFormData?.data || null
    };

    res.status(200).json({
      message: 'Order updated successfully',
      data: merged
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
    const order = response.data;

    if (!order) {
      return res.status(404).json({ message: `Order with DocEntry ${docEntry} not found` });
    }

    const formDatas = await formDataService.getAll();
    const formDataMap = {};
    formDatas.forEach(fd => {
      formDataMap[fd.DocEntry] = fd;
    });

    const merged = {
      ...order,
      formData: formDataMap[order.DocEntry]?.data || null
    };

    res.status(200).json(merged);
  } catch (err) {
    console.error('SAP getOrderById error:', err.message);
    res.status(500).json({ message: 'Error fetching order', error: err.message });
  }
};


const getPurchaseOrders = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/PurchaseOrders?$orderby=DocEntry desc");
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Orders', error: err.message });
  }
};

const createPurchaseOrders = async (req, res) => {
  try {
    const payload = req.body;

    const response = await sapPostRequest(req, "/PurchaseOrders", payload);

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

const updatePurchaseOrder = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;
    const payload = req.body;

    const response = await sapPutRequest(req, `/PurchaseOrders(${docEntry})`, payload);

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

const getPurchaseOrderById = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;
    const response = await sapGetRequest(req, `/PurchaseOrders(${docEntry})`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP getOrderById error:', err.message);
    res.status(500).json({ message: 'Error fetching order', error: err.message });
  }
};

const getVendors = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/BusinessPartners?$filter=CardType eq 'cSupplier'");
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching BusinessPartners', error: err.message });
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

const getServices = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/ChartOfAccounts?$select=Code,Name&$filter=ActiveAccount eq 'tYES'");
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Services', error: err.message });
  }
};

module.exports = { getBusinessPartners, getOrders, getItems, createOrders, updateOrder, getOrderById,
  getPurchaseOrders, createPurchaseOrders, updatePurchaseOrder, getPurchaseOrderById, getVendors, getServices
 };
