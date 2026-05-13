const Endpoints = {
  Employees: "EmployeesInfo",
  Users: "Users",
  Departments: "Departments",
  EmployeesSelect:
    "$select=EmployeeID, ExternalEmployeeNumber,JobTitle,LastName,FirstName,eMail,MobilePhone,Department,PassportNumber,Picture,WorkStreet,WorkZipCode,LinkedVendor,CostCenterCode,Position, BPLID, U_BU",
  Attendance: "U_HLB_OATT",
  AllLogEntries: "U_HLB_OAPL",
  Expanses: "HLB_OECL",
  OrderByDocEntry: "$orderby=DocEntry desc",
  ExpanseTypes: "HLB_EXPM",
  PCTypes: "HLB_OPCM",
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
  Payroll: "U_HLB_PCONF",
  JournalEtry: "JournalEntries",
  EmpSalary: "OECI",
  TerminationRn: "U_HLB_RSGN",
  Resignation: "HLB_ORRQ",
  Certificate: "HLB_OSCR",
  Warning: "HLB_OWLP",
  LoanTy: "OLON",
  Loan: "OLOA",
  PayslipMonth: "OPYP",
  Payslip: "HLB_PYSL",
  Branches: "BusinessPlaces",
  BOQ: "HLB_OBOQT",
  MR: "HLB_OMRQ",
  GRPO: "PurchaseDeliveryNotes",
  GOODSISSUE: "InventoryGenExits"
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
  ExpTypeSlct: "$select=U_ExpCode,U_ExpName, U_DAccCode, U_CAccCode",
};

module.exports = { Endpoints, SAP_QUERIES };
