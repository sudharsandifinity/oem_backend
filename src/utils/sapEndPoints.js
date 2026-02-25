const Endpoints = {
  Employees: "EmployeesInfo",
  EmployeesSelect:
    "$select=EmployeeID, ExternalEmployeeNumber,JobTitle,LastName,FirstName,eMail,MobilePhone,Department,PassportNumber,Picture,WorkStreet,WorkZipCode,LinkedVendor,CostCenterCode,U_BU,Position, BPLID",
  Attendance: "U_HLB_OATT",
  AllLogEntries: "U_HLB_OAPL",
  Expanses: "HLB_OECL",
  OrderByDocEntry: "$orderby=DocEntry desc",
  ExpanseTypes: "HLB_EXPM",
  ApprovalLevels: "HLB_OAPP",
  Currency: "Currencies",
  Attachments: "Attachments2",
  TravelExp: "HLB_OTRV",
  APInvoice: "PurchaseInvoices",
  OTR: "HLB_OOTRQ",
  LeaveType: "OECI",
  Leave: "OLVA",
  AirTicket: "HLB_OATR",
  VendorPayment: "VendorPayments",
  Payroll: "U_HLB_PCONF"
};

const SAP_QUERIES = {
  ApprovalLvFilter:
    "$filter=U_Cate eq ",
  ApprovalLvFilterRem: "AND U_HLB_TREXP eq 'Y'",
  LogFilterByReq: "$filter=U_DocNo eq ",
  FilByUempId: "$filter=U_EmpID eq ",
  OrderByCode: "$orderby=Code desc",
  OrderByDocEntry: "$orderby=DocEntry desc",
  OrderByAbsoluteEntry: "$orderby=AbsoluteEntry desc",
  ExpTypeSlct: "$select=U_ExpCode,U_ExpName, U_DAccCode"
};

module.exports = { Endpoints, SAP_QUERIES };
