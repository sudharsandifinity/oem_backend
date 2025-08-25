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
            const { companyId, globalFormIds } = req.body;

            if (!companyId || !Array.isArray(globalFormIds) || globalFormIds.length === 0) {
                return res.status(400).json({ message: "companyId and globalFormIds[] are required" });
            }

            const result = await this.service.assignGlobalForms(companyId, globalFormIds);

            return res.status(201).json({
                message: "Global forms assigned successfully",
                data: result
            });
        } catch (err) {
            next(err);
        }
    };


}

module.exports = FormController;