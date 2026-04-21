const axios = require("axios");
const https = require("https");
const FormDataRepository = require("../repositories/FormDataRepository");
const FormDataService = require("../services/FormDataService");
const { decodeId } = require("../utils/hashids");
const formDataRepository = new FormDataRepository();
const formDataService = new FormDataService(formDataRepository);
const { callSAP } = require("../utils/sapRequest");
const FormData = require("form-data");
const path = require("path");
const fs = require("fs");

const sapGetRequest = async (req, endpoint) => {
  const data = await callSAP(req, 'GET', endpoint);
  return data;
};

const sapPostRequest = async (req, endpoint, payload, headers = {}) => {
  const data = await callSAP(req, 'POST', endpoint, payload, headers);
  return data;
};

const sapPatchRequest = async (req, endpoint, payload) => {
    const data = await callSAP(req, 'PATCH', endpoint, payload);
    return data;
};

const sapDeleteRequest = async (req, endpoint, payload) => {
    const data = await callSAP(req, 'DELETE', endpoint, payload);
    return data;
};

const getDocumentAdditionalExpenses = (DocumentAdditionalExpenses) => {

  try {
       if (Array.isArray(DocumentAdditionalExpenses)) {
  const parsedDocumentAdditionalExpenses = DocumentAdditionalExpenses.map(exp => ({
    ExpensCode: exp.ExpensCode ?? 1,
    LineTotal: Number(exp.LineTotal),
    TaxCode: exp.TaxCode || "A2",
    VatGroup: exp.VatGroup || "A2"
  }));
  return parsedDocumentAdditionalExpenses;
}
    
  } catch (err) {
    console.error("Failed to parse DocumentAdditionalExpenses JSON:", err.message);
    return [];
  }
};


const getBusinessPartners = async (req, res) => {
  try {
    const response = await sapGetRequest(
      req,
      "/BusinessPartners?$filter=CardType eq 'C'"
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching BusinessPartners", error: err.message });
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
    formDatas.forEach((fd) => {
      formDataMap[fd.DocEntry] = fd;
    });

    const merged = sapOrders.map((order) => ({
      ...order,
      formData: formDataMap[order.DocEntry]?.data || null,
    }));

    res.status(200).json({
      count: merged.length,
      data: merged,
    });
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching Orders", error: err.message });
  }
};
const createOrders1 = async (req, res) => {
  try {
    let { data: formData, DocumentLines, DocumentAdditionalExpenses, ...sapData } = req.body;

    if (typeof DocumentLines === 'string') {
      try {
        DocumentLines = JSON.parse(DocumentLines);
      } catch (err) {
        console.error('Failed to parse DocumentLines JSON:', err.message);
      }
    }

    if (typeof DocumentAdditionalExpenses === 'string') {
      try {
        DocumentAdditionalExpenses = JSON.parse(DocumentAdditionalExpenses);
      } catch (err) {
        console.error('Failed to parse DocumentAdditionalExpenses JSON:', err.message);
      }
    }

    let attachments = null;

    if (req.files && req.files.length > 0) {
      attachments = await createAttachment(req, res);
    }

    let payload = {
      ...sapData,
      DocumentLines,
      DocumentAdditionalExpenses
    };

    if (attachments) {
      payload = {
        ...sapData,
        DocumentLines,
        DocumentAdditionalExpenses,
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
const createOrders = async (req, res) => {
  try {
    let {
      data: formData,
      DocumentLines,
      DocumentAdditionalExpenses,
      ...sapData
    } = req.body;
    sapData.BPL_IDAssignedToInvoice = "1";

    if (typeof DocumentLines === "string") {
      try {
        DocumentLines = JSON.parse(DocumentLines);
      } catch (err) {
        console.error("Failed to parse DocumentLines JSON:", err.message);
      }
    }

    if (typeof DocumentAdditionalExpenses === "string") {
      try {
        DocumentAdditionalExpenses = getDocumentAdditionalExpenses(DocumentAdditionalExpenses);//JSON.parse(DocumentAdditionalExpenses);
      } catch (err) {
        console.error(
          "Failed to parse DocumentAdditionalExpenses JSON:",
          err.message
        );
      }
    }

    let attachments = null;

    if (req.files && req.files.length > 0) {
      attachments = await createAttachment(req, res);
    }

    let payload = {
      ...sapData,
      DocumentLines,
      DocumentAdditionalExpenses,
    };

    if (attachments) {
      payload = {
        ...sapData,
        DocumentLines,
        DocumentAdditionalExpenses,
        AttachmentEntry: attachments.AbsoluteEntry,
      };
    }

    const response = await sapPostRequest(req, "/Orders", payload);

    if (response && response.data.DocEntry) {
      await formDataService.create({
        module: "Sales Order",
        DocEntry: response.data.DocEntry,
        data: formData || {},
      });
    }

    res.status(201).json({
      message: "Order created successfully",
      data: response.data,
    });
  } catch (err) {
    console.error(
      "SAP Order update error:",
      err?.response?.data || err.message
    );

    if (err.response?.data?.error) {
      return res.status(400).json({
        message: err.response.data.error.message,
        code: err.response.data.error.code,
        details: err.response.data.error.details,
      });
    }

    res.status(500).json({
      message: "Unexpected error updating Order",
      error: err.message,
    });
  }
};
const updateOrder = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;
    let {
      data: formData,
      DocumentLines,
      DocumentAdditionalExpenses,
      ...sapData
    } = req.body;
    sapData.BPL_IDAssignedToInvoice = "1";

    // Fetch existing order from SAP
    const orderResponse = await sapGetRequest(req, `/Orders(${docEntry})`);
    const order = orderResponse.data;

    // Parse JSON strings if needed
    if (typeof DocumentLines === "string") {
      try {
        DocumentLines = JSON.parse(DocumentLines);
      } catch (err) {
        console.error("Failed to parse DocumentLines JSON:", err.message);
      }
    }

    if (typeof DocumentAdditionalExpenses === "string") {
      try {
                DocumentAdditionalExpenses = JSON.parse(DocumentAdditionalExpenses);//JSON.parse(DocumentAdditionalExpenses);

      } catch (err) {
        console.error(
          "Failed to parse DocumentAdditionalExpenses JSON:",
          err.message
        );
      }
    }

    // Handle attachments
    let attachments = null;
    if (req.files && req.files.length > 0) {
      attachments = await updateAttachment(
        req,
        res,
        null,
        order.AttachmentEntry
      );
    }

    // Build SAP payload
    let payload = {
      ...sapData,
      DocumentLines,
      DocumentAdditionalExpenses,
    };

    if (attachments) {
      payload = {
        ...sapData,
        DocumentLines,
        DocumentAdditionalExpenses,
        AttachmentEntry: attachments.AbsoluteEntry,
      };
    }
    if (!order) {
      return res
        .status(404)
        .json({ message: `Order with DocEntry ${docEntry} not found` });
    }

    // PATCH SAP Order
    const sapResponse = await sapPatchRequest(
      req,
      `/Orders(${docEntry})`,
      payload
    );

    // ===== Upsert Form Data =====
    // Using one call instead of if/else

    const upsertPayload = {
      module: "Sales Order",
      DocEntry: docEntry,
      data: formData || {},
    };
    const FormDatas = await formDataService.getAll();
    const existingFormData =await FormDatas.find((fd) => fd.DocEntry === docEntry);
    let updatedFormData;
    if (existingFormData) {
      updatedFormData = await formDataService.update(
        decodeId(existingFormData.id),
        upsertPayload
      );
    } else {
      updatedFormData = await formDataService.create(upsertPayload);
    }

    // Fetch the latest data
    const getUpdatedFormData = await formDataService.getById(
      decodeId(updatedFormData.id)
    );

    // Merge SAP order + form data
    const merged = {
      ...order,
      formData: getUpdatedFormData?.data || null,
    };

    res.status(201).json({
      message: "Order updated successfully",
      data: merged,
    });
  } catch (err) {
    console.error(
      "SAP Order update error:",
      err?.response?.data || err.message
    );

    if (err.response?.data?.error) {
      return res.status(400).json({
        message: err.response.data.error.message,
        code: err.response.data.error.code,
        details: err.response.data.error.details,
      });
    }

    res.status(500).json({
      message: "Unexpected error updating Order",
      error: err.message,
    });
  }
};

const updateOrder1 = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;
    const {
      data: formData,
      DocumentLines,
      DocumentAdditionalExpenses,
      ...sapData
    } = req.body;

    const orderResponse = await sapGetRequest(req, `/Orders(${docEntry})`);
    const order = orderResponse.data;

    if (typeof DocumentLines === "string") {
      try {
        DocumentLines = JSON.parse(DocumentLines);
      } catch (err) {
        console.error("Failed to parse DocumentLines JSON:", err.message);
      }
    }

    if (typeof DocumentAdditionalExpenses === "string") {
      try {
        DocumentAdditionalExpenses = getDocumentAdditionalExpenses(DocumentAdditionalExpenses);//JSON.parse(DocumentAdditionalExpenses);

      } catch (err) {
        console.error(
          "Failed to parse DocumentAdditionalExpenses JSON:",
          err.message
        );
      }
    }

    let attachments = null;

    if (req.files && req.files.length > 0) {
      attachments = await updateAttachment(
        req,
        res,
        null,
        order.AttachmentEntry
      );
    }

    let payload = {
      ...sapData,
      DocumentAdditionalExpenses,
      DocumentLines,
    };

    if (attachments) {
      payload = {
        ...sapData,
        DocumentLines,
        DocumentAdditionalExpenses,
        AttachmentEntry: attachments.AbsoluteEntry,
      };
    }

    if (!order) {
      return res
        .status(404)
        .json({ message: `Order with DocEntry ${docEntry} not found` });
    }

    const sapResponse = await sapPatchRequest(
      req,
      `/Orders(${docEntry})`,
      payload
    );
    const FormDatas = await formDataService.getAll();
    const existingFormData = await FormDatas.find(
      (fd) => fd.DocEntry === docEntry
    );

    let updatedFormData;

    if (existingFormData) {
      updatedFormData = await formDataService.update(
        decodeId(existingFormData.id),
        {
          module: "Sales Order",
          DocEntry: docEntry,
          data: formData || {},
        }
      );
    } else {
      updatedFormData = await formDataService.create({
        module: "Sales Order",
        DocEntry: docEntry,
        data: formData || {},
      });
    }

    const getUpdatedFormData = await formDataService.getById(
      decodeId(updatedFormData.id)
    );

    const merged = {
      ...order,
      formData: getUpdatedFormData?.data || null,
    };

    res.status(201).json({
      message: "Order updated successfully",
      data: merged,
    });
  } catch (err) {
    console.error(
      "SAP Order update error:",
      err?.response?.data || err.message
    );

    if (err.response?.data?.error) {
      return res.status(400).json({
        message: err.response.data.error.message,
        code: err.response.data.error.code,
        details: err.response.data.error.details,
      });
    }

    res.status(500).json({
      message: "Unexpected error updating Order",
      error: err.message,
    });
  }
};

const getSalesQuotationById = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;

    const response = await sapGetRequest(req, `/Quotations(${docEntry})`);
    const order = response.data;

    if (!order) {
      return res
        .status(404)
        .json({ message: `SalesQuotations ${docEntry} not found` });
    }

    const formDatas = await formDataService.getAll();
    const formDataMap = {};
    formDatas.forEach((fd) => {
      formDataMap[fd.DocEntry] = fd;
    });

    const merged = {
      ...order,
      formData: formDataMap[order.DocEntry]?.data || null,
    };

    res.status(200).json(merged);
  } catch (err) {
    console.error("SAP getSalesQuotationById error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching order", error: err.message });
  }
};

const getSalesQuotations = async (req, res) => {
  const { top = 20, skip = 0 } = req.query;

  try {
    const query = `/Quotations?$orderby=DocEntry desc&$top=${top}&$skip=${skip}`;
    const response = await sapGetRequest(req, query);
    const sapQuotations = response.data?.value || response.data || [];

    const formDatas = await formDataService.getAll();

    const formDataMap = {};
    formDatas.forEach((fd) => {
      formDataMap[fd.DocEntry] = fd;
    });

    const merged = sapQuotations.map((order) => ({
      ...order,
      formData: formDataMap[order.DocEntry]?.data || null,
    }));
// console.log("getquotation",res)
    res.status(200).json({
      count: merged.length,
      data: merged,
    });
  } catch (err) {
    console.error("SAP error:", err.message,err);
    res
      .status(500)
      .json({ message: "Error fetching Quotations", error: err.message });
  }
};

const createSalesQuotations = async (req, res) => {
  try {
    let {
      data: formData,
      DocumentLines,
      DocumentAdditionalExpenses,
      ...sapData
    } = req.body;
    sapData.BPL_IDAssignedToInvoice = "1";

    if (typeof DocumentLines === "string") {
      try {
        DocumentLines = JSON.parse(DocumentLines);
      } catch (err) {
        console.error("Failed to parse DocumentLines JSON:", err.message);
      }
    }

    if (typeof DocumentAdditionalExpenses === "string") {
      try {
        DocumentAdditionalExpenses = JSON.parse(DocumentAdditionalExpenses);//JSON.parse(DocumentAdditionalExpenses);

      } catch (err) {
        console.error(
          "Failed to parse DocumentAdditionalExpenses JSON:",
          err.message
        );
      }
    }

    let attachments = null;

    if (req.files && req.files.length > 0) {
      attachments = await createAttachment(req);
    }

    let payload = {
      ...sapData,
      DocumentAdditionalExpenses,
      DocumentLines,
    };

    if (attachments) {
      payload = {
        ...sapData,
        DocumentLines,
        DocumentAdditionalExpenses,
        AttachmentEntry: attachments.AbsoluteEntry,
      };
    }

    const response = await sapPostRequest(req, "/Quotations", payload);

    if (response && response.data.DocEntry) {
      await formDataService.create({
        module: "SalesQuotation",
        DocEntry: response.data.DocEntry,
        data: formData || {},
      });
    }

    res.status(201).json({
      message: "SalesQuotations created successfully",
      data: response.data,
    });
  } catch (err) {
    // catch (err) {
    //   console.error('SAP SalesQuotations creation error:', err.message);
    //   res.status(500).json({
    //     message: 'Error creating SalesQuotations in SAP',
    //     error: err
    //   });
    // }
    console.error(
      "SAP Order update error:",
      err?.response?.data || err.message
    );

    if (err.response?.data?.error) {
      return res.status(400).json({
        message: err.response.data.error.message,
        code: err.response.data.error.code,
        details: err.response.data.error.details,
      });
    }

    res.status(500).json({
      message: "Unexpected error updating Order",
      error: err.message,
    });
  }
};

const updateSalesQuotations = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;
    let {
      data: formData,
      DocumentLines,
      DocumentAdditionalExpenses,
      ...sapData
    } = req.body;
  sapData.BPL_IDAssignedToInvoice = "1";
    
    if (typeof DocumentLines === "string") {
      try {
        DocumentLines = JSON.parse(DocumentLines);
      } catch (err) {
        console.error("Failed to parse DocumentLines JSON:", err.message);
      }
    }

    if (typeof DocumentAdditionalExpenses === "string") {
      try {
        DocumentAdditionalExpenses = JSON.parse(DocumentAdditionalExpenses);//JSON.parse(DocumentAdditionalExpenses);

      } catch (err) {
        console.error(
          "Failed to parse DocumentAdditionalExpenses JSON:",
          err.message
        );
      }
    }

    let attachments = null;

    if (req.files && req.files.length > 0) {
      attachments = await updateAttachment(req);
    }

    let payload = {
      ...sapData,
      DocumentAdditionalExpenses,
      DocumentLines,
    };

    if (attachments) {
      payload = {
        ...sapData,
        DocumentLines,
        AttachmentEntry: attachments.AbsoluteEntry,
        DocumentAdditionalExpenses,
      };
    }

    const orderResponse = await sapGetRequest(req, `/Quotations(${docEntry})`);
    const order = orderResponse.data;

    if (!order) {
      return res
        .status(404)
        .json({ message: `SalesQuotations ${docEntry} not found` });
    }

    const sapResponse = await sapPatchRequest(
      req,
      `/Quotations(${docEntry})`,
      payload
    );
    const FormDatas = await formDataService.getAll();
    const existingFormData = await FormDatas.find(
      (fd) => fd.DocEntry === docEntry
    );
    let usertpayload={
          module: "SalesQuotation",
          DocEntry: docEntry,
          data: formData || {},
        }

    let updatedFormData;

    if (existingFormData) {
      updatedFormData = await formDataService.update(
        decodeId(existingFormData.id),usertpayload        
      );
    } else {
      updatedFormData = await formDataService.create(usertpayload);
    }

    const getUpdatedFormData = await formDataService.getById(
      decodeId(updatedFormData.id)
    );

    const merged = {
      ...order,
      formData: getUpdatedFormData?.data || null,
    };

    res.status(200).json({
      message: "SalesQuotations updated successfully",
      data: merged,
    });
  } catch (err) {
    console.error(
      "SAP Order update error:",
      err?.response?.data || err.message
    );

    if (err.response?.data?.error) {
      return res.status(400).json({
        message: err.response.data.error.message,
        code: err.response.data.error.code,
        details: err.response.data.error.details,
      });
    }

    res.status(500).json({
      message: "Unexpected error updating Order",
      error: err.message,
    });
  }
};

const createPurchaseQuotations = async (req, res) => {
  try {
    let {
      data: formData,
      DocumentLines,
      DocumentAdditionalExpenses,
      ...sapData
    } = req.body;
    sapData.BPL_IDAssignedToInvoice = "1";

    if (typeof DocumentLines === "string") {
      try {
        DocumentLines = JSON.parse(DocumentLines);
      } catch (err) {
        console.error("Failed to parse DocumentLines JSON:", err.message);
      }
    }

    if (typeof DocumentAdditionalExpenses === "string") {
      try {
        DocumentAdditionalExpenses = JSON.parse(DocumentAdditionalExpenses);//JSON.parse(DocumentAdditionalExpenses);

      } catch (err) {
        console.error(
          "Failed to parse DocumentAdditionalExpenses JSON:",
          err.message
        );
      }
    }

    let attachments = null;

    if (req.files && req.files.length > 0) {
      attachments = await createAttachment(req);
    }

    let payload = {
      ...sapData,
      DocumentAdditionalExpenses,
      DocumentLines,
    };

    if (attachments) {
      payload = {
        ...sapData,
        DocumentLines,
        DocumentAdditionalExpenses,
        AttachmentEntry: attachments.AbsoluteEntry,
      };
    }

    const response = await sapPostRequest(req, "/PurchaseQuotations", payload);

    if (response && response.data.DocEntry) {
      await formDataService.create({
        module: "PurchaseQuotation",
        DocEntry: response.data.DocEntry,
        data: formData || {},
      });
    }

    res.status(201).json({
      message: "PurchaseQuotation created successfully",
      data: response.data,
    });
  } catch (err) {
    console.error(
      "SAP Order update error:",
      err?.response?.data || err.message
    );

    if (err.response?.data?.error) {
      return res.status(400).json({
        message: err.response.data.error.message,
        code: err.response.data.error.code,
        details: err.response.data.error.details,
      });
    }

    res.status(500).json({
      message: "Unexpected error updating Order",
      error: err.message,
    });
  }
};

const updatePurchaseQuotations = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;
    let {
      data: formData,
      DocumentLines,
      DocumentAdditionalExpenses,
      ...sapData
    } = req.body;
    sapData.BPL_IDAssignedToInvoice = "1";

    if (typeof DocumentLines === "string") {
      try {
        DocumentLines = JSON.parse(DocumentLines);
      } catch (err) {
        console.error("Failed to parse DocumentLines JSON:", err.message);
      }
    }

    if (typeof DocumentAdditionalExpenses === "string") {
      try {
        DocumentAdditionalExpenses = JSON.parse(DocumentAdditionalExpenses);//JSON.parse(DocumentAdditionalExpenses);

      } catch (err) {
        console.error(
          "Failed to parse DocumentAdditionalExpenses JSON:",
          err.message
        );
      }
    }

    let attachments = null;

    if (req.files && req.files.length > 0) {
      attachments = await updateAttachment(req);
    }

    let payload = {
      ...sapData,
      DocumentLines,
      DocumentAdditionalExpenses,
    };

    if (attachments) {
      payload = {
        ...sapData,
        DocumentLines,
        DocumentAdditionalExpenses,
        AttachmentEntry: attachments.AbsoluteEntry,
      };
    }

    const orderResponse = await sapGetRequest(
      req,
      `/PurchaseQuotations(${docEntry})`
    );
    const order = orderResponse.data;

    if (!order) {
      return res
        .status(404)
        .json({ message: `PurchaseQuotations ${docEntry} not found` });
    }

    const sapResponse = await sapPatchRequest(
      req,
      `/PurchaseQuotations(${docEntry})`,
      payload
    );
    const FormDatas = await formDataService.getAll();
    const existingFormData = await FormDatas.find(
      (fd) => fd.DocEntry === docEntry
    );

    let updatedFormData;
let upsertPayload={
          module: "PurchaseQuotation",
          DocEntry: docEntry,
          data: formData || {},
        }
    if (existingFormData) {
      updatedFormData = await formDataService.update(
        decodeId(existingFormData.id),upsertPayload
        
      );
    } else {
      updatedFormData = await formDataService.create(upsertPayload);
    }

    const getUpdatedFormData = await formDataService.getById(
      decodeId(updatedFormData.id)
    );

    const merged = {
      ...order,
      formData: getUpdatedFormData?.data || null,
    };

    res.status(200).json({
      message: "PurchaseQuotation updated successfully",
      data: merged,
    });
  } catch (err) {
    console.error(
      "SAP Order update error:",
      err?.response?.data || err.message
    );

    if (err.response?.data?.error) {
      return res.status(400).json({
        message: err.response.data.error.message,
        code: err.response.data.error.code,
        details: err.response.data.error.details,
      });
    }

    res.status(500).json({
      message: "Unexpected error updating Order",
      error: err.message,
    });
  }
};

const getPurchaseQuotationById = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;

    const response = await sapGetRequest(
      req,
      `/PurchaseQuotations(${docEntry})`
    );
    const order = response.data;

    if (!order) {
      return res
        .status(404)
        .json({ message: `PurchaseQuotation ${docEntry} not found` });
    }

    const formDatas = await formDataService.getAll();
    const formDataMap = {};
    formDatas.forEach((fd) => {
      formDataMap[fd.DocEntry] = fd;
    });

    const merged = {
      ...order,
      formData: formDataMap[order.DocEntry]?.data || null,
    };

    res.status(200).json(merged);
  } catch (err) {
    console.error("SAP getPurchaseQuotationById error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching order", error: err.message });
  }
};

const getPurchaseQuotations = async (req, res) => {
  const { top = 20, skip = 0 } = req.query;

  try {
    const query = `/PurchaseQuotations?$orderby=DocEntry desc&$top=${top}&$skip=${skip}`;
    const response = await sapGetRequest(req, query);
    const sapQuotations = response.data?.value || response.data || [];

    const formDatas = await formDataService.getAll();

    const formDataMap = {};
    formDatas.forEach((fd) => {
      formDataMap[fd.DocEntry] = fd;
    });

    const merged = sapQuotations.map((order) => ({
      ...order,
      formData: formDataMap[order.DocEntry]?.data || null,
    }));

    res.status(200).json({
      count: merged.length,
      data: merged,
    });
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({
        message: "Error fetching PurchaseQuotations",
        error: err.message,
      });
  }
};
//purchase requests
const createPurchaseRequests = async (req, res) => {
  try {
    let {
      data: formData,
      DocumentLines,
      DocumentAdditionalExpenses,
      ...sapData
    } = req.body;
    sapData.BPL_IDAssignedToInvoice = "1";

    if (typeof DocumentLines === "string") {
      try {
        DocumentLines = JSON.parse(DocumentLines);
      } catch (err) {
        console.error("Failed to parse DocumentLines JSON:", err.message);
      }
    }

    if (typeof DocumentAdditionalExpenses === "string") {
      try {
        DocumentAdditionalExpenses = JSON.parse(DocumentAdditionalExpenses);//JSON.parse(DocumentAdditionalExpenses);

      } catch (err) {
        console.error(
          "Failed to parse DocumentAdditionalExpenses JSON:",
          err.message
        );
      }
    }

    let attachments = null;

    if (req.files && req.files.length > 0) {
      attachments = await createAttachment(req);
    }

    let payload = {
      ...sapData,
      DocumentAdditionalExpenses,
      DocumentLines,
    };

    if (attachments) {
      payload = {
        ...sapData,
        DocumentLines,
        DocumentAdditionalExpenses,
        AttachmentEntry: attachments.AbsoluteEntry,
      };
    }

    const response = await sapPostRequest(req, "/PurchaseRequests", payload);

    if (response && response.data.DocEntry) {
      await formDataService.create({
        module: "PurchaseRequest",
        DocEntry: response.data.DocEntry,
        data: formData || {},
      });
    }

    res.status(201).json({
      message: "PurchaseRequest created successfully",
      data: response.data,
    });
  } catch (err) {
    console.error(
      "SAP Order update error:",
      err?.response?.data || err.message
    );

    if (err.response?.data?.error) {
      return res.status(400).json({
        message: err.response.data.error.message,
        code: err.response.data.error.code,
        details: err.response.data.error.details,
      });
    }

    res.status(500).json({
      message: "Unexpected error updating Order",
      error: err.message,
    });
  }
};

const updatePurchaseRequests = async (req, res) => {
  console.log("updatepurchase",req.body)
  try {
    const docEntry = req.params.docEntry;
    let {
      data: formData,
      DocumentLines,
      DocumentAdditionalExpenses,
      ...sapData
    } = req.body;
    sapData.BPL_IDAssignedToInvoice = "1";

    if (typeof DocumentLines === "string") {
      try {
        DocumentLines = JSON.parse(DocumentLines);
      } catch (err) {
        console.error("Failed to parse DocumentLines JSON:", err.message);
      }
    }

    if (typeof DocumentAdditionalExpenses === "string") {
      try {
        DocumentAdditionalExpenses = JSON.parse(DocumentAdditionalExpenses);//JSON.parse(DocumentAdditionalExpenses);

      } catch (err) {
        console.error(
          "Failed to parse DocumentAdditionalExpenses JSON:",
          err.message
        );
      }
    }

    let attachments = null;

    if (req.files && req.files.length > 0) {
      attachments = await updateAttachment(req);
    }

    let payload = {
      ...sapData,
      DocumentLines,
      DocumentAdditionalExpenses,
    };

    if (attachments) {
      payload = {
        ...sapData,
        DocumentLines,
        DocumentAdditionalExpenses,
        AttachmentEntry: attachments.AbsoluteEntry,
      };
    }

    const orderResponse = await sapGetRequest(
      req,
      `/PurchaseRequests(${docEntry})`
    );
    const order = orderResponse.data;

    if (!order) {
      return res
        .status(404)
        .json({ message: `PurchaseRequests ${docEntry} not found` });
    }

    const sapResponse = await sapPatchRequest(
      req,
      `/PurchaseRequests(${docEntry})`,
      payload
    );
    const FormDatas = await formDataService.getAll();
    const existingFormData = await FormDatas.find(
      (fd) => fd.DocEntry === docEntry
    );

    let updatedFormData;
let upsertPayload={
          module: "PurchaseRequest",
          DocEntry: docEntry,
          data: formData || {},
        }
    if (existingFormData) {
      updatedFormData = await formDataService.update(
        decodeId(existingFormData.id),upsertPayload
        
      );
    } else {
      updatedFormData = await formDataService.create(upsertPayload);
    }

    const getUpdatedFormData = await formDataService.getById(
      decodeId(updatedFormData.id)
    );

    const merged = {
      ...order,
      formData: getUpdatedFormData?.data || null,
    };

    res.status(200).json({
      message: "PurchaseRequest updated successfully",
      data: merged,
    });
  } catch (err) {
    console.error(
      "SAP Order update error:",
      err?.response?.data || err.message
    );

    if (err.response?.data?.error) {
      return res.status(400).json({
        message: err.response.data.error.message,
        code: err.response.data.error.code,
        details: err.response.data.error.details,
      });
    }

    res.status(500).json({
      message: "Unexpected error updating Order",
      error: err.message,
    });
  }
};

const getPurchaseRequestById = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;

    const response = await sapGetRequest(
      req,
      `/PurchaseRequests(${docEntry})`
    );
    const order = response.data;

    if (!order) {
      return res
        .status(404)
        .json({ message: `PurchaseRequest ${docEntry} not found` });
    }

    const formDatas = await formDataService.getAll();
    const formDataMap = {};
    formDatas.forEach((fd) => {
      formDataMap[fd.DocEntry] = fd;
    });

    const merged = {
      ...order,
      formData: formDataMap[order.DocEntry]?.data || null,
    };

    res.status(200).json(merged);
  } catch (err) {
    console.error("SAP getPurchaseRequestById error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching order", error: err.message });
  }
};

const getPurchaseRequests = async (req, res) => {
  const { top = 20, skip = 0 } = req.query;

  try {
    const query = `/PurchaseRequests?$orderby=DocEntry desc&$top=${top}&$skip=${skip}`;
    const response = await sapGetRequest(req, query);
    const sapRequests = response.data?.value || response.data || [];

    const formDatas = await formDataService.getAll();

    const formDataMap = {};
    formDatas.forEach((fd) => {
      formDataMap[fd.DocEntry] = fd;
    });

    const merged = sapRequests.map((order) => ({
      ...order,
      formData: formDataMap[order.DocEntry]?.data || null,
    }));

    res.status(200).json({
      count: merged.length,
      data: merged,
    });
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({
        message: "Error fetching PurchaseRequests",
        error: err.message,
      });
  }
};
//purhcase requests
const getOrderById = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;

    const response = await sapGetRequest(req, `/Orders(${docEntry})`);
    const order = response.data;

    if (!order) {
      return res
        .status(404)
        .json({ message: `Order with DocEntry ${docEntry} not found` });
    }

    const formDatas = await formDataService.getAll();
    const formDataMap = {};
    formDatas.forEach((fd) => {
      formDataMap[fd.DocEntry] = fd;
    });

    const merged = {
      ...order,
      formData: formDataMap[order.DocEntry]?.data || null,
    };

    res.status(200).json(merged);
  } catch (err) {
    console.error("SAP getOrderById error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching order", error: err.message });
  }
};

const getPurchaseOrders = async (req, res) => {
  try {
    const response = await sapGetRequest(
      req,
      "/PurchaseOrders?$orderby=DocEntry desc"
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching Orders", error: err.message });
  }
};
const createPurchaseOrders = async (req, res) => {
  console.log("Creating Purchase Order with data:", req.body);
  try {
    let {
      data: formData,
      DocumentLines,
      DocumentAdditionalExpenses,
      ...sapData
    } = req.body;
    sapData.BPL_IDAssignedToInvoice = "1";

    if (typeof DocumentLines === "string") {
      try {
        DocumentLines = JSON.parse(DocumentLines);
      } catch (err) {
        console.error("Failed to parse DocumentLines JSON:", err.message);
      }
    }

    if (typeof DocumentAdditionalExpenses === "string") {
      try {
        DocumentAdditionalExpenses = JSON.parse(DocumentAdditionalExpenses);//JSON.parse(DocumentAdditionalExpenses);

      } catch (err) {
        console.error(
          "Failed to parse DocumentAdditionalExpenses JSON:",
          err.message
        );
      }
    }

    let attachments = null;

    if (req.files && req.files.length > 0) {
      attachments = await createAttachment(req, res);
    }

    let payload = {
      ...sapData,
      DocumentLines,
      DocumentAdditionalExpenses,
    };

    if (attachments) {
      payload = {
        ...sapData,
        DocumentLines,
        DocumentAdditionalExpenses,
        AttachmentEntry: attachments.AbsoluteEntry,
      };
    }

    const response = await sapPostRequest(req, "/PurchaseOrders", payload);

    if (response && response.data.DocEntry) {
      await formDataService.create({
        module: "Purchase Order",
        DocEntry: response.data.DocEntry,
        data: formData || {},
      });
    }

    res.status(201).json({
      message: "Order created successfully",
      data: response.data,
    });
  } catch (err) {
    console.error(
      "SAP Order update error:",
      err?.response?.data || err.message
    );

    if (err.response?.data?.error) {
      return res.status(400).json({
        message: err.response.data.error.message,
        code: err.response.data.error.code,
        details: err.response.data.error.details,
      });
    }

    res.status(500).json({
      message: "Unexpected error updating Order",
      error: err.message,
    });
  }
};
const createPurchaseOrders1 = async (req, res) => {
  try {
    const payload = req.body;

    const response = await sapPostRequest(req, "/PurchaseOrders", payload);

    res.status(201).json({
      message: "Order created successfully",
      data: response.data,
    });
  } catch (err) {
    console.error(
      "SAP Order update error:",
      err?.response?.data || err.message
    );

    if (err.response?.data?.error) {
      return res.status(400).json({
        message: err.response.data.error.message,
        code: err.response.data.error.code,
        details: err.response.data.error.details,
      });
    }

    res.status(500).json({
      message: "Unexpected error updating Order",
      error: err.message,
    });
  }
};
const updatePurchaseOrder = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;
    let {
      data: formData,
      DocumentLines,
      DocumentAdditionalExpenses,
      ...sapData
    } = req.body;
    sapData.BPL_IDAssignedToInvoice = "1";

    // Fetch existing order from SAP
    const orderResponse = await sapGetRequest(req, `/PurchaseOrders(${docEntry})`);
    const order = orderResponse.data;

    // Parse JSON strings if needed
    if (typeof DocumentLines === "string") {
      try {
        DocumentLines = JSON.parse(DocumentLines);
      } catch (err) {
        console.error("Failed to parse DocumentLines JSON:", err.message);
      }
    }

    if (typeof DocumentAdditionalExpenses === "string") {
      try {
        DocumentAdditionalExpenses = JSON.parse(DocumentAdditionalExpenses);//JSON.parse(DocumentAdditionalExpenses);

      } catch (err) {
        console.error(
          "Failed to parse DocumentAdditionalExpenses JSON:",
          err.message
        );
      }
    }

    // Handle attachments
    let attachments = null;
    if (req.files && req.files.length > 0) {
      attachments = await updateAttachment(
        req,
        res,
        null,
        order.AttachmentEntry
      );
    }

    // Build SAP payload
    let payload = {
      ...sapData,
      DocumentLines,
      DocumentAdditionalExpenses,
    };

    if (attachments) {
      payload = {
        ...sapData,
        DocumentLines,
        DocumentAdditionalExpenses,
        AttachmentEntry: attachments.AbsoluteEntry,
      };
    }
    if (!order) {
      return res
        .status(404)
        .json({ message: `Order with DocEntry ${docEntry} not found` });
    }

    // PATCH SAP Order
    const sapResponse = await sapPatchRequest(
      req,
      `/PurchaseOrders(${docEntry})`,
      payload
    );

    // ===== Upsert Form Data =====
    // Using one call instead of if/else

    const upsertPayload = {
      module: "Purchase Order",
      DocEntry: docEntry,
      data: formData || {},
    };
    const FormDatas = await formDataService.getAll();
    const existingFormData =await FormDatas.find((fd) => fd.DocEntry === docEntry);
    let updatedFormData;
    if (existingFormData) {
      updatedFormData = await formDataService.update(
        decodeId(existingFormData.id),
        upsertPayload
      );
    } else {
      updatedFormData = await formDataService.create(upsertPayload);
    }

    // Fetch the latest data
    const getUpdatedFormData = await formDataService.getById(
      decodeId(updatedFormData.id)
    );

    // Merge SAP order + form data
    const merged = {
      ...order,
      formData: getUpdatedFormData?.data || null,
    };

    res.status(201).json({
      message: "Order updated successfully",
      data: merged,
    });
  } catch (err) {
    console.error(
      "SAP Order update error:",
      err?.response?.data || err.message
    );

    if (err.response?.data?.error) {
      return res.status(400).json({
        message: err.response.data.error.message,
        code: err.response.data.error.code,
        details: err.response.data.error.details,
      });
    }

    res.status(500).json({
      message: "Unexpected error updating Order",
      error: err.message,
    });
  }
}
const updatePurchaseOrder1 = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;
    const payload = req.body;

    const response = await sapPatchRequest(
      req,
      `/PurchaseOrders(${docEntry})`,
      payload
    );

    res.status(200).json({
      message: "Order updated successfully",
      data: response.data,
    });
  } catch (err) {
    console.error(
      "SAP Order update error:",
      err?.response?.data || err.message
    );

    if (err.response?.data?.error) {
      return res.status(400).json({
        message: err.response.data.error.message,
        code: err.response.data.error.code,
        details: err.response.data.error.details,
      });
    }

    res.status(500).json({
      message: "Unexpected error updating Order",
      error: err.message,
    });
  }
};

const getPurchaseOrderById = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;
    const response = await sapGetRequest(req, `/PurchaseOrders(${docEntry})`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP getOrderById error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching order", error: err.message });
  }
};

const getVendors = async (req, res) => {
  try {
    const response = await sapGetRequest(
      req,
      `BusinessPartners?$filter=CardType eq 'cSupplier'`
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching BusinessPartners", error: err.message });
  }
};

const getItems = async (req, res) => {
  try {
    const response = await sapGetRequest(
      req,
      "/Items?$select=ItemCode,ItemName,ForeignName"
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching Items", error: err.message });
  }
};

const getServices = async (req, res) => {
  try {
    const response = await sapGetRequest(
      req,
      "/ChartOfAccounts?$select=Code,Name&$filter=ActiveAccount eq 'tYES'"
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching Services", error: err.message });
  }
};

const getItemPrices = async (req, res) => {
  try {
    console.log("getitemprice",req.query)
    const { cardCode, itemCode } = req.query;
    const filter = `CardCode eq '${cardCode}' and ItemCode eq '${itemCode}'`;
const response = await sapGetRequest(req, `/SpecialPrices?$filter=${encodeURIComponent(filter)}`);
// console.log("responsefetchprice",response)
    // const response = await sapGetRequest(
    //   req,
    //   `/SpecialPrices?$filter=CardCode eq '${cardCode}' and ItemCode eq '${itemCode}'`
    // );
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching Item Prices", error: err.message });
  };
  
};

const getPurchaseDeliveryNotes = async (req, res) => {
  try {
    const response = await sapGetRequest(
      req,
      "/PurchaseDeliveryNotes?$orderby=DocEntry desc"
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching Orders", error: err.message });
  }
};

const createPurchaseDeliveryNotes = async (req, res) => {
  try {
    let {
      data: formData,
      DocumentLines,
      DocumentAdditionalExpenses,
      ...sapData
    } = req.body;
    sapData.BPL_IDAssignedToInvoice = "1";

    if (typeof DocumentLines === "string") {
      try {
        DocumentLines = JSON.parse(DocumentLines);
      } catch (err) {
        console.error("Failed to parse DocumentLines JSON:", err.message);
      }
    }

    if (typeof DocumentAdditionalExpenses === "string") {
      try {
        DocumentAdditionalExpenses = JSON.parse(DocumentAdditionalExpenses);//JSON.parse(DocumentAdditionalExpenses);

      } catch (err) {
        console.error(
          "Failed to parse DocumentAdditionalExpenses JSON:",
          err.message
        );
      }
    }

    let attachments = null;

    if (req.files && req.files.length > 0) {
      attachments = await createAttachment(req, res);
    }

    let payload = {
      ...sapData,
      DocumentLines,
      DocumentAdditionalExpenses,
    };

    if (attachments) {
      payload = {
        ...sapData,
        DocumentLines,
        DocumentAdditionalExpenses,
        AttachmentEntry: attachments.AbsoluteEntry,
      };
    }

    const response = await sapPostRequest(req, "/PurchaseDeliveryNotes", payload);

    if (response && response.data.DocEntry) {
      await formDataService.create({
        module: "Purchase Order",
        DocEntry: response.data.DocEntry,
        data: formData || {},
      });
    }

    res.status(201).json({
      message: "Purchase Delivery Notes created successfully",
      data: response.data,
    });
  } catch (err) {
    console.error(
      "SAP Order update error:",
      err?.response?.data || err.message
    );

    if (err.response?.data?.error) {
      return res.status(400).json({
        message: err.response.data.error.message,
        code: err.response.data.error.code,
        details: err.response.data.error.details,
      });
    }

    res.status(500).json({
      message: "Unexpected error updating PurchaseDelivery Notes",
      error: err.message,
    });
  }
};

const getPurchaseDeliveryNotesById = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;
    const response = await sapGetRequest(req, `/PurchaseDeliveryNotes(${docEntry})`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP PurchaseDeliveryNote error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching order", error: err.message });
  }
};

const updatePurchaseDeliveryNote = async (req, res) => {
  try {
    const docEntry = req.params.docEntry;
    let {
      data: formData,
      DocumentLines,
      DocumentAdditionalExpenses,
      ...sapData
    } = req.body;
    sapData.BPL_IDAssignedToInvoice = "1";

    // Fetch existing order from SAP
    const orderResponse = await sapGetRequest(req, `/PurchaseDeliveryNotes(${docEntry})`);
    const order = orderResponse.data;

    // Parse JSON strings if needed
    if (typeof DocumentLines === "string") {
      try {
        DocumentLines = JSON.parse(DocumentLines);
      } catch (err) {
        console.error("Failed to parse DocumentLines JSON:", err.message);
      }
    }

    if (typeof DocumentAdditionalExpenses === "string") {
      try {
        DocumentAdditionalExpenses = JSON.parse(DocumentAdditionalExpenses);//JSON.parse(DocumentAdditionalExpenses);

      } catch (err) {
        console.error(
          "Failed to parse DocumentAdditionalExpenses JSON:",
          err.message
        );
      }
    }

    // Handle attachments
    let attachments = null;
    if (req.files && req.files.length > 0) {
      attachments = await updateAttachment(
        req,
        res,
        null,
        order.AttachmentEntry
      );
    }

    // Build SAP payload
    let payload = {
      ...sapData,
      DocumentLines,
      DocumentAdditionalExpenses,
    };

    if (attachments) {
      payload = {
        ...sapData,
        DocumentLines,
        DocumentAdditionalExpenses,
        AttachmentEntry: attachments.AbsoluteEntry,
      };
    }
    if (!order) {
      return res
        .status(404)
        .json({ message: `Order with DocEntry ${docEntry} not found` });
    }

    // PATCH SAP Order
    const sapResponse = await sapPatchRequest(
      req,
      `/PurchaseDeliveryNotes(${docEntry})`,
      payload
    );

    // ===== Upsert Form Data =====
    // Using one call instead of if/else

    const upsertPayload = {
      module: "Purchase Delivery Note",
      DocEntry: docEntry,
      data: formData || {},
    };
    const FormDatas = await formDataService.getAll();
    const existingFormData =await FormDatas.find((fd) => fd.DocEntry === docEntry);
    let updatedFormData;
    if (existingFormData) {
      updatedFormData = await formDataService.update(
        decodeId(existingFormData.id),
        upsertPayload
      );
    } else {
      updatedFormData = await formDataService.create(upsertPayload);
    }

    // Fetch the latest data
    const getUpdatedFormData = await formDataService.getById(
      decodeId(updatedFormData.id)
    );

    // Merge SAP order + form data
    const merged = {
      ...order,
      formData: getUpdatedFormData?.data || null,
    };

    res.status(201).json({
      message: "PurchaseDeliveryNote updated successfully",
      data: merged,
    });
  } catch (err) {
    console.error(
      "SAP PurchaseDeliveryNote update error:",
      err?.response?.data || err.message
    );

    if (err.response?.data?.error) {
      return res.status(400).json({
        message: err.response.data.error.message,
        code: err.response.data.error.code,
        details: err.response.data.error.details,
      });
    }

    res.status(500).json({
      message: "Unexpected error updating Order",
      error: err.message,
    });
  }
}


const getDimensions = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/Dimensions");
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching Dimesion", error: err.message });
  }
};

const getProfitCenters = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/ProfitCenters");
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching Profit Centers", error: err.message });
  }
};
const getProjects = async (req, res) => {
  try {
    const response = await sapGetRequest(
      req,
      "/Projects?$select=Code,Name,ValidFrom,Active"
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching Services", error: err.message });
  }
};

const getWarehouses = async (req, res) => {
  try {
    const response = await sapGetRequest(
      req,
      "/Warehouses?$select=WarehouseCode,WarehouseName,Inactive"
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching Services", error: err.message });
  }
};

const getSOTax = async (req, res) => {
  try {
    const response = await sapGetRequest(
      req,
      "/VatGroups?$filter=Category eq 'O'"
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching Services", error: err.message });
  }
};

const getPOTax = async (req, res) => {
  try {
    const response = await sapGetRequest(
      req,
      "/VatGroups?$filter=Category eq 'I'"
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching Services", error: err.message });
  }
};

const getFreight = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/AdditionalExpenses");
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching Services", error: err.message });
  }
};

const getAttachments = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/Attachments2");
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching BusinessPartners", error: err.message });
  }
};

const getAttachment = async (req, res) => {
  try {
    const response = await sapGetRequest(
      req,
      `/Attachments2(${req.params.id})`
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching BusinessPartners", error: err.message });
  }
};

const createAttachment = async (req, res) => {
  try {
    const files = req.files;
    if (!files) return;
    const attachmentMeta = {
      Attachments2_Lines: files.map((file) => ({
        FileName: file.originalname.split(".").shift(),
        FileExtension: file.originalname.split(".").pop(),
        SourcePath: path.resolve(file.destination),
      })),
    };

    const response = await sapPostRequest(req, "/Attachments2", attachmentMeta);
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};

const updateAttachment = async (req, res, next, attachmentId) => {
  try {
    const id = attachmentId || req.params.id;
    const files = req.files;
    if (!files) return;

    const attachmentMeta = {
      Attachments2_Lines: files.map((file) => ({
        FileName: file.originalname.split(".").shift(),
        FileExtension: file.originalname.split(".").pop(),
        SourcePath: path.resolve(file.destination),
      })),
    };

    const response = await sapPatchRequest(
      req,
      `/Attachments2(${id})`,
      attachmentMeta
    );
    return response.data;
  } catch (err) {
    console.error("SAP Attachment update error:", err.message);
    res.status(500).json({
      message: "Error updating Attachment in SAP",
      error: err,
    });
  }
};

const deleteAttachment = async (req, res) => {
  try {
    const response = await sapDeleteRequest(
      req,
      `/Attachments2/${req.params.id}`
    );
    res
      .status(200)
      .json({
        message: "Attachment deleted successfully",
        data: response.data,
      });
  } catch (err) {
    console.error("SAP error:", err.message);
    res
      .status(500)
      .json({ message: "Error deleting Attachment", error: err.message });
  }
};

module.exports = {
  getBusinessPartners,
  getOrders,
  getItems,
  createOrders,
  updateOrder,
  getOrderById,
  getPurchaseOrders,
  createPurchaseOrders,
  updatePurchaseOrder,
  getPurchaseOrderById,
  getVendors,
  getServices,
  getItemPrices,
  getDimensions,
  getProfitCenters,
  getProjects,
  getWarehouses,
  getSOTax,
  getPOTax,
  getFreight,
  getAttachments,
  getAttachment,
  createAttachment,
  updateAttachment,
  deleteAttachment,
  getSalesQuotationById,
  getSalesQuotations,
  createSalesQuotations,
  updateSalesQuotations,
  createPurchaseQuotations,
  updatePurchaseQuotations,
  getPurchaseQuotations,
  getPurchaseQuotationById,
  createPurchaseRequests,
  updatePurchaseRequests,
  getPurchaseRequests,
  getPurchaseRequestById,
  getPurchaseDeliveryNotes,
  createPurchaseDeliveryNotes,
  getPurchaseDeliveryNotesById,
  updatePurchaseDeliveryNote
};
