const SapBaseSetvice = require("./SapBaseService");
const SAPService = new require('../SAPService');


class PayslipService extends SapBaseSetvice {

    constructor(){
        super()
        this.SAPService = new SAPService();
    }

    async getPayslipMonths(req) {
        const response = await this.sapClient.PayslipMonth(req);
        return response.data.value;
    }

    async reqPayslip(req, payload){
        const response = await this.sapClient.reqPayslip(req, payload);
        return response.data;
    }

    async getPaySlipData(req, employeeId, month) {
        const response = await this.sapClient.getPayslip(req, employeeId, month);
        console.log(response?.data?.value?.length);
        if(response?.data?.value?.length){
            const att = response?.data?.value?.[0];
            if(!att.U_Atch) return att;
            const attachment = await this.SAPService.getAttachment(req, att.U_Atch);
            return attachment;
        }
        return
    }

}

module.exports = PayslipService;