const BaseController = require("./BaseController");

class FormController extends BaseController{

    constructor(FormService){
        super(FormService, "Form");
    }

    getAllActiveGlobalForms = async (req, res) => {
        try{
            const items = await this.service.getAllActiveGlobalForms();
            return res.status(200).json(items);
        }catch(error){
            this.handleError(res, `getting ${this.entityName}s`, error);
        }
    }

    assignGlobalForms = async (req, res, next) => {
        try {
            const { companyId, branchId, formIds } = req.body;

            if ((!branchId && !companyId) || !Array.isArray(formIds) || formIds.length === 0) {
                return res.status(400).json({ message: "companyId or branchId and formIds[] are required" });
            }

            await this.service.assignGlobalForms(companyId, branchId, formIds);

            return res.status(201).json({
                message: "forms assigned successfully"
            });
        } catch (err) {
            next(err);
        }
    };


}

module.exports = FormController;