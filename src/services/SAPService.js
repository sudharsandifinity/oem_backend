const { currentTime } = require('../utils/currentTime');
const { Endpoints } = require('../utils/sapEndPoints');
const { sapPatchRequest } = require('../utils/sapRequestMethods');
const { AttendanceRegularizationDraft } = require('../models');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');
const SAPClient = require('./SAPClient');

class SAPService extends SAPClient{

    async getAllEmployees(req, query) {
        const response = await this.getEmployees(req, query);
        return response.data;
    }

    async getAllLeaveType(req, EmpId) {
        const response = await this.getLeaveType(req, EmpId);
        return response.data;
    }

    async getEmployeeDetail(req, id) {
        const response = await this.getEmployee(req, id);
        return response.data;
    }

    // dynamic

    async getReqByEmpId(req, EmpId, query) {
        const response = await this.getReqByEmp(req, EmpId, query);
        // const myLogs = await this.getMyLogs(req, EmpId);

        // switch(query.endpoint) {
        //     case "HLB_OTRV":
        //         const filLogTR = myLogs.value.filter((log) => log.U_DocType == "TR");
        //         const logdatasTR = response.data.value.map((data) => {
        //             const logs = filLogTR.filter((log) => log.U_DocNo == data.DocEntry);
        //             return { ...data, Logs: logs };
        //         });
        //         return logdatasTR;

        //     case "HLB_OOTRQ":
        //         const filLogOT = myLogs.value.filter((log) => log.U_DocType == "OT");
        //         const logdatasOT = response.data.value.map((data) => {
        //             const logs = filLogOT.filter((log) => log.U_DocNo == data.DocEntry);
        //             return { ...data, Logs: logs };
        //         });
        //         return logdatasOT;

        //     case "OLVA":
        //         const filLogLv = myLogs.value.filter((log) => log.U_DocType == "L");
        //         const logdatasLv = response.data.value.map((data) => {
        //             const logs = filLogLv.filter((log) => log.U_DocNo == data.DocEntry);
        //             return { ...data, Logs: logs };
        //         });
        //         return logdatasLv;

        //     case "HLB_OATR":
        //         const filLogAT = myLogs.value.filter((log) => log.U_DocType == "AT");
        //         const logdatasAT = response.data.value.map((data) => {
        //             const logs = filLogAT.filter((log) => log.U_DocNo == data.DocEntry);
        //             return { ...data, Logs: logs };
        //         });
        //         return logdatasAT;

        //     case "HLB_OECL":
        //         const filLogE = myLogs.value.filter((log) => log.U_DocType == "E");
        //         const logdatasE = response.data.value.map((data) => {
        //             const logs = filLogE.filter((log) => log.U_DocNo == data.DocEntry);
        //             return { ...data, Logs: logs };
        //         });
        //         return logdatasE;

        //     default:
        //         return [];
        // }
        return response.data;
    }


    async getRqstById(req, endpoint, docEntry){
        const response = await this.getReqById(req, endpoint, docEntry);

        let attachment;
        if(response.data.U_Atch){
            attachment = await this.getAttachment(req, response.data.U_Atch);
        }

        const EmpId = req.user.EmployeeId;
        const myLogs = await this.getMyLogs(req, EmpId);

        switch(endpoint) {
            case "HLB_OTRV":
                const filLogTR = myLogs.value.filter((log) => log.U_DocType == "TR");
                const TrLogs = filLogTR.filter((log) => log.U_DocNo == response.data.DocEntry);
                return {...response.data, AttachmentData: attachment, Logs: TrLogs};

            case "HLB_OOTRQ":
                const filLogOT = myLogs.value.filter((log) => log.U_DocType == "OT");
                const OTLogs = filLogOT.filter((log) => log.U_DocNo == response.data.DocEntry);
                return {...response.data, AttachmentData: attachment, Logs: OTLogs};

            case "OLVA":
                const filLogLv = myLogs.value.filter((log) => log.U_DocType == "L");
                const LLogs = filLogLv.filter((log) => log.U_DocNo == response.data.DocEntry);
                return {...response.data, AttachmentData: attachment, Logs: LLogs};

            case "HLB_OATR":
                const filLogAT = myLogs.value.filter((log) => log.U_DocType == "AT");
                const ATLogs = filLogAT.filter((log) => log.U_DocNo == response.data.DocEntry);
                return {...response.data, AttachmentData: attachment, Logs: ATLogs};

            case "HLB_OECL":
                const filLogE = myLogs.value.filter((log) => log.U_DocType == "E");
                const ELogs = filLogE.filter((log) => log.U_DocNo == response.data.DocEntry);
                return {...response.data, AttachmentData: attachment, Logs: ELogs};

            default:
                return [];
        }
    }

    async createReq(req, endpoint, payload){
        const response = await this.createRq(req, endpoint, payload);
        return response.data;
    }

    async patchReq(req, endpoint, docEntry, payload){
        const response = await this.patchRq(req, endpoint, docEntry, payload);
        return response.data;
    }

    // -----------------------------

    async attendanceData(req, EmpId){
        const response = await this.attendance(req, EmpId);
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

    async createOTReq(req, payload){
        const response = await this.createOTR(req, payload);
        return response.data;
    }

    async createLvReq(req, payload){
        const response = await this.createLv(req, payload);
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

    async getLogByDoc(req, colection){
        const response = await this.getRequestLogs(req, colection);
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

    async getMyLogs(req, EmpId){
        const response = await this.getEmpLogs(req, EmpId);
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

    async getAttachment(req, id){
        const response = await this.getAtt(req, id);
        return response.data;
    }

    async createAtta(req, data, header){
        const response = await this.createAtt(req, data, header);
        return response.data;
    }

    async getAllTExp(req){
        const response = await this.getTExpanses(req);
        return response.data;
    }

    async getAllLvReq(req){
        const response = await this.getAllLv(req);
        return response.data;
    }

    async getAllOTR(req){
        const response = await this.getAllOT(req);
        return response.data;
    }

    async getTExpByEmpId(req, EmpId, query){
        const response = await this.getTExpByEmp(req, EmpId, query);
        return response.data;
    }

    async getOTRByEmpId(req, EmpId, query){
        const response = await this.getTORByEmp(req, EmpId, query);
        return response.data;
    }

    async getLvByEmpId(req, EmpId, query){
        const response = await this.getLvByEmp(req, EmpId, query);
        return response.data;
    }

    async getTExpById(req, docEntry){
        const response = await this.getTExpanse(req, docEntry);
        return response.data;
    }

    async getOTRById(req, docEntry){
        const response = await this.getOTR(req, docEntry);
        return response.data;
    }

    async getLvRById(req, docEntry){
        const response = await this.getLvRq(req, docEntry);
        return response.data;
    }

    async patchTExp(req, docEntry, payload){
        const response = await this.patchTExpanse(req, docEntry, payload);
        return response.data;
    }

    async patchOTReq(req, docEntry, payload){
        const response = await this.patchOTR(req, docEntry, payload);
        return response.data;
    }

    async patchLvReq(req, docEntry, payload){
        const response = await this.patchLv(req, docEntry, payload);
        return response.data;
    }

    async calculateDays(fromDate, toDate) {
        const from = new Date(
            fromDate.toString().slice(0,4),
            fromDate.toString().slice(4,6) - 1,
            fromDate.toString().slice(6,8)
        );

        const to = new Date(
            toDate.toString().slice(0,4),
            toDate.toString().slice(4,6) - 1,
            toDate.toString().slice(6,8)
        );
        
        const diffTime = to - from;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        return diffDays + 1;
    }

    async createAttachment (req) {
        try {
            const files = req.files;
        
            if (!files || files.length === 0) {
                return { message: "No files uploaded" };
            }
    
            const form = new FormData();
        
            files.forEach(file => {
            const ext = path.extname(file.originalname);
            const base = path.basename(file.originalname, ext);
        
            const uniqueName = `${base}_${Date.now()}_${crypto.randomUUID()}${ext}`;
        
            form.append(
                "file",
                fs.createReadStream(file.path),
                {
                    filename: uniqueName,
                    contentType: file.mimetype
                }
            );
            });
        
            const response = await this.createAtta(
                req,
                form,
                form.getHeaders()
            );
        
            return response;
    
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    async checkModule(DocType){
        
        switch (DocType) {
            case "TR":
                return {
                    checkAprv: "U_HLB_TREXP",
                    endpoint: Endpoints.TravelExp,
                    create: this.createReq.bind(this),
                    getById: this.getRqstById.bind(this),
                    patch: this.patchReq.bind(this)
                };

            case "OT":
                return {
                    checkAprv: "U_HLB_OTREQ",
                    endpoint: Endpoints.OTR,
                    create: this.createReq.bind(this),
                    getById: this.getRqstById.bind(this),
                    patch: this.patchReq.bind(this)
                };

            case "E":
                return {
                    checkAprv: "U_HLB_EXP",
                    endpoint: Endpoints.Expanses,
                    create: this.createReq.bind(this),
                    getById: this.getRqstById.bind(this),
                    patch: this.patchReq.bind(this)
                };

            case "L":
                return {
                    checkAprv: "U_HLB_LEV",
                    endpoint: Endpoints.Leave,
                    create: this.createReq.bind(this),
                    getById: this.getRqstById.bind(this),
                    patch: this.patchReq.bind(this)
                };

            case "AT":
                return {
                    checkAprv: "U_HLB_ARTK",
                    endpoint: Endpoints.AirTicket,
                    create: this.createReq.bind(this),
                    getById: this.getRqstById.bind(this),
                    patch: this.patchReq.bind(this)
                };

            default:
                throw new Error("Invalid DocType");
        }
    }

    async createRequest (req, DocType) {

        const { date, time } = currentTime();
        const { endpoint, create, checkAprv } = await this.checkModule(DocType);
        console.log('endpoint',  endpoint,);
        console.log('date', date, time);
        console.log('DocType', DocType);
        console.log('checkAprv',checkAprv);
        
        const user = req.user;
        const emp = await this.getEmployeeDetail(req, user.EmployeeId);
        const app_lev = await this.checkAppvalLvs(req, emp.Position, checkAprv);
        // console.log('app lev', app_lev);return
        const approvalCollection = app_lev.value?.[0]?.HLB_APP1Collection;
        // return approvalCollection;
        const isNeedApproval = approvalCollection?.length ?? 0;

        let stg_1;
        if(isNeedApproval){
            stg_1 =  approvalCollection.filter(i => i.U_Stg === "1");
            // console.log('stg1', stg_1);
        }

        // return stg_1

        let attachments = null;

        if (req.files && req.files.length > 0) {
            attachments = await this.createAttachment(req);
        }
        console.log("attachments", attachments );
        
        
        let payload = req.body;
        payload.U_EmpID = user.EmployeeId || 0;
        payload.U_EmpName = emp.FirstName +" "+ emp.LastName || "";
        payload.U_ApprSts = isNeedApproval ? "P":"A";
        payload.U_CDt = date,
        payload.U_CTm = time
        payload.U_Udt = date,
        payload.U_UTm = time,
        payload.U_Atch = attachments ? attachments.AbsoluteEntry:""
        
        if(DocType == "L"){
            console.log('inside L');
            const noDays = await this.calculateDays(payload.U_FromDate, payload.U_Todate)
            console.log('no days', noDays);
            const leaves = await this.getAllLeaveType(req, user.EmployeeId);
            const collection = leaves?.value?.[0]?.INPR_ECI5Collection || [];
            const checkAva = collection.filter(lev =>
                lev.U_LveCode?.trim() === payload.U_LveCode?.trim()
            );
            console.log('checkava', checkAva);

            if(checkAva[0]?.U_BalLeave < noDays){
                return {message: "Applied leave is greater than Balance!"}
            }
            
            payload.U_PreByCod = user.EmployeeId || 0;
            payload.U_NoDayLve = noDays || 0;
            if(!isNeedApproval){
                payload.U_BalLeave = checkAva[0]?.U_BalLeave - noDays || 0;
            }
        }

        console.log('payload', payload);
        // return payload
        const response = await create(req, endpoint, payload);  
        // const response = await this.createTravelExpReq(req, payload);  
        console.log('form response', response);
        // return response
        
        
        // console.log('isneedapproval', isNeedApproval);

        if(!isNeedApproval && (DocType != "L")){
            await this.APInvoice(req, emp, response, DocType)
        }

        if(isNeedApproval){
            for (const element of stg_1) {

                const isDelegationId = element.U_DlgID;
                let isDelegationValid = false;

                console.log('isDelegationId', isDelegationId);

                if(isDelegationId){
                    console.log('inside dele');
                
                    const currentDate = new Date(
                    `${date.toString().slice(0, 4)}-${date.toString().slice(4, 6)}-${date
                        .toString()
                        .slice(6, 8)}`
                    );

                    const fromDate = new Date(element.U_FrmDt);
                    const toDate = new Date(element.U_ToDt);

                    // console.log("currentDate", currentDate);
                    // console.log("fromDate", fromDate);
                    // console.log("toDate", toDate);
                
                    isDelegationValid = currentDate >= fromDate && currentDate <= toDate;
                    console.log("isDelegationValid", isDelegationValid);
                }

                let logPayload = {
                    "Name": payload.U_EmpName,
                    "U_ReqID": user.EmployeeId,
                    "U_DocType": DocType,
                    "U_DocNo": response.DocEntry,
                    "U_Stg": isNeedApproval?"1":"",
                    "U_AppId": isNeedApproval?element.U_ApprID:"",
                    "U_ApprName": isNeedApproval?element.U_ApprName:"",
                    "U_AppSts": isNeedApproval?"P":"A",
                    "U_PosId": emp.Position,
                    "U_DelID": isDelegationValid?element.U_DlgID:"",
                    "U_DelName": isDelegationValid?element.U_DlgName:"",
                    "U_CDt": date,
                    "U_CTm": time
                } 
                console.log('logPayload', logPayload);
                await this.createLog(req, logPayload)
            };
        }
        return response;
    } 

    async PayOut(req, response){
        const { date, time } = currentTime();

        const paymentPayload =  {
            "DocType": "rAccount",
            "DocDate": date,
            "CashAccount": null,
            "DocCurrency": response.U_CUR,
            "CashSum": 0.0,
            "TransferAccount": "161012",
            "TransferSum": response.U_ExpAmt,
            "TransferDate": date,
            "TaxDate": date,
            "VatDate": date,
            "DocTypte": "rAccount",
            "DueDate": date,
            "BPLID": 1,
            "CashFlowAssignments": [
                {
                    "AmountLC": response.U_ExpAmt,
                    "PaymentMeans": "pmtBankTransfer"
                }
            ],
            "PaymentAccounts": [
                {
                    "LineNum": 0,
                    "AccountCode": "510020",
                    "SumPaid": response.U_ExpAmt,
                    "SumPaidFC": 0.0,
                    "GrossAmount": response.U_ExpAmt,
                    "ProjectCode": null
                }
            ]  

        }

        await this.vendorPayment(req, paymentPayload);
    }

    async APInvoice (req, emp, response, U_DocType){
        const { endpoint, patch } = await this.checkModule(U_DocType);
        // console.log('respos', response);
        // console.log('respos', response.DocEntry);

        const APInvoicePayload = {
            "DocType": "dDocument_Service",
            "CardCode": emp.LinkedVendor,
            "DocCurrency": response.U_CUR,
            "JournalMemo": response.U_ExpType?`${response.U_ExpType} - ${emp.FirstName} ${emp.LastName}`:null,
            "Project": response.U_PrjCode,
            "DocTotal":response.U_ExpAmt??"0",
            "DocumentLines": [
                {
                    "LineNum":0,
                    "ItemDescription": response.U_ExpType?`${response.U_ExpType} - ${emp.FirstName} ${emp.LastName}`:`${emp.FirstName} ${emp.LastName}`,
                    "ExpenseType": response.U_ExpType?response.U_ExpType:null,
                    "ProjectCode": response.U_PrjCode,
                    "CostingCode2": emp.CostCenterCode,
                    "CostingCode": emp.U_BU,
                    "Currency": response.U_CUR,
                    "LineTotal":response.U_ExpAmt??"0"
                }
            ]
            }
            console.log('APInvoicePayload', APInvoicePayload);

            try{
            const APInvoiceStatus =  await this.createAPInvoice(req, APInvoicePayload);
            // const APInvoiceStatus =  await sapPostRequest(req, `/PurchaseInvoices`, APInvoicePayload);
            const patchPayload = {
                "U_OPNo": APInvoiceStatus.DocEntry,
                "U_PSts": APInvoiceStatus.DocEntry?"Success":APInvoiceStatus.error
            }
            await patch(req, endpoint, response.DocEntry, patchPayload); 
            // await sapPatchRequest(req, `${Endpoints.Expanses}(${response.DocEntry})`, patchPayload);
            } catch(err){
            const patchPayload = {
                "U_OPNo": "",
                "U_PSts": err.response?.data?.error?.message?.value
            }
            await patch(req, endpoint, response.DocEntry, patchPayload); 
            // await sapPatchRequest(req, `${Endpoints.Expanses}(${response.DocEntry})`, patchPayload);
        }
    }

    async RequestResponse (req) {
        const { date, time } = currentTime();
        const user = req.user;
        const {id} = req.params;
        const {U_LvAppFDt, U_LvAppTDt, ...payload} = req.body;
        
        const checkStatus = await this.getLogById(req, id);
        const { endpoint, getById, patch, checkAprv } = await this.checkModule(checkStatus.U_DocType);
        console.log('checkAprv', checkAprv);

        const expReq = await getById(req, endpoint, checkStatus.U_DocNo);
        const requester = await this.getEmployeeDetail(req, expReq.U_EmpID); 
        const approver = await this.getEmployeeDetail(req, user.EmployeeId); 
        const app_lev = await this.checkAppvalLvs(req, requester.Position, checkAprv);
    
        payload.U_ApprDt = date;
        payload.U_ApprTm = time;
        payload.U_AppByID = approver.EmployeeID,
        payload.U_AppByName = `${approver.FirstName} ${approver.LastName}`
    
        console.log('payload', payload);

        if(checkStatus.U_DocType == "L" && U_LvAppFDt && U_LvAppTDt){
            const noDays = await this.calculateDays(U_LvAppFDt??expReq.U_FromDate, U_LvAppTDt??expReq.U_Todate)

            const formPayload = {
                "U_LvAppFDt": U_LvAppFDt??"",
                "U_LvAppTDt": U_LvAppTDt??"",
                "U_NoLveApp": noDays
            }
            console.log('form pay', formPayload);
            await patch(req, endpoint, checkStatus.U_DocNo, formPayload);
        }
    
        const approvalCollection = app_lev.value?.[0]?.HLB_APP1Collection;
        const totalAprLevs = approvalCollection.length;

        console.log('approvalCollection', approvalCollection);
        console.log('totalAprLevs', totalAprLevs);
    
        const getLogs = await this.getLogByDoc(req, checkStatus);

        const get_sm_stg = getLogs.value.filter(i => i.U_Stg == checkStatus.U_Stg);
    
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

        for(const item of get_sm_stg){
            if(item.Code == id){
                continue
            }
            await this.patchLogData(req, item.Code, payload)
        }

        const updatedData = await this.getLogById(req, id);

        console.log('updated data', updatedData);
    
        if(updatedData.U_AppSts == "R"){
          console.log('inside reject');
          
            const empReqPayload = {
                "U_ApprSts":"R",
                "U_Udt": date,
                "U_UTm": time
            }
            await patch(req, endpoint, updatedData.U_DocNo, empReqPayload);
            return   
        }
    
        // console.log('totalAprLevs', totalAprLevs);
        // console.log('totalLogs', totalLogs);
        const updatedExpReq = await getById(req, endpoint,checkStatus.U_DocNo);
    
        if(totalAprLevs == totalLogs){
          console.log('inside final approval');
    
          const getLatestLogs = await this.getLogByDoc(req, checkStatus);
          
          let latestUpdatedLogs = null;
          if(isResubmitted){
            const expDateTimeStr = `${updatedExpReq.U_Udt.split('T')[0]}T${updatedExpReq.U_UTm}`;
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

            
            if(checkStatus.U_DocType == "L"){
                const noDays = await this.calculateDays(updatedExpReq.U_LvAppFDt, updatedExpReq.U_LvAppTDt);
                console.log('updatedExpReq', updatedExpReq);
                console.log('no days', noDays);
                console.log('inside L');
                const leaves = await this.getAllLeaveType(req, user.EmployeeId);
                const collection = leaves?.value?.[0]?.INPR_ECI5Collection || [];
                const checkAva = collection.filter(lev =>
                    lev.U_LveCode?.trim() === updatedExpReq.U_LveCode?.trim()
                );

                if(checkAva[0]?.U_BalLeave < noDays){
                    return {message: "Applied leave is greater than Balance!"}
                }
                
                empReqPayload.U_BalLeave = updatedExpReq.U_NoDayLve || 0;
            }
            console.log('empReqPayload', empReqPayload);
            
            await patch(req, endpoint, updatedData.U_DocNo, empReqPayload);
            await this.APInvoice(req, requester, updatedExpReq, checkStatus.U_DocType)
            return
          }
        }
        console.log('status', updatedData.U_AppSts);
        console.log('status val', totalAprLevs > totalLogs);
        console.log('totalAprLevs', totalAprLevs, 'totalLogs', totalLogs);
        // console.log('if condition', updatedData.data.U_AppSts == "A" && totalAprLevs > totalLogs);
        
        if(updatedData.U_AppSts == "A" && totalAprLevs > totalLogs){

            const nextStg = Number(checkStatus.U_Stg) + 1;
            const nextStgApr = approvalCollection.filter(i => i.U_Stg == nextStg);

            for(const i of nextStgApr){
                // console.log('entry');
                const isDelegationId = i.U_DlgID;
                let isDelegationValid = false;

                // console.log('isDelegationId', isDelegationId);

                if(isDelegationId){
                    const currentDate = new Date(
                        `${date.toString().slice(0, 4)}-${date.toString().slice(4, 6)}-${date
                        .toString()
                        .slice(6, 8)}`
                    );

                    const fromDate = new Date(i.U_FrmDt);
                    const toDate = new Date(i.U_ToDt);

                    // console.log("currentDate", currentDate);
                    // console.log("fromDate", fromDate);
                    // console.log("toDate", toDate);
                    
                    isDelegationValid = currentDate >= fromDate && currentDate <= toDate;
                    // console.log("isDelegationValid", isDelegationValid);
                }

                let logPayload = {
                    "Name": updatedData.Name,
                    "U_DocType": checkStatus.U_DocType,
                    "U_DocNo": updatedData.U_DocNo,
                    "U_Stg": i.U_Stg,
                    "U_AppId": i.U_ApprID,
                    "U_AppSts": "P",
                    "U_CDt": date,
                    "U_CTm": time,
                    "U_ReqID": requester?.EmployeeID,
                    "U_ApprName": i.U_ApprName,
                    "U_PosId": requester?.Position,
                    "U_DelID": isDelegationValid?approvalCollection?.[totalLogs]?.U_DlgID:"",
                    "U_DelName": isDelegationValid?approvalCollection?.[totalLogs]?.U_DlgName:"",
                }
                // console.log('logpayload', logPayload);
                
               await this.createLog(req, logPayload) 
            }
        }
        return;
    }

    async resubmitLogEntry (req, docEntry, DocType) {
        const { date, time } = currentTime();
        const { checkAprv } = await this.checkModule(DocType);
        const user = req.user;

        const emp = await this.getEmployeeDetail(req, user.EmployeeId);
        const app_lev = await this.checkAppvalLvs(req, emp.Position, checkAprv);
        const approvalCollection = app_lev.value?.[0]?.HLB_APP1Collection;
        const isNeedApproval = approvalCollection?.length ?? 0;

        let stg_1;
        if(isNeedApproval){
            stg_1 =  approvalCollection.filter(i => i.U_Stg === "1");
            // console.log('stg1', stg_1);
        }

        if(isNeedApproval){
            for (const element of stg_1) {

                const isDelegationId = element.U_DlgID;
                let isDelegationValid = false;

                console.log('isDelegationId', isDelegationId);

                if(isDelegationId){
                    console.log('inside dele');
                
                    const currentDate = new Date(
                    `${date.toString().slice(0, 4)}-${date.toString().slice(4, 6)}-${date
                        .toString()
                        .slice(6, 8)}`
                    );

                    const fromDate = new Date(element.U_FrmDt);
                    const toDate = new Date(element.U_ToDt);

                    // console.log("currentDate", currentDate);
                    // console.log("fromDate", fromDate);
                    // console.log("toDate", toDate);
                
                    isDelegationValid = currentDate >= fromDate && currentDate <= toDate;
                    console.log("isDelegationValid", isDelegationValid);
                }

                let logPayload = {
                    "Name": `${emp.FirstName} ${emp.LastName}`,
                    "U_ReqID": user.EmployeeId,
                    "U_DocType": DocType,
                    "U_DocNo": docEntry,
                    "U_Stg": isNeedApproval?"1":"",
                    "U_AppId": isNeedApproval?element.U_ApprID:"",
                    "U_ApprName": isNeedApproval?element.U_ApprName:"",
                    "U_AppSts": isNeedApproval?"P":"A",
                    "U_PosId": emp.Position,
                    "U_DelID": isDelegationValid?element.U_DlgID:"",
                    "U_DelName": isDelegationValid?element.U_DlgName:"",
                    "U_CDt": date,
                    "U_CTm": time
                } 
                console.log('logPayload', logPayload);
                await this.createLog(req, logPayload)
            };
        }
        
        // let logPayload = {
        //     "Name": `${emp.FirstName} ${emp.LastName}`,
        //     "U_ReqID": user.EmployeeId,
        //     "U_DocType": DocType,
        //     "U_DocNo": docEntry,
        //     "U_Stg": isNeedApproval?"1":"",
        //     "U_AppId": isNeedApproval?app_lev.value?.[0]?.HLB_APP1Collection?.[0]?.U_ApprID:"",
        //     "U_ApprName": isNeedApproval?app_lev.value?.[0]?.HLB_APP1Collection?.[0]?.U_ApprName:"",
        //     "U_AppSts": isNeedApproval?"P":"A",
        //     "U_PosId": emp.Position,
        //     "U_CDt": date,
        //     "U_CTm": time
        // } 

        // console.log('logpyalod', logPayload);
        // await this.createLog(req, logPayload);
        
        return {
            message: 'resubmit request log submited successfully'
        }   
    }

    async resubmitRequest (req, DocType) {
        const { date, time } = currentTime();
        const { endpoint, getById, patch } = await this.checkModule(DocType);

        console.log('DocType', DocType);
        
      
        const {id} = req.params;
        const user = req.user;
        let payload = req.body;
    
        let attachments = null;
    
        if (req.files && req.files.length > 0) {
          attachments = await this.createAttachment(req);;
        }
    
        payload.U_ApprSts = "P"
        payload.U_IsReSub = "Y"
        payload.U_Udt = date
        payload.U_UTm = time
        payload.U_Atch = attachments ? attachments.AbsoluteEntry:""
    
        console.log('payu', payload);
        
        const expanse = await getById(req, endpoint, id);
        // const expanse = await sapGetRequest(req, `${sapAPIs.Expanses}(${id})`);
    
        console.log('expanse', expanse);
        
        if(expanse.U_ApprSts === "R" && expanse.U_EmpID == user.EmployeeId){
          console.log('we can procees with this, inside patch');
          // console.log('payload', payload);
          
            await patch(req, endpoint, id, payload); 
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
        
        // const [
        //     logResponse,
        //     allExpansesResponse,
        //     // allTExpsResponse,
        //     allLeaveRequests,
        //     allAttachmentsResponse,
        //     allOTExp
        // ] = await Promise.all([
        //     this.getMyAprLogs(req, EmpId, query),
        //     this.getAllExpReq(req),
        //     // this.getAllTExp(req),
        //     this.getAllLvReq(req),
        //     this.getAllAtts(req),
        //     this.getAllOTR(req)
        // ]);
        
        // const logs = logResponse.value || [];
        // const allExpanses = allExpansesResponse.value || [];
        // // const allTExpsReq = allTExpsResponse.value || [];
        // const allLeaveRq = allLeaveRequests.value || [];
        // const attachments = allAttachmentsResponse.value || [];
        // const OTs = allOTExp.value || [];

        const results = await Promise.allSettled([
            this.getMyAprLogs(req, EmpId, query),
            this.getAllExpReq(req),
            this.getAllTExp(req), 
            this.getAllLvReq(req),
            this.getAllAtts(req),
            this.getAllOTR(req)
        ]);

        const [
            logResult,
            expResult,
            tExpResult,
            leaveResult,
            attResult,
            otResult
        ] = results;

        const logs = logResult.status === 'fulfilled' ? logResult.value.value || [] : [];
        const allExpanses = expResult.status === 'fulfilled' ? expResult.value.value || [] : [];
        const allTExpsReq = tExpResult.status === 'fulfilled' ? expResult.value.value || [] : [];
        const allLeaveRq = leaveResult.status === 'fulfilled' ? leaveResult.value.value || [] : [];
        const attachments = attResult.status === 'fulfilled' ? attResult.value.value || [] : [];
        const OTs = otResult.status === 'fulfilled' ? otResult.value.value || [] : [];

        results.forEach((r, i) => {
            if (r.status === 'rejected') {
            console.warn(`Service ${i} failed:`, r.reason?.message || r.reason);
            }
        });

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

        const LeaveMap = new Map(
            allLeaveRq.map(lev => [
                lev.DocEntry,
                {
                    ...lev,
                    AttachmentData: attachmentMap.get(Number(lev.U_Atch)) || null
                }
            ])
        );

        const OT = new Map(
            OTs.map(ot => [
                ot.DocEntry,
                {
                    ...ot
                }
            ])
        );

        const result = logs.map(log => {
            let expenseData = null;

            switch (log.U_DocType) {
                case "TR":
                    expenseData = tExpMap.get(Number(log.U_DocNo)) || null;
                    break;

                case "OT":
                    expenseData = OT.get(Number(log.U_DocNo)) || null;
                    break;

                case "E":
                    expenseData = expenseWithAttMap.get(Number(log.U_DocNo)) || null;
                    break;

                case "L":
                    expenseData = LeaveMap.get(Number(log.U_DocNo)) || null;
                    break;
            }

            return {
                ...log,
                ExpenseData: expenseData
            };
        });

        return result;
    }

    async createRegularization (req) {

        const { date, time } = currentTime();
        const { endpoint, create, checkAprv } = await this.checkModule("OT");
        console.log('endpoint',  endpoint,);
        console.log('date', date, time);
        console.log('checkAprv',checkAprv);

        const user = req.user;
        const emp = await this.getEmployeeDetail(req, user.EmployeeId);
        const app_lev = await this.checkAppvalLvs(req, emp.Position, checkAprv);
        // console.log('app lev', app_lev);return
        const approvalCollection = app_lev.value?.[0]?.HLB_APP1Collection;
        const isNeedApproval = approvalCollection?.length ?? 0;
        // console.log('approvalCollection', approvalCollection);
        // console.log('isNeedApproval', isNeedApproval);
        // console.log('req.files', req.files);

        let attachments = null;

        if (req.files && req.files.length > 0) {
            attachments = await this.createAttachment(req);
        }
        // console.log("attachments", attachments );
        
        let payload = req.body;
        console.log('body', payload);

        const createdData = await AttendanceRegularizationDraft.create(payload);
        console.log('createdata', createdData);

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
            "Name": payload.Name,
            "U_ReqID": user.EmployeeId,
            "U_DocType": "OT",
            "U_DocNo": payload.Code,
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
        return "Request submited successfully!";
    }

    async regularizationResponse (req) {
        
    }

}

module.exports = SAPService;