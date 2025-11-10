const axios = require('axios');
const https = require('https');
const FormDataRepository = require('../repositories/FormDataRepository');
const FormDataService = require('../services/FormDataService');
const { decodeId } = require('../utils/hashids');
const formDataRepository = new FormDataRepository();
const formDataService = new FormDataService(formDataRepository);
const { callSAP } = require('../utils/sapRequest');
const FormData = require('form-data');

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

const sapPutRequest = async (req, endpoint, payload) => {
    const userId = req.user.id;
    const data = await callSAP(userId, 'PATCH', endpoint, payload);
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

const uploadToSAP = async (req, res) => {

  try {
    const payload = req.file;
    console.log('file data', payload);

    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // console.log('form', form);
    
    if (!payload) return res.status(400).json({ message: 'No file uploaded' });
    const response = await sapPostRequest(req, "/Attachments2", form);
    res.status(201).json({
      message: 'Attachment created successfully',
      data: response.data
    });
  } catch (err) {
    console.error('Attachment creation error:', err.message);
    res.status(500).json({
      message: 'Attachment creating in SAP',
      error: err.message
    });
  }
  // try {
  //   // console.log('body:', req.body);
  //   // console.log('file:', req.file);
  //   if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  //   // return
  //   const { id: userId } = req.user;

  //   // 1️⃣ Get SAP session for this user
  //   const sapSession = await SAPSession.findOne({ where: { user_id: userId } });
  //   if (!sapSession) {
  //     return res.status(401).json({ message: 'SAP session not found. Please log in.' });
  //   }

  //   // 2️⃣ Prepare SAP headers
  //   const headers = {
  //     'Content-Type': 'multipart/form-data',
  //     'Cookie': `B1SESSION=${sapSession.b1_session}; ROUTEID=${sapSession.route_id}`
  //   };

  //   // 3️⃣ Create form-data for SAP upload
  //   const FormData = require('form-data');
  //   const form = new FormData();

  //   form.append('file', req.file.buffer, {
  //     filename: req.file.originalname,
  //     contentType: req.file.mimetype
  //   });

  //   // 4️⃣ Send to SAP
  //   const sapResponse = await axios.post(
  //     'https://192.168.100.82:50000/b1s/v2/Attachments2',
  //     form,
  //     {
  //       headers: { ...form.getHeaders(), ...headers },
  //       httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  //       timeout: 10000
  //     }
  //   );

  //   return res.status(200).json({
  //     message: 'File uploaded to SAP successfully',
  //     sapData: sapResponse.data
  //   });

  // } catch (err) {
  //   console.error('SAP Upload Error:', err.message);
  //   res.status(500).json({ message: 'SAP upload failed', error: err.message });
  // }
};

const attachementCreate = async(req, res) => {
  try{
    const payload = {
      "Attachments2_Lines": [
        {
          "FileExtension": "jpg",
          "FileName": "boy-ghost-walking-through-autumn-street",
          "SourcePath": "C:\\Users\\adm_pam\\Downloads",
          "UserID": "1"   // optional but often required by SAP B1 Service Layer
        }
      ]
    };
    console.log("Payload sent to SAP:", JSON.stringify(payload, null, 2));
    const response = await sapPostRequest(req, "/Attachments2", payload);
    res.status(201).json({
      message: 'Attachment created successfully',
      data: response.data
    });
  } catch (error){
    console.error('Attachment creation error:', err.message);
    res.status(500).json({
      message: 'Attachment creating in SAP',
      error: err
    });
  }
}

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
  
const uploadFile = (req, res) => {  if (!req.file) {    return res.status(400).send('No file uploaded');  }
  // You can log or process the file here  console.log('Uploaded file details:', req.file);
  return res.status(200).json({    message: 'File uploaded successfully!',    file: req.file,  });};

const createAttachments = async (req, res) => {  
  try {    
    console.log('file:', req.file);    
    console.log('body:', req.body);
    // Check if file exists    
    const file = req.file;    
    if (!file) {      
      console.error('No file uploaded');      
      return res.status(400).json({ message: 'No file uploaded' });    
    }
    console.log('File details:', file);
    // Prepare the file data to send to SAP    
    const fileData = {      
      fileName: file.originalname,  // Original file name      
      mimeType: file.mimetype,      // MIME type of the file (e.g., 'application/pdf')      
      fileData: file.buffer,        // File content (binary data)    
    };
    try {      
      // Send file data to SAP API      
      const response = await sapPostRequest(req, '/Attachments2', fileData);            
      // Send SAP response back to client      
      res.status(200).json(response.data);    
    } catch (sapError) {      
      // Handle any errors from SAP      
      console.error('Error while sending data to SAP:', sapError.message);      
      res.status(500).json({ message: 'Error creating Attachment in SAP', error: sapError.message });    
    }  
  } catch (err) {    
    // Handle unexpected errors    
    console.error('Unexpected error during attachment creation:', err.message);    
    res.status(500).json({ message: 'Unexpected error occurred', error: err.message });  
  }};
const updateAttachment = async (req, res) => {  try {    const response = await sapPutRequest(req, `/Attachments2/${req.params.id}`);    res.status(200).json(response.data);  } catch (err) {    console.error('SAP error:', err.message);    res.status(500).json({ message: 'Error updating Attachment', error: err.message });  }}
const deleteAttachment = async (req, res) => {  try {    const response = await (req, `/Attachments2/${req.params.id}`);    res.status(200).json({ message: 'Attachment deleted successfully', data: response.data });  } catch (err) {    console.error('SAP error:', err.message);    res.status(500).json({ message: 'Error deleting Attachment', error: err.message });  }}


module.exports = { getBusinessPartners, getOrders, getItems, createOrders, updateOrder, getOrderById,
  getPurchaseOrders, createPurchaseOrders, updatePurchaseOrder, getPurchaseOrderById, getVendors, getServices, getSOTax, getPOTax, getFreight,
  getAttachments, getAttachment, createAttachments, uploadToSAP, attachementCreate
 };
