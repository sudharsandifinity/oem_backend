const { callSAP } = require("../utils/sapRequest");
const UserController = require("./UserController");
const UserService = require("../services/userService")
const UserRepository = require("../repositories/userRepository");
const { currentTime } = require("../utils/currentTime");

const sapAPIs = {
  Employees: "EmployeesInfo",
  EmployeesSelect: "$select=EmployeeID,ExternalEmployeeNumber,JobTitle,LastName,FirstName,eMail,MobilePhone,Department, PassportNumber, Picture, WorkStreet,WorkZipCode,LinkedVendor, CostCenterCode, U_BU, Position",
  Attendance: "U_HLB_OATT",
  AllLogEntries: "U_HLB_OAPL",
  Expanses: "HLB_OECL",
  AllExpansesOrderBy: "$orderby=DocEntry desc",
  ExpanseTypes: "HLB_EXPM",
  ApprovalLevels: "HLB_OAPP",
  Currency: "Currencies"
}

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
    const {top=20,skip=10} = req.query;
    const response = await sapGetRequest(req, `${sapAPIs.Employees}?${sapAPIs.EmployeesSelect}&$top=${top}&$skip=${skip}`);
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
    const response = await sapGetRequest(req, `${sapAPIs.Employees}(${employeeId})?${sapAPIs.EmployeesSelect}`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Employee Profile', error: err.message });
  }
};

const employeeCheckIn = async (req, res) => {
    try {
        const { date, time } = currentTime();
        const user = req.user;

        const empDetails = await sapGetRequest(req, `${sapAPIs.Employees}(${user.EmployeeId})?${sapAPIs.EmployeesSelect}`);
        let payload = req.body;
        payload.U_EmpID = user.EmployeeId || 0;
        payload.Name = `${empDetails.data.FirstName} ${empDetails.data.LastName}` || 0;
        payload.U_InTime = time || null;
        payload.U_AttDt = date || null;
        const response = await sapPostRequest(req, `${sapAPIs.Attendance}`, payload);           
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
        const missed = await findMissedCheckOuts(req, user.EmployeeId);
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
        const response = await sapGetRequest(req, `${sapAPIs.Attendance}?$select=Code,U_EmpID,U_AttDt,U_InTime &$filter=U_EmpID eq '${EmpId}' and U_OutTime eq null and U_InTime ne null`);
        
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
    const employees = await sapGetRequest(req, `${sapAPIs.Employees}?${sapAPIs.EmployeesSelect}`);
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
  const { date, time } = currentTime();
  const user = req.user;
  const missedOut = await findMissedCheckOuts(req, user.EmployeeId);
  
  if(!missedOut){
    return res.status(404).json({message: 'Checkin not found!'});
  }
  const U_AttDt = missedOut.U_AttDt;
  const dateform = new Date(U_AttDt);
  const formattedDate = `${dateform.getFullYear()}${dateform.getMonth() + 1}${dateform.getDate()}`;
  const isCheckedInToday = formattedDate === date;
  res.status(200).send(isCheckedInToday);
}

const missedOutNotification = async (req, res) => {
  const user = req.user;
  const missedOut = await findMissedCheckOuts(req, user.EmployeeId);
  if(!missedOut){
    return res.status(404).json({message: 'Missed outs not found!'});
  }
  const U_AttDt = missedOut.U_AttDt;

  res.status(200).json({missedCheckout: U_AttDt});

}

const getAllExpType = async (req, res) => {
  try {
    const response = await sapGetRequest(req, `${sapAPIs.ExpanseTypes}?$select=U_ExpCode,U_ExpName`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Expanse Type', error: err.message });
  }
}

const createExpRequest = async (req, res) => {
  const { date, time } = currentTime();
  try {
    
    const user = req.user;
    const emp = await sapGetRequest(req, `${sapAPIs.Employees}(${user.EmployeeId})?${sapAPIs.EmployeesSelect}`);
    console.log('emp', emp.data);
    
    const app_lev = await sapGetRequest(req, `${sapAPIs.ApprovalLevels}?$select=*&$filter=U_Cate eq '${emp.data.Position}' AND U_ESSApp eq 'Y' AND  U_HLB_EXP eq 'Y'`);
    console.log('app lev', app_lev.data);
    // console.log('app_lev.data.value[0].HLB_APP1Collection',app_lev.data.value[0].HLB_APP1Collection);

    const isNeedApproval = app_lev.data.value?.[0]?.HLB_APP1Collection?.length ?? 0;;
    
    let payload = req.body;
    
    payload.U_EmpID = user.EmployeeId || 0;
    payload.U_EmpName = emp.data.FirstName +" "+ emp.data.LastName || "";
    payload.U_ApprSts = isNeedApproval ? "P":"A";
    payload.U_CDt = date,
    payload.U_CTm = time
    payload.U_Udt = date,
    payload.U_UTm = time

    const response = await sapPostRequest(req, `${sapAPIs.Expanses}`, payload);  
    
    console.log('isneedapproval', isNeedApproval);

    if(!isNeedApproval){
      const APInvoicePayload = {
          "DocType": "dDocument_Service",
          "CardCode": emp.data.LinkedVendor,
          "Project": response.data.U_PrjCode,
          "DocTotal":response.data.U_ExpAmt,
          "DocumentLines": [
              {
                  "LineNum":0,
                  "ExpenseType": response.data.U_ExpType,
                  "ProjectCode": response.data.U_PrjCode,
                  "CostingCode2": emp.data.CostCenterCode,
                  "CostingCode": emp.data.U_BU,
                  "LineTotal":response.data.U_ExpAmt
              }
          ]
        }
        console.log('APInvoicePayload', APInvoicePayload);


        try{
          const APInvoiceStatus =  await sapPostRequest(req, `/PurchaseInvoices`, APInvoicePayload);
           const patchPayload = {
            "U_OPNo": APInvoiceStatus.data.DocEntry,
            "U_PSts": APInvoiceStatus.data.DocEntry?"Success":APInvoiceStatus.data.error
          }
          await sapPatchRequest(req, `${sapAPIs.Expanses}(${response.data.DocEntry})`, patchPayload);
        } catch(err){
          const patchPayload = {
            "U_OPNo": "",
            "U_PSts": err.response?.data?.error?.message?.value
          }
          await sapPatchRequest(req, `${sapAPIs.Expanses}(${response.data.DocEntry})`, patchPayload);
        }
    }
    
    let logPayload = {
        "Name": payload.U_EmpName,
        "U_ReqID": user.EmployeeId,
        "U_DocType": "E",
        "U_DocNo": response.data.DocNum,
        "U_Stg": isNeedApproval?"1":"",
        "U_AppId": isNeedApproval?app_lev.data.value?.[0]?.HLB_APP1Collection?.[0]?.U_ApprID:"",
        "U_ApprName": isNeedApproval?app_lev.data.value?.[0]?.HLB_APP1Collection?.[0]?.U_ApprName:"",
        "U_AppSts": isNeedApproval?"P":"A",
        "U_PosId": emp.data.Position,
        "U_CDt": date,
        "U_CTm": time
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
    const { top=20, skip=0 } = req.query;
    console.log('topskip', top, skip);
    
    const response = await sapGetRequest(req, `${sapAPIs.Expanses}?${sapAPIs.AllExpansesOrderBy}&$filter=U_EmpID eq '${user.EmployeeId}'&$top=${top}&$skip=${skip}`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Expanse List', error: err.message });
  }
}

const getExp = async (req, res) => {
  try {
    const {id} = req.params;
    const response = await sapGetRequest(req, `${sapAPIs.Expanses}?$filter=DocNum eq ${id}`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Expanse', error: err.message });
  }
}

const getAllLogsList = async (req, res) => {
  try {
    const user = req.user;
    const { top = 20, skip = 0 } = req.query;
    console.log('top', top);
    console.log('skip', skip);
    
    const response = await sapGetRequest(req, `${sapAPIs.AllLogEntries}?$orderby=Code desc`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error fetching Logs', error: err.message });
  }
}

const creatLogEntry = async (req, res, payload) => {
  try{
    const response = await sapPostRequest(req, `${sapAPIs.AllLogEntries}`, payload)
    return
  } catch(err){
    console.error('SAP error:', err.message);
    res.status(500).json({ message: 'Error while creating Logs', error: err.message });
  }
}

const getApprovalRequestsList = async (req, res) => {
  try{
    const user = req.user;
    const { top = 20, skip = 0 } = req.query;
    const response = await sapGetRequest(req, `${sapAPIs.AllLogEntries}?$orderby=Code desc&$filter=U_AppId eq '${user.EmployeeId}'&$top=${top}&$skip=${skip}`);
    let requests = [];

    const promises = response.data.value.map(async (log) => {
      const expRequest = await sapGetRequest(req, `${sapAPIs.Expanses}(${log.U_DocNo})`);
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
  const { date, time } = currentTime();
  try{
    const user = req.user;
    const {id} = req.params;
    const payload = req.body;

    payload.U_ApprDt = date;
    payload.U_ApprTm = time;

    console.log('payload', payload);
    

    const checkStatus = await sapGetRequest(req, `${sapAPIs.AllLogEntries}(${id})`);
    
    const expReq = await sapGetRequest(req, `${sapAPIs.Expanses}(${checkStatus.data.U_DocNo})`);
    console.log('checkstaus', checkStatus.data);
    console.log('expreq', expReq.data);
    
    const requester = await sapGetRequest(req, `${sapAPIs.Employees}(${expReq.data.U_EmpID})?${sapAPIs.EmployeesSelect}`);    
    console.log('requester', requester.data);
    
    const app_lev = await sapGetRequest(req, `/HLB_OAPP?$select=*&$filter=U_Cate eq '${requester.data.Position}' AND U_ESSApp eq 'Y' AND  U_HLB_EXP eq 'Y'`);

    console.log('app_lev', app_lev.data);
    
    console.log('app lev coll', app_lev.data.value?.[0]?.HLB_APP1Collection);

    const totalAprLevs = app_lev.data.value?.[0]?.HLB_APP1Collection.length;

    const getLogs = await sapGetRequest(req, `${sapAPIs.AllLogEntries}?$filter=U_DocNo eq '${checkStatus.data.U_DocNo}'`);

    console.log('getlogs', getLogs.data);

    const isResubmitted = expReq.data.U_IsReSub === "Y";
    
    let latestLogs = null;
    if(isResubmitted){
      const expDateTimeStr = `${expReq.data.U_Udt.split('T')[0]}T${expReq.data.U_UTm}`;
      const expDocDate = new Date(expDateTimeStr);

      latestLogs = getLogs.data.value.filter((i) => { 
        const logDateTimeStr = `${i.U_CDt.split('T')[0]}T${i.U_CTm}`;
        const logEntryDate = new Date(logDateTimeStr);
        if(logEntryDate >= expDocDate) return i;
      });

    }
    console.log('latest log', latestLogs);
    

    console.log('checkStatus', checkStatus.data);
    console.log('getLogs', getLogs.data.value.length);
    const totalLogs = isResubmitted?latestLogs.length:getLogs.data.value.length;

    console.log('toallog', totalLogs);
    console.log('totalAprLevs', totalAprLevs);

    if(user.EmployeeId !== checkStatus.data.U_AppId){
      return res.status(403).json({message: "You don't have permission to approve this request!"});
    }

    if(checkStatus.data.U_AppSts === "A"){
      return res.status(200).json({message: "This request is already approved!"});
    }

    if(checkStatus.data.U_AppSts === "R"){
      return res.status(200).json({message: "This request is already Rejected!"});
    }

    const patchReq = await sapPatchRequest(req, `${sapAPIs.AllLogEntries}(${id})`, payload);
    const updatedData = await sapGetRequest(req, `${sapAPIs.AllLogEntries}(${id})`);
    console.log('updated data', updatedData.data);

    if(updatedData.data.U_AppSts == "R"){
      console.log('inside reject');
      
        const empReqPayload = {
            "U_ApprSts":"R",
            "U_Udt": date,
            "U_UTm": time
        }
        await sapPatchRequest(req, `/${sapAPIs.Expanses}(${updatedData.data.U_DocNo})`, empReqPayload); 
        return res.status(200).json({message: "Response submitted successfully!"})   
    }

    console.log('totalAprLevs', totalAprLevs);
    console.log('totalLogs', totalLogs);
    

    if(totalAprLevs == totalLogs){
      console.log('inside final approval');

      const getLatestLogs = await sapGetRequest(req, `${sapAPIs.AllLogEntries}?$filter=U_DocNo eq '${checkStatus.data.U_DocNo}'`);

      let latestUpdatedLogs = null;
      if(isResubmitted){
        const expDateTimeStr = `${expReq.data.U_Udt.split('T')[0]}T${expReq.data.U_UTm}`;
        const expDocDate = new Date(expDateTimeStr);

        latestUpdatedLogs = getLatestLogs.data.value.filter((i) => { 
          const logDateTimeStr = `${i.U_CDt.split('T')[0]}T${i.U_CTm}`;
          const logEntryDate = new Date(logDateTimeStr);
          if(logEntryDate >= expDocDate) return i;
        });

      }

      const pending = isResubmitted ? latestUpdatedLogs.filter(val => val.U_AppSts === "R" || val.U_AppSts === "P"):getLatestLogs.data.value.filter(val => val.U_AppSts === "R" || val.U_AppSts === "P");

      console.log('pendings', pending);
      console.log('pendings len', pending.length);
      console.log('pendings len condition', pending.length <= 0);
      
      if(pending.length <= 0){
         const empReqPayload = {
            "U_ApprSts":"A",
            "U_Udt": date,
            "U_UTm": time
        }
        const updatedExpReq = await sapPatchRequest(req, `${sapAPIs.Expanses}(${updatedData.data.U_DocNo})`, empReqPayload);

        const APInvoicePayload = {
          "DocType": "dDocument_Service",
          "CardCode": requester.data.LinkedVendor,
          "Project": expReq.data.U_PrjCode,
          "DocTotal":expReq.data.U_ExpAmt,
          "DocumentLines": [
              {
                  "LineNum":0,
                  "ExpenseType": expReq.data.U_ExpType,
                  "ProjectCode": expReq.data.U_PrjCode,
                  "CostingCode2": requester.data.CostCenterCode,
                  "CostingCode": requester.data.U_BU,
                  "LineTotal":expReq.data.U_ExpAmt
              }
          ]
        }
        console.log('APInvoicePayload', APInvoicePayload);
        
        try{
          console.log('updatedExpReq.data.DocEntry', updatedData.data.U_DocNo);
          
          const APInvoiceStatus =  await sapPostRequest(req, `/PurchaseInvoices`, APInvoicePayload);
           const patchPayload = {
            "U_OPNo": APInvoiceStatus.data.DocEntry,
            "U_PSts": APInvoiceStatus.data.DocEntry?"Success":APInvoiceStatus.data.error
          }
          await sapPatchRequest(req, `${sapAPIs.Expanses}(${updatedData.data.U_DocNo})`, patchPayload);
        } catch(err){
          console.log('updatedExpReq.data.DocEntry', updatedData.data.U_DocNo);
          console.log('updarrrrrrrr', err.response?.data?.error?.message?.value);

          const patchPayload = {
            "U_OPNo": "",
            "U_PSts": err.response?.data?.error?.message?.value
          }
          await sapPatchRequest(req, `${sapAPIs.Expanses}(${updatedData.data.U_DocNo})`, patchPayload);
        }

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
          "U_CDt": date,
          "U_CTm": time,
          "U_ReqID": requester?.data?.EmployeeID,
          "U_ApprName": app_lev.data.value?.[0]?.HLB_APP1Collection?.[totalLogs].U_ApprName,
          "U_PosId": requester?.data?.Position
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

const updateExpReq = async (req,res) => {
  const { date, time } = currentTime();
  try{
    const {id} = req.params;
    let payload = req.body;
    payload.UpdateDate=date
    payload.UpdateTime=time
    
    await sapPatchRequest(req, `${sapAPIs.Expanses}(${id})`, payload);
    res.status(204).json("Updated successfully!")
  }catch(error){
    console.error('SAP error:', error.message);
    res.status(500).json({ message: 'Error while updating request', error: error.message });
  }
}

const resubmitExpReq = async (req, res) => {
  const { date, time } = currentTime();
  try{
    const {id} = req.params;
    const user = req.user;
    let payload = req.body;

    payload.U_ApprSts = "P"
    payload.U_IsReSub = "Y"
    payload.U_Udt = date
    payload.U_UTm = time
   
    const expanse = await sapGetRequest(req, `${sapAPIs.Expanses}(${id})`);
    if(expanse.data.U_ApprSts === "R" && expanse.data.U_EmpID == user.EmployeeId){
      console.log('we can procees with this');
      console.log('payload', payload);
      
      await sapPatchRequest(req, `${sapAPIs.Expanses}(${id})`, payload);
    }else{
      return res.status(500).json({message: "You can't performe this action. Your request is already approved or pending!"})
    }

    await sapGetRequest(req, `${sapAPIs.Expanses}(${id})`);
    res.status(204).json({messge: "request updated successfully!"})
    await resubmitLogEntry(req, res, id)
  }catch(error){
    console.error('SAP error:', error.message);
    res.status(500).json({ message: 'Error while re-submitting request', error: error.message });
  }
}

const resubmitLogEntry = async (req, res, docEntry) => {
  const { date, time } = currentTime();
  try {
    const user = req.user;
    const emp = await sapGetRequest(req, `${sapAPIs.Employees}(${user.EmployeeId})?${sapAPIs.EmployeesSelect}`);
    console.log('emp', emp.data);
    
    const app_lev = await sapGetRequest(req, `${sapAPIs.ApprovalLevels}?$select=*&$filter=U_Cate eq '${emp.data.Position}' AND U_ESSApp eq 'Y' AND  U_HLB_EXP eq 'Y'`);
    console.log('app lev', app_lev.data);

    const isNeedApproval = app_lev.data.value?.[0]?.HLB_APP1Collection?.length ?? 0;
    console.log('isneedapproval', isNeedApproval);
    
    let logPayload = {
        "Name": `${emp.data.FirstName} ${emp.data.LastName}`,
        "U_ReqID": user.EmployeeId,
        "U_DocType": "E",
        "U_DocNo": docEntry,
        "U_Stg": isNeedApproval?"1":"",
        "U_AppId": isNeedApproval?app_lev.data.value?.[0]?.HLB_APP1Collection?.[0]?.U_ApprID:"",
        "U_ApprName": isNeedApproval?app_lev.data.value?.[0]?.HLB_APP1Collection?.[0]?.U_ApprName:"",
        "U_AppSts": isNeedApproval?"P":"A",
        "U_PosId": emp.data.Position,
        "U_CDt": date,
        "U_CTm": time
    } 

    console.log('logpyalod', logPayload);
    
    await creatLogEntry(req, res, logPayload)
  
    res.status(204).json({
        message: 'resubmit request log submited successfully'
    });     
  } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).json({ error: error.message });
  }
}

const currencyList = async (req, res) => {
  try{
    const { top = 20,skip = 0 } = req.query;
    const response = await sapGetRequest(req, `${sapAPIs.Currency}?$select=Code,Name&$top=${top}&$skip=${skip}`);
    res.status(200).json(response.data);
  } catch(err){
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getHolidays, getProjects, getEmployes, employeeCheckIn, employeeCheckOut, syncEmployees, getEmployeeProfile, isCheckedIn, missedOutNotification, getAllExpType, getExp, createExpRequest, getAllExpList, updateExpReq, getAllLogsList, getApprovalRequestsList, RequestResponse, resubmitExpReq, currencyList }