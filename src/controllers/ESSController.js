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

const emploueeCheckIn = async (req, res) => {
    try {
        const payload = req.body;
        const response = await sapPostRequest(req, '/U_HLB_OATT', payload);           
        return response.data;
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
}

const emploueeCheckOut = async (req, res) => {
    try {
        const id = req.params.id;
        const payload = req.body;
        const response = await sapPatchRequest(req, `/U_HLB_OATT(${id})`, payload);    
        res.status(200).json({
            message: 'Check-Out updated successfully',
            data: response.data
        });       
        return response.data;
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
}


module.exports = { getHolidays, getProjects, getEmployes, emploueeCheckIn, emploueeCheckOut }