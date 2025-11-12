const axios = require('axios');
const https = require('https');
const FormDataRepository = require('../repositories/FormDataRepository');
const FormDataService = require('../services/FormDataService');
const { decodeId } = require('../utils/hashids');
const formDataRepository = new FormDataRepository();
const formDataService = new FormDataService(formDataRepository);
const { callSAP } = require('../utils/sapRequest');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');

const sapGetRequest = async (req, endpoint) => {
  const userId = req.user.id;
  const data = await callSAP(userId, 'GET', endpoint);
  return data;
};

const sapPostRequest = async (req, endpoint, payload) => {
  const userId = req.user.id;
  const data = await callSAP(userId, 'POST', endpoint, payload);
  return data;
};

const sapPatchRequest = async (req, endpoint, payload) => {
    const userId = req.user.id;
    const data = await callSAP(userId, 'PATCH', endpoint, payload);
    return data;
};

const sapDeleteRequest = async (req, endpoint, payload) => {
    const userId = req.user.id;
    const data = await callSAP(userId, 'DELETE', endpoint, payload);
    return data;
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
    let { data: formData, DocumentLines, ...sapData } = req.body;

    if (typeof DocumentLines === 'string') {
      try {
        DocumentLines = JSON.parse(DocumentLines);
      } catch (err) {
        console.error('Failed to parse DocumentLines JSON:', err.message);
      }
    }

    let attachments = null;

    if (req.files && req.files.length > 0) {
      attachments = await createAttachment(req);
    }

    let payload = {
      ...sapData,
      DocumentLines,
    };

    if (attachments) {
      payload = {
        ...sapData,
        DocumentLines,
        AttachmentEntry: attachments.AbsoluteEntry,
      };
    }
    
    const response = await sapPostRequest(req, "/Orders", payload);

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
      error: err
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;
    const { data: formData, DocumentLines, ...sapData } = req.body;
    
    if (typeof DocumentLines === 'string') {
      try {
        DocumentLines = JSON.parse(DocumentLines);
      } catch (err) {
        console.error('Failed to parse DocumentLines JSON:', err.message);
      }
    }

    let attachments = null;

    if (req.files && req.files.length > 0) {
      attachments = await updateAttachment(req);
    }

    let payload = {
      ...sapData,
      DocumentLines,
    };

    if (attachments) {
      payload = {
        ...sapData,
        DocumentLines,
        AttachmentEntry: attachments.AbsoluteEntry,
      };
    }

    const orderResponse = await sapGetRequest(req, `/Orders(${docEntry})`);
    const order = orderResponse.data;

    if (!order) {
      return res.status(404).json({ message: `Order with DocEntry ${docEntry} not found` });
    }
    
    const sapResponse = await sapPatchRequest(req, `/Orders(${docEntry})`, payload);
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

    const response = await sapPatchRequest(req, `/PurchaseOrders(${docEntry})`, payload);

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
    const userId = req.user.id;
    // const response = await sapGetRequest(req, "/BusinessPartners?$filter=CardType eq 'cSupplier'");
    const data = await callSAP(userId, 'GET', `BusinessPartners?$filter=CardType eq 'cSupplier'`);
    res.status(200).json(data);
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

const getSOTax = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/VatGroups?$filter=Category eq 'O'");
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Services', error: err.message });
  }
};

const getPOTax = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/VatGroups?$filter=Category eq 'I'");
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Services', error: err.message });
  }
};

const getFreight = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/AdditionalExpenses");
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Services', error: err.message });
  }
};

const getAttachments = async (req, res) => {  
  try {    
    const response = await sapGetRequest(req, "/Attachments2");    
    res.status(200).json(response.data);  
  } catch (err) {    
      console.error('SAP error:', err.message);    
      res.status(500).json({ message: 'Error fetching BusinessPartners', error: err.message 
    });  
  }}

const getAttachment = async (req, res) => {  
  try {    
      const response = await sapGetRequest(req,  `/Attachments2(${req.params.id})`);    
      res.status(200).json(response.data);  
  } catch (err) {    
      console.error('SAP error:', err.message);    
      res.status(500).json({ message: 'Error fetching BusinessPartners', error: err.message
    });  
  }}

const createAttachment = async (req, res) => {
  try {
    const files = req.files;
    if(!files) return;
    const attachmentMeta = {
      Attachments2_Lines: files.map(file =>
        ({ 
            FileName: file.originalname.split(".").shift(),
            FileExtension: file.originalname.split(".").pop(), 
            SourcePath: path.resolve(file.destination) 
          })
      ),
    };

    const response = await sapPostRequest(req, '/Attachments2', attachmentMeta);            
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};

const updateAttachment = async (req, res) => {
  try {
    const id = req.params.id;
    const files = req.files;
    if(!files) return;

    const attachmentMeta = {
      Attachments2_Lines: files.map(file =>
        ({ 
            FileName: file.originalname.split(".").shift(),
            FileExtension: file.originalname.split(".").pop(), 
            SourcePath: path.resolve(file.destination) 
          })
      ),
    };

    const response = await sapPatchRequest(req, `/Attachments2(${id})`, attachmentMeta);
    return response.data;
  } catch (err) {
    console.error('SAP Attachment update error:', err.message);
    res.status(500).json({
      message: 'Error updating Attachment in SAP',
      error: err
    });
  }
};

const deleteAttachment = async (req, res) => {  
  try {    
    const response = await sapDeleteRequest(req, `/Attachments2/${req.params.id}`);   
    res.status(200).json({ message: 'Attachment deleted successfully', data: response.data });  
  } catch (err) {    
    console.error('SAP error:', err.message);    
    res.status(500).json({ message: 'Error deleting Attachment', error: err.message });  
  }
}


module.exports = { getBusinessPartners, getOrders, getItems, createOrders, updateOrder, getOrderById,
  getPurchaseOrders, createPurchaseOrders, updatePurchaseOrder, getPurchaseOrderById, getVendors, getServices, getSOTax, getPOTax, getFreight,
  getAttachments, getAttachment, createAttachment, updateAttachment, deleteAttachment
 };
