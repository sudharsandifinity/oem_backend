const { callSAP } = require("../utils/sapRequest");
const UserController = require("./UserController");
const UserService = require("../services/userService")
const UserRepository = require("../repositories/userRepository");

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
    res.status(500).json({ message: 'Error fetching Employees', error: err.message });
  }
};

const getEmployeeProfile = async (req, res) => {
  try {
    const employeeId = req.user.EmployeeId;
    if(!employeeId){
      res.status(404).json({message: "Employee Id not found!"});
    }
    const response = await sapGetRequest(req, `/EmployeesInfo(${employeeId})?$select=EmployeeID,ExternalEmployeeNumber,JobTitle, LastName,FirstName,eMail,MobilePhone,Department, PassportNumber, Picture, WorkStreet,WorkZipCode`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Employee Profile', error: err.message });
  }
};

const employeeCheckIn = async (req, res) => {
    try {
        const user = req.user;
        let payload = req.body;
        payload.U_EmpID = user.sap_emp_id || 0;
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

const syncEmployees = async (req, res) => {
  try {
    const employees = await sapGetRequest(req, "/EmployeesInfo?$select=EmployeeID,ExternalEmployeeNumber,LastName,FirstName,eMail,MobilePhone,Department,WorkStreet,WorkZipCode");
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    let skippedEmployeeIDs = [];

    for (const employee of employees.data.value) {
      const { EmployeeID, eMail, FirstName, LastName, MobilePhone, Department } = employee;

      if(!eMail){
        console.log(`EmployeeID ${EmployeeID} skipped becuse of null Email`);
        skippedEmployeeIDs.push(EmployeeID);
        continue;
      }

      const existingUser = await userRepository.findByEmpId(EmployeeID);

      if (existingUser) {
        const updatedUserPayload = {
          first_name: FirstName,
          last_name: LastName,
          email: eMail,
          mobile: MobilePhone,
          is_sap_user: 1,
          department: Department
        };
        const data = await userController.updateSapEmployees(existingUser.id, updatedUserPayload);
        if(data === "duplicate"){
          skippedEmployeeIDs.push(EmployeeID);
          continue
        }
        console.log(`Updated user: ${FirstName} ${LastName} (Email: ${eMail})`);
      } else {
        const userPayload = {
          email: eMail,
          first_name: FirstName,
          last_name: LastName,
          mobile: MobilePhone,
          is_sap_user: 1,
          sap_emp_id: EmployeeID,
          department: Department,
          roleId: 1,
          password: eMail,
          status: 1
        };
        const result = await userController.syncSapEmployees(userPayload);
        if(result === "duplicate"){
            skippedEmployeeIDs.push(EmployeeID);
            continue
        }
        console.log(`Created user: ${FirstName} ${LastName} (Email: ${eMail})`);
      }
    }
    return res.status(200).json({ message: 'Employee synchronization completed successfully.', skippedIDs: skippedEmployeeIDs });

  } catch (error) {
    console.error('Error syncing employees:', error.message);
    return res.status(500).json({ message: 'Error syncing employees', error: error.message });
  }
};


const isCheckedIn = async (req, res) => {
  const user = req.user;
  const missedOut = await findMissedCheckOuts(req, user.id);
  if(!missedOut){
    return res.status(404).json({message: 'Checkin not found!'});
  }

  const currentDate = new Date().toISOString().split('T')[0];
  const U_AttDt = missedOut.U_AttDt;
  const isCheckedInToday = U_AttDt === currentDate;

  res.status(200).send(isCheckedInToday);
}

const missedOutNotification = async (req, res) => {
  const user = req.user;
  const missedOut = await findMissedCheckOuts(req, user.id);
  if(!missedOut){
    return res.status(404).json({message: 'Missed outs not found!'});
  }
  const U_AttDt = missedOut.U_AttDt;

  res.status(200).json({missedCheckout: U_AttDt});

}

const getAllExpType = async (req, res) => {
  try {
    const response = await sapGetRequest(req, "/HLB_EXPM?$select=U_ExpCode,U_ExpName");
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Expanse Type', error: err.message });
  }
}

const createExpRequest = async (req, res) => {
  try {
    
    const user = req.user;
    const emp = await sapGetRequest(req, `/EmployeesInfo(${user.EmployeeId})?$select=EmployeeID,ExternalEmployeeNumber,JobTitle, LastName,FirstName,eMail,MobilePhone,Department, PassportNumber, Picture, WorkStreet,WorkZipCode`);

    let payload = req.body;
    
    payload.U_EmpID = user.EmployeeId || 0;
    payload.U_EmpName = emp.data.FirstName +" "+ emp.data.LastName || "";

    const response = await sapPostRequest(req, '/HLB_OECL', payload);         
    res.status(200).json({
        message: 'Expanse request submited successfully',
        data: response.data
    });     
  } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).json({ error: error.message });
  }
}

const getAllExpList = async (req, res) => {
  try {
    const user = req.user;
    console.log('user', user);
    
    const response = await sapGetRequest(req, `/HLB_OECL?$orderby=DocEntry desc&$filter=U_EmpID eq '${user.EmployeeId}'`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Expanse Type', error: err.message });
  }
}

module.exports = { getHolidays, getProjects, getEmployes, employeeCheckIn, employeeCheckOut, syncEmployees, getEmployeeProfile, isCheckedIn, missedOutNotification, getAllExpType, createExpRequest, getAllExpList }