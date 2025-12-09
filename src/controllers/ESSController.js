const { callSAP } = require("../utils/sapRequest");

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

const getHolidays = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/Holidays('2025')");
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Holidays', error: err.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/Projects");
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Holidays', error: err.message });
  }
};

const getEmployes = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/EmployeesInfo?$select=EmployeeID,ExternalEmployeeNumber,LastName,FirstName,eMail,MobilePhone,Department,WorkStreet,WorkZipCode");
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Holidays', error: err.message });
  }
};

module.exports = { getHolidays, getProjects, getEmployes }