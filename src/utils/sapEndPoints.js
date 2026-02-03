const Endpoints = {
  Employees: "EmployeesInfo",
  EmployeesSelect:
    "$select=EmployeeID, ExternalEmployeeNumber,JobTitle,LastName,FirstName,eMail,MobilePhone,Department,PassportNumber,Picture,WorkStreet,WorkZipCode,LinkedVendor,CostCenterCode,U_BU,Position",
  Attendance: "U_HLB_OATT",
  AllLogEntries: "U_HLB_OAPL",
  Expanses: "HLB_OECL",
  OrderByDocEntry: "$orderby=DocEntry desc",
  ExpanseTypes: "HLB_EXPM",
  ApprovalLevels: "HLB_OAPP",
  Currency: "Currencies",
  Attachments: "Attachments2",
  ApprovalLevels: "HLB_OAPP",
  TravelExp: "HLB_OTRV",
  APInvoice: "PurchaseInvoices",
  OTR: "HLB_OOTRQ",
  LeaveType: "OECI",
  Leave: "OLVA",
  AirTicket: "HLB_OATR"
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
};

module.exports = { Endpoints, SAP_QUERIES };
