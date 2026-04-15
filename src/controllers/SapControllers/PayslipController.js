const SapBaseController = require("./SapBaseController");
const PayslipService = require('../../services/SapServices/PayslipService');


class PayslipController extends SapBaseController {

    constructor(){
        super()
        this.payslipService = new PayslipService();
    }

    getPayslipMonths = async (req, res) => {
        try {
            const response = await this.payslipService.getPayslipMonths(req);
            res.status(200).json(response);
        } catch (error) {
            const message = "Error while fetching payslip months"
            return this.errorCatch(req, res, message, error);
        }
    }

    reqEmployeePaySlip = async (req, res) => {
      try {
        const sapEmp = await this.payslipService.getEmployeeDetail(req, req.user.EmployeeId)
        const payload = {
            "U_EmpID": sapEmp.EmployeeID,
            "U_EmpName": sapEmp.FirstName +" "+ sapEmp.LastName || "",
            "U_PayPerd": req.body.U_PayPerd,
            "U_RSts": "P"
        };
        
        if(!payload.U_EmpID){
          res.status(404).json({message: "Employee Id not found!"});
        }
        
        const existing = await this.payslipService.getPaySlipData(req, sapEmp.EmployeeID, payload.U_PayPerd);
        if(existing){
            res.status(200).json(existing);
        }
        
        const response = await this.payslipService.reqPayslip(req, payload);
        res.status(200).json(response);
      } catch (error) {
          const message = "Error while creating payslip"
          return this.errorCatch(req, res, message, error);
      }
    };

}

module.exports = PayslipController;
