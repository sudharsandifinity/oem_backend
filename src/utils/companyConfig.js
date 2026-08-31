const companyJson = require('./Company.json');

const getCompanyConfig = (req) =>
    companyJson.Companies.find((c) => c.name === req.user?.companyName) || {};

const udfField = (req, module, key) =>
    getCompanyConfig(req).udfs?.[module]?.[key] || null;

const udfFields = (req, module) =>
    Object.values(getCompanyConfig(req).udfs?.[module] || {});

const withUdfSelect = (baseFields, req, module) =>
    [...baseFields, ...udfFields(req, module)].join(',');

const EMPLOYEE_BASE_SELECT = [
    'EmployeeID',
    'ExternalEmployeeNumber',
    'JobTitle',
    'LastName',
    'FirstName',
    'eMail',
    'MobilePhone',
    'Department',
    'PassportNumber',
    'Picture',
    'WorkStreet',
    'WorkZipCode',
    'LinkedVendor',
    'CostCenterCode',
    'Position',
    'BPLID'
];

const employeeSelect = (req) => `$select=${withUdfSelect(EMPLOYEE_BASE_SELECT, req, 'employee')}`;

module.exports = { getCompanyConfig, udfField, udfFields, withUdfSelect, EMPLOYEE_BASE_SELECT, employeeSelect };
