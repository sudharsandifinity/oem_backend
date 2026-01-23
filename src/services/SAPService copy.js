const { currentTime } = require('../utils/currentTime');
const { Endpoints } = require('../utils/sapEndPoints');
const { sapPatchRequest } = require('../utils/sapRequestMethods');
const SAPClient = require('./SAPClient');

class SAPService extends SAPClient{

    async getAllEmployees(req, query) {
        const response = await this.getEmployees(req, query);
        return response.data;
    }

    async getEmployeeDetail(req, id) {
        const response = await this.getEmployee(req, id);
        return response.data;
    }

    async checkAppvalLvs(req, position, model){
        const response = await this.checkApprovalLevels(req, position, model);
        return response.data;
    }

    async createTravelExpReq(req, payload){
        const response = await this.createTravelExp(req, payload);
        return response.data;
    }

    async createLog(req, payload){
        const response = await this.addLogEntry(req, payload);
        return response.data;
    }

    async getLogById(req, id){
        const response = await this.getLog(req, id);
        return response.data;
    }

    async getLogByDoc(req, id){
        const response = await this.getRequestLogs(req, id);
        return response.data;
    }

    async patchLogData(req, code, payload){
        const response = await this.patchLog(req, code, payload);
        return response.data;
    }

    async getMyAprLogs(req, EmpId, query){
        const response = await this.getAprLogs(req, EmpId, query);
        return response.data;
    }

    async getAllExpReq(req, query){
        const response = await this.getExpReq(req, query);
        return response.data;
    }

    async getAllAtts(req, query){
        const response = await this.getAtts(req, query);
        return response.data;
    }

    async getAllTExp(req){
        const response = await this.getTExpanses(req);
        return response.data;
    }

    async getTExpByEmpId(req, EmpId, query){
        const response = await this.getTExpByEmp(req, EmpId, query);
        return response.data;
    }

    async getTExpById(req, docEntry){
        const response = await this.getTExpanse(req, docEntry);
        return response.data;
    }

    async patchTExp(req, docEntry, payload){
        const response = await this.patchTExpanse(req, docEntry, payload);
        return response.data;
    }

    async checkModule(DocType){
        
        switch (DocType) {
            case "TR":
                return {
                    checkAprv: "U_HLB_TREXP",
                    create: this.getEmployeeDetail.bind(this),
                    getById: this.getTExpById.bind(this),
                };

            case "E":
                return {
                    checkAprv: "U_HLB_EXP",
                    create: this.createExpenseReq.bind(this)
                };

            case "L":
                return {
                    checkAprv: "U_HLB_LEAVE",
                    create: this.createLeaveReq.bind(this)
                };

            default:
                throw new Error("Invalid DocType");
        }
    }


    async createRequest (req, res, DocType) {

        const { date, time } = currentTime();
        const { create, checkAprv } = await this.checkModule(DocType);
        console.log('date', date, time);
        console.log('create',create);
        console.log('checkAprv',checkAprv);

        const user = req.user;
        const emp = await create(req, user.EmployeeId);
        
        const app_lev = await this.checkAppvalLvs(req, emp.Position, checkAprv);
        // console.log('app lev', app_lev);return
        const approvalCollection = app_lev.value?.[0]?.HLB_APP1Collection;
        const isNeedApproval = approvalCollection?.length ?? 0;
        // console.log('approvalCollection', approvalCollection);
        // console.log('isNeedApproval', isNeedApproval);
        // console.log('req.files', req.files);

        let attachments = null;

        if (req.files && req.files.length > 0) {
            attachments = await SAPController.createAttachment(req, res);
        }
        // console.log("attachments", attachments );
        
        
        let payload = req.body;
        console.log('body', payload);
        
        
        payload.U_EmpID = user.EmployeeId || 0;
        payload.U_EmpName = emp.FirstName +" "+ emp.LastName || "";
        payload.U_ApprSts = isNeedApproval ? "P":"A";
        payload.U_CDt = date,
        payload.U_CTm = time
        payload.U_Udt = date,
        payload.U_UTm = time,
        payload.U_Atch = attachments ? attachments.AbsoluteEntry:""

        console.log('payload', payload);

        const response = await this.createTravelExpReq(req, payload);  
        console.log('trav response', response);
        
        
        // console.log('isneedapproval', isNeedApproval);

        if(!isNeedApproval){
            await this.APInvoice(req, emp, response)
        }

        const isDelegationId = approvalCollection?.[0]?.U_DlgID;
        let isDelegationValid = false;

        // console.log('isDelegationId', isDelegationId);

        if(isDelegationId){
            const currentDate = new Date(
            `${date.toString().slice(0, 4)}-${date.toString().slice(4, 6)}-${date
                .toString()
                .slice(6, 8)}`
            );

            const fromDate = new Date(approvalCollection?.[0]?.U_FrmDt);
            const toDate = new Date(approvalCollection?.[0]?.U_ToDt);

            // console.log("currentDate", currentDate);
            // console.log("fromDate", fromDate);
            // console.log("toDate", toDate);
        
            isDelegationValid = currentDate >= fromDate && currentDate <= toDate;
            // console.log("isDelegationValid", isDelegationValid);
        }
        
        let logPayload = {
            "Name": payload.U_EmpName,
            "U_ReqID": user.EmployeeId,
            "U_DocType": DocType,
            "U_DocNo": response.DocEntry,
            "U_Stg": isNeedApproval?"1":"",
            "U_AppId": isNeedApproval?approvalCollection?.[0]?.U_ApprID:"",
            "U_ApprName": isNeedApproval?approvalCollection?.[0]?.U_ApprName:"",
            "U_AppSts": isNeedApproval?"P":"A",
            "U_PosId": emp.Position,
            "U_DelID": isDelegationValid?approvalCollection?.[0]?.U_DlgID:"",
            "U_DelName": isDelegationValid?approvalCollection?.[0]?.U_DlgName:"",
            "U_CDt": date,
            "U_CTm": time
        } 

        console.log('logpayload', logPayload);
        
        await this.createLog(req, logPayload)  
        return response;
    }

    async APInvoice (req, emp, response){
        const APInvoicePayload = {
            "DocType": "dDocument_Service",
            "CardCode": emp.LinkedVendor,
            "DocCurrency": response.U_CUR,
            "JournalMemo": `${response.U_ExpType} - ${emp.FirstName} ${emp.LastName}`,
            "Project": response.U_PrjCode,
            "DocTotal":response.U_ExpAmt,
            "DocumentLines": [
                {
                    "LineNum":0,
                    "ItemDescription": `${response.U_ExpType} - ${emp.FirstName} ${emp.LastName}`,
                    "ExpenseType": response.U_ExpType,
                    "ProjectCode": response.U_PrjCode,
                    "CostingCode2": emp.CostCenterCode,
                    "CostingCode": emp.U_BU,
                    "Currency": response.U_CUR,
                    "LineTotal":response.U_ExpAmt
                }
            ]
            }
            // console.log('APInvoicePayload', APInvoicePayload);

            try{
            const APInvoiceStatus =  await this.createAPInvoice(req, APInvoicePayload);
            // const APInvoiceStatus =  await sapPostRequest(req, `/PurchaseInvoices`, APInvoicePayload);
            const patchPayload = {
                "U_OPNo": APInvoiceStatus.DocEntry,
                "U_PSts": APInvoiceStatus.DocEntry?"Success":APInvoiceStatus.error
            }
            await this.patchTExp(req, response.DocEntry, patchPayload); 
            // await sapPatchRequest(req, `${Endpoints.Expanses}(${response.DocEntry})`, patchPayload);
            } catch(err){
            const patchPayload = {
                "U_OPNo": "",
                "U_PSts": err.response?.data?.error?.message?.value
            }
            await this.patchTExp(req, response.DocEntry, patchPayload); 
            // await sapPatchRequest(req, `${Endpoints.Expanses}(${response.DocEntry})`, patchPayload);
        }
    }

    async RequestResponse (req, DocType) {
        const { date, time } = currentTime();
        const { create, getById, checkAprv } = await this.checkModule(DocType);
        const user = req.user;
        const {id} = req.params;
        const payload = req.body;

        const checkStatus = await this.getLogById(req, id);
        const expReq = await getById(req, checkStatus.U_DocNo);
        return expReq
        // const expReq = await this.getTExpById(req, checkStatus.U_DocNo);
        const requester = await this.getEmployeeDetail(req, expReq.U_EmpID); 
        const approver = await this.getEmployeeDetail(req, user.EmployeeId); 
        const app_lev = await this.checkAppvalLvs(req, requester.Position);
    
        payload.U_ApprDt = date;
        payload.U_ApprTm = time;
        payload.U_AppByID = approver.EmployeeID,
        payload.U_AppByName = `${approver.FirstName} ${approver.LastName}`
    
        console.log('payload', payload);
    
        const approvalCollection = app_lev.value?.[0]?.HLB_APP1Collection;
        const totalAprLevs = approvalCollection.length;

        console.log('approvalCollection', approvalCollection);
        console.log('totalAprLevs', totalAprLevs);
    
        const getLogs = await this.getLogByDoc(req, checkStatus.U_DocNo);
    
        const isResubmitted = expReq.U_IsReSub === "Y";
        
        let latestLogs = null;
        if(isResubmitted){
          const expDateTimeStr = `${expReq.U_Udt.split('T')[0]}T${expReq.U_UTm}`;
          const expDocDate = new Date(expDateTimeStr);
    
          latestLogs = getLogs.value.filter((i) => { 
            const logDateTimeStr = `${i.U_CDt.split('T')[0]}T${i.U_CTm}`;
            const logEntryDate = new Date(logDateTimeStr);
            if(logEntryDate >= expDocDate) return i;
          });
    
        }
        console.log('latest log', latestLogs);
        
    
        // console.log('checkStatus', checkStatus.data);
        // console.log('getLogs', getLogs.data.value.length);
        const totalLogs = isResubmitted?latestLogs.length:getLogs.value.length;
    
        console.log('toallog', totalLogs);
        // console.log('totalAprLevs', totalAprLevs);
        // console.log('403 condition', user.EmployeeId != checkStatus.U_AppId);
        // console.log('403 condition 2', user.EmployeeId !== checkStatus.U_DelID);
        // console.log('403 condition total', (user.EmployeeId !== checkStatus.U_AppId) || (user.EmployeeId !== (checkStatus.U_DelID || '')));
    
        // console.log('U_AppId id', checkStatus.U_AppId);
        // console.log('user.EmployeeId', user.EmployeeId);
        // console.log('checkStatus.data.U_DelID', checkStatus.U_DelID);
        // console.log('(checkStatus.data.U_DelID !== null && user.EmployeeId !== checkStatus.data.U_DelID)', (checkStatus.U_DelID != null && user.EmployeeId !== checkStatus.U_DelID));
        //  console.log('checkStatus.U_DelID', checkStatus.U_DelID);
        //  console.log('user.EmployeeId !== checkStatus.U_DelID', user.EmployeeId !== checkStatus.U_DelID);
         
    
        if ((user.EmployeeId !== checkStatus.U_AppId) && 
            (checkStatus.U_DelID && user.EmployeeId !== checkStatus.U_DelID)) {
          return { message: "You don't have permission to approve this request!" };
        }
    
        if(checkStatus.U_AppSts === "A"){
          return {message: "This request is already approved!"};
        }
    
        if(checkStatus.U_AppSts === "R"){
          return {message: "This request is already Rejected!"};
        }
    
        const patchReq = await this.patchLogData(req, id, payload);
        const updatedData = await this.getLogById(req, id);

        console.log('updated data', updatedData);
    
        if(updatedData.U_AppSts == "R"){
          console.log('inside reject');
          
            const empReqPayload = {
                "U_ApprSts":"R",
                "U_Udt": date,
                "U_UTm": time
            }
            await this.patchTExp(req, updatedData.U_DocNo, empReqPayload); 
            // await sapPatchRequest(req, `/${sapAPIs.Expanses}(${updatedData.data.U_DocNo})`, empReqPayload); 
            return   
        }
    
        // console.log('totalAprLevs', totalAprLevs);
        // console.log('totalLogs', totalLogs);
        
    
        if(totalAprLevs == totalLogs){
          console.log('inside final approval');
    
          const getLatestLogs = await this.getLogByDoc(req, checkStatus.U_DocNo);
            //   const getLatestLogs = await sapGetRequest(req, `${sapAPIs.AllLogEntries}?$filter=U_DocNo eq '${checkStatus.data.U_DocNo}'`);
    
          let latestUpdatedLogs = null;
          if(isResubmitted){
            const expDateTimeStr = `${expReq.U_Udt.split('T')[0]}T${expReq.U_UTm}`;
            const expDocDate = new Date(expDateTimeStr);
    
            latestUpdatedLogs = getLatestLogs.value.filter((i) => { 
              const logDateTimeStr = `${i.U_CDt.split('T')[0]}T${i.U_CTm}`;
              const logEntryDate = new Date(logDateTimeStr);
              if(logEntryDate >= expDocDate) return i;
            });
    
          }
    
          const pending = isResubmitted ? latestUpdatedLogs.filter(val => val.U_AppSts === "R" || val.U_AppSts === "P"):getLatestLogs.value.filter(val => val.U_AppSts === "R" || val.U_AppSts === "P");
    
          // console.log('pendings', pending);
          // console.log('pendings len', pending.length);
          // console.log('pendings len condition', pending.length <= 0);
          
          if(pending.length <= 0){
             const empReqPayload = {
                "U_ApprSts":"A",
                "U_Udt": date,
                "U_UTm": time
            }
            await this.patchTExp(req, updatedData.U_DocNo, empReqPayload);
            await this.createAPInvoice(req, requester, expReq);
            return
          }
        }
        // console.log('status', updatedData.data.U_AppSts);
        // console.log('status val', totalAprLevs > totalLogs);
        // console.log('condition', totalAprLevs, totalLogs);
        // console.log('if condition', updatedData.data.U_AppSts == "A" && totalAprLevs > totalLogs);
        
        if(updatedData.U_AppSts == "A" && totalAprLevs > totalLogs){
    
          const isDelegationId = approvalCollection?.[totalLogs]?.U_DlgID;
          let isDelegationValid = false;
    
          // console.log('isDelegationId', isDelegationId);
    
          if(isDelegationId){
              const currentDate = new Date(
                `${date.toString().slice(0, 4)}-${date.toString().slice(4, 6)}-${date
                  .toString()
                  .slice(6, 8)}`
              );
    
              const fromDate = new Date(approvalCollection?.[totalLogs]?.U_FrmDt);
              const toDate = new Date(approvalCollection?.[totalLogs]?.U_ToDt);
    
              // console.log("currentDate", currentDate);
              // console.log("fromDate", fromDate);
              // console.log("toDate", toDate);
            
              isDelegationValid = currentDate >= fromDate && currentDate <= toDate;
              // console.log("isDelegationValid", isDelegationValid);
          }
          
          // console.log('entry');
            let logPayload = {
              "Name": updatedData.Name,
              "U_DocType": DocType,
              "U_DocNo": updatedData.U_DocNo,
              "U_Stg": approvalCollection?.[totalLogs].U_Stg,
              "U_AppId": approvalCollection?.[totalLogs].U_ApprID,
              "U_AppSts": "P",
              "U_CDt": date,
              "U_CTm": time,
              "U_ReqID": requester?.EmployeeID,
              "U_ApprName": approvalCollection?.[totalLogs].U_ApprName,
              "U_PosId": requester?.Position,
              "U_DelID": isDelegationValid?approvalCollection?.[totalLogs]?.U_DlgID:"",
              "U_DelName": isDelegationValid?approvalCollection?.[totalLogs]?.U_DlgName:"",
          }
          console.log('logpayload', logPayload);
          
          await this.createLog(req, logPayload) 
        //   await creatLogEntry(req, res, logPayload)
        }
        return;
    }

    async resubmitLogEntry (req, docEntry, DocType) {
        const { date, time } = currentTime();
        const user = req.user;

        const emp = await this.getEmployeeDetail(req, user.EmployeeId);
        const app_lev = await this.checkAppvalLvs(req, emp.Position);
        const approvalCollection = app_lev.value?.[0]?.HLB_APP1Collection;
        const isNeedApproval = approvalCollection?.length ?? 0;
        
        let logPayload = {
            "Name": `${emp.FirstName} ${emp.LastName}`,
            "U_ReqID": user.EmployeeId,
            "U_DocType": DocType,
            "U_DocNo": docEntry,
            "U_Stg": isNeedApproval?"1":"",
            "U_AppId": isNeedApproval?app_lev.value?.[0]?.HLB_APP1Collection?.[0]?.U_ApprID:"",
            "U_ApprName": isNeedApproval?app_lev.value?.[0]?.HLB_APP1Collection?.[0]?.U_ApprName:"",
            "U_AppSts": isNeedApproval?"P":"A",
            "U_PosId": emp.Position,
            "U_CDt": date,
            "U_CTm": time
        } 

        console.log('logpyalod', logPayload);
        await this.createLog(req, logPayload);
        
        return {
            message: 'resubmit request log submited successfully'
        }   
    }

    async resubmitRequest (req, DocType) {
        const { date, time } = currentTime();

        console.log('DocType', DocType);
        
      
        const {id} = req.params;
        const user = req.user;
        let payload = req.body;
    
        let attachments = null;
    
        if (req.files && req.files.length > 0) {
          attachments = await SAPController.createAttachment(req, res);
        }
    
        payload.U_ApprSts = "P"
        payload.U_IsReSub = "Y"
        payload.U_Udt = date
        payload.U_UTm = time
        payload.U_Atch = attachments ? attachments.AbsoluteEntry:""
    
        console.log('payu', payload);
        
        const expanse = await this.getTExpById(req, id);
        // const expanse = await sapGetRequest(req, `${sapAPIs.Expanses}(${id})`);
    
        console.log('expanse', expanse);
        
        if(expanse.U_ApprSts === "R" && expanse.U_EmpID == user.EmployeeId){
          console.log('we can procees with this, inside patch');
          // console.log('payload', payload);
          
            await this.patchTExp(req, id, payload); 
            // await sapPatchRequest(req, `${sapAPIs.Expanses}(${id})`, payload);
        }else{
          return {message: "You can't performe this action. Your request is already approved or pending!"}
        }
        // const expanse = await this.getTExpById(req, id);
        // await sapGetRequest(req, `${sapAPIs.Expanses}(${id})`);
        await this.resubmitLogEntry(req, id, DocType)
        return {messge: "request updated successfully!"}
    }

    async getAprRqstList(req, EmpId, query) {
        // Fetch data in parallel
        const [
            logResponse,
            allExpansesResponse,
            allTExpsResponse,
            allAttachmentsResponse
        ] = await Promise.all([
            this.getMyAprLogs(req, EmpId, query),
            this.getAllExpReq(req),
            this.getAllTExp(req),
            this.getAllAtts(req)
        ]);

        const logs = logResponse.value || [];
        const allExpanses = allExpansesResponse.value || [];
        const allTExpsReq = allTExpsResponse.value || [];
        const attachments = allAttachmentsResponse.value || [];

        // return allTExpsReq;

        const attachmentMap = new Map(
            attachments.map(att => [att.AbsoluteEntry, att])
        );

        const expenseWithAttMap = new Map(
            allExpanses.map(exp => [
                exp.DocEntry,
                {
                    ...exp,
                    AttachmentData: attachmentMap.get(Number(exp.U_Atch)) || null
                }
            ])
        );

        const tExpMap = new Map(
            allTExpsReq.map(texp => [
                texp.DocEntry,
                {
                    ...texp,
                    AttachmentData: attachmentMap.get(Number(texp.U_Atch)) || null
                }
            ])
        );

        const result = logs.map(log => {
            let expenseData = null;

            switch (log.U_DocType) {
                case "TR":
                    expenseData = tExpMap.get(Number(log.U_DocNo)) || null;
                    break;

                case "E":
                    expenseData = expenseWithAttMap.get(Number(log.U_DocNo)) || null;
                    break;

                case "L":
                    break;
            }

            return {
                ...log,
                ExpenseData: expenseData
            };
        });

        return result;
    }

}

module.exports = SAPService;