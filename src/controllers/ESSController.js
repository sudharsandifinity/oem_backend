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
    const response = await sapGetRequest(req, "/EmployeesInfo?$select=EmployeeID,ExternalEmployeeNumber,LastName,FirstName,eMail,MobilePhone,Department,WorkStreet,WorkZipCode,Position");
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
    const response = await sapGetRequest(req, `/EmployeesInfo(${employeeId})?$select=EmployeeID,ExternalEmployeeNumber,JobTitle, LastName,FirstName,eMail,MobilePhone,Department, PassportNumber, Picture, WorkStreet,WorkZipCode,Position`);
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
    const employees = await sapGetRequest(req, "/EmployeesInfo?$select=EmployeeID,ExternalEmployeeNumber,LastName,FirstName,eMail,MobilePhone,Department,WorkStreet,WorkZipCode,Position");
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
    const emp = await sapGetRequest(req, `/EmployeesInfo(${user.EmployeeId})?$select=EmployeeID,ExternalEmployeeNumber,JobTitle, LastName,FirstName,eMail,MobilePhone,Department, PassportNumber, Picture, WorkStreet,WorkZipCode, Position`);
    console.log('emp', emp.data);
    
    const app_lev = await sapGetRequest(req, `/HLB_OAPP?$select=*&$filter=U_Cate eq '${emp.data.Position}' AND U_ESSApp eq 'Y' AND  U_HLB_EXP eq 'Y'`);
console.log('app lev', app_lev.data);
// console.log('app_lev.data.value[0].HLB_APP1Collection',app_lev.data.value[0].HLB_APP1Collection);

  const isNeedApproval = app_lev.data.value?.[0]?.HLB_APP1Collection?.length ?? 0;;
    
    let payload = req.body;
    
    payload.U_EmpID = user.EmployeeId || 0;
    payload.U_EmpName = emp.data.FirstName +" "+ emp.data.LastName || "";
    payload.U_ApprSts = isNeedApproval ? "P":"A";

    const response = await sapPostRequest(req, '/HLB_OECL', payload);  
    
    let logPayload = {
        "Name": payload.U_EmpName,
        "U_DocType": "E",
        "U_DocNo": response.data.DocNum,
        "U_Stg": isNeedApproval?"1":"",
        "U_AppId": isNeedApproval?app_lev.data.value?.[0]?.HLB_APP1Collection?.[0]?.U_ApprID:"",
        "U_AppSts": isNeedApproval?"P":"A",
        "U_ApprDt": null,
        "U_ApprTm": null
    }
    await creatLogEntry(req, res, logPayload)
  
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
    const response = await sapGetRequest(req, `/HLB_OECL?$orderby=DocEntry desc&$filter=U_EmpID eq '${user.EmployeeId}'`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Expanse Type', error: err.message });
  }
}

const getExp = async (req, res, id) => {
  try {
    const response = await sapGetRequest(req, `/HLB_OECL?$filter=DocNum eq ${id}`);
    return response.data;
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Expanse Type', error: err.message });
  }
}

const getAllLogsList = async (req, res) => {
  try {
    const user = req.user;
    const response = await sapGetRequest(req, `/U_HLB_OAPL`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Logs', error: err.message });
  }
}

const creatLogEntry = async (req, res, payload) => {
  try{
    const response = await sapPostRequest(req, `/U_HLB_OAPL`, payload)
    return
  } catch(err){
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error while creating Logs', error: err.message });
  }
}

const getApprovalRequestsList = async (req, res) => {
  try{
    const user = req.user;
    const response = await sapGetRequest(req, `/U_HLB_OAPL?$filter=U_AppId eq '${user.EmployeeId}'`);
    let requests = [];

    const promises = response.data.value.map(async (log) => {
      const expRequest = await sapGetRequest(req, `/HLB_OECL(${log.U_DocNo})`);
      const combinedData = {...log, RequstData:expRequest.data}
      return combinedData;
    });

    requests = await Promise.all(promises);
    res.status(200).json(requests);
  } catch(err){
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error while getting requests', error: err.message });
  }
}

const RequestResponse = async (req, res) => {
  try{
    const user = req.user;
    const {id} = req.params;
    const payload = req.body;

    console.log('payload', payload);
    

    const checkStatus = await sapGetRequest(req, `/U_HLB_OAPL(${id})`);
    
    const expReq = await sapGetRequest(req, `/HLB_OECL(${checkStatus.data.U_DocNo})`);
    console.log('checkstaus', checkStatus.data);
    console.log('expreq', expReq.data);
    
    const requester = await sapGetRequest(req, `/EmployeesInfo(${expReq.data.U_EmpID})?$select=EmployeeID,ExternalEmployeeNumber,JobTitle, LastName,FirstName,eMail,MobilePhone,Department, PassportNumber, Picture, WorkStreet,WorkZipCode, Position`);
    console.log('requester', requester.data);
    
    const app_lev = await sapGetRequest(req, `/HLB_OAPP?$select=*&$filter=U_Cate eq '${requester.data.Position}' AND U_ESSApp eq 'Y' AND  U_HLB_EXP eq 'Y'`);

    console.log('app_lev', app_lev.data);
    
    console.log('app lev coll', app_lev.data.value?.[0]?.HLB_APP1Collection);

    const totalAprLevs = app_lev.data.value?.[0]?.HLB_APP1Collection.length;
    
    const getLogs = await sapGetRequest(req, `/U_HLB_OAPL?$filter=U_DocNo eq '${checkStatus.data.U_DocNo}'`);

    console.log('checkStatus', checkStatus.data);
    console.log('getLogs', getLogs.data.value.length);
    const totalLogs = getLogs.data.value.length;
    
    if(user.EmployeeId !== checkStatus.data.U_AppId){
      return res.status(403).json({message: "You don't have permission to approve this request!"});
    }

    if(checkStatus.data.U_AppSts === "A"){
      return res.status(200).json({message: "This request is already approved!"});
    }

    if(checkStatus.data.U_AppSts === "R"){
      return res.status(200).json({message: "This request is already Rejected!"});
    }

    const patchReq = await sapPatchRequest(req, `/U_HLB_OAPL(${id})`, payload);
    const updatedData = await sapGetRequest(req, `/U_HLB_OAPL(${id})`);
    console.log('updated data', updatedData.data);
    // console.log('data', app_lev.data.value[0].HLB_APP1Collection[getLogs.data.value.length].U_ApprID);

    if(updatedData.data.U_AppSts == "R"){
      console.log('inside reject');
      
        const empReqPayload = {
            "U_ApprSts":"R"
        }
        await sapPatchRequest(req, `/HLB_OECL(${updatedData.data.U_DocNo})`, empReqPayload); 
        return res.status(200).json({message: "Response submitted successfully!"})   
    }

    if(totalAprLevs == totalLogs){
      console.log('inside reject');

      const pending = getLogs.data.value.filter(val => val.U_AppSts === "R" || val.U_AppSts === "P");
      if(pending.length > 0){
         const empReqPayload = {
            "U_ApprSts":"A"
        }
        await sapPatchRequest(req, `/HLB_OECL(${updatedData.data.U_DocNo})`, empReqPayload);
        return res.status(200).json({message: "Response submitted successfully!"})
      }
    }
    console.log('status', updatedData.data.U_AppSts);
    console.log('status val', totalAprLevs > totalLogs);
    console.log('condition', totalAprLevs, totalLogs);
    console.log('if condition', updatedData.data.U_AppSts == "A" && totalAprLevs > totalLogs);
    
    if(updatedData.data.U_AppSts == "A" && totalAprLevs > totalLogs){
      console.log('entry');
        let logPayload = {
          "Name": updatedData.data.Name,
          "U_DocType": "E",
          "U_DocNo": updatedData.data.U_DocNo,
          "U_Stg": app_lev.data.value?.[0]?.HLB_APP1Collection?.[totalLogs].U_Stg,
          "U_AppId": app_lev.data.value?.[0]?.HLB_APP1Collection?.[totalLogs].U_ApprID,
          "U_AppSts": "P",
          "U_ApprDt": null,
          "U_ApprTm": null
      }
      console.log('logpayload', logPayload);
      
      await creatLogEntry(req, res, logPayload)
    }
    res.status(204).json({message:"Response submited!"});
  } catch(err){
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error while updating request', error: err.message });
  }
}

module.exports = { getHolidays, getProjects, getEmployes, employeeCheckIn, employeeCheckOut, syncEmployees, getEmployeeProfile, isCheckedIn, missedOutNotification, getAllExpType, getExp, createExpRequest, getAllExpList, getAllLogsList, getApprovalRequestsList, RequestResponse }