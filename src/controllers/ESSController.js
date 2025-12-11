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

const employeeCheckIn = async (req, res) => {
    try {
        const user = req.user;
        let payload = req.body;
        payload.U_EmpID = user.id || 0;
        const response = await sapPostRequest(req, '/U_HLB_OATT', payload);           
        res.status(200).json({
            message: 'Check-In updated successfully',
            data: response.data
        });     
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
}

const employeeCheckOut = async (req, res) => {
    try {
        const user = req.user;
        const missed = await findMissedCheckOuts(req, user.id);
        if(!missed){
          return res.status(404).json({message: 'entry not found'})
        }
        const code = missed.Code;
        const payload = req.body;
        const response = await sapPatchRequest(req, `/U_HLB_OATT(${code})`, payload);    
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

const findMissedCheckOuts = async (req, EmpId) => {
    try {
        const response = await sapGetRequest(req, `/U_HLB_OATT?$select=Code,U_EmpID,U_AttDt,U_InTime &$filter=U_EmpID eq '${EmpId}' and U_OutTime eq null and U_InTime ne null`);
        
        const latest = response.data.value[response.data.value.length - 1];
        if(!latest){
          return null
        }
        return latest;
    } catch (error) {
        console.error(error.response?.data || error.message);
        throw new Error(error.message);
    }
}


module.exports = { getHolidays, getProjects, getEmployes, employeeCheckIn, employeeCheckOut }