const SapBaseController = require("./SapBaseController");
const BranchService = require('../../services/SapServices/BranchService');


class SapBranchController extends SapBaseController {

    constructor(){
        super()
        this.sapBranchService = new BranchService();
    }

    getAll = async (req, res) => {
        try {
            const response = await this.sapBranchService.listAll(req);
            res.status(200).json(response);
        } catch (error) {
            const message = "Error while fetching sap branches!"
            return this.errorCatch(req, res, message, error);
        }
    }

    getSapBranches = async (req, res) => {
        try {
            console.log('req.user', req.user);
            
            const response = await this.sapBranchService.syncBranch(req);
            res.status(200).json(response);
        } catch (error) {
            const message = "Error while fetching sap branches!"
            return this.errorCatch(req, res, message, error);
        }
    }

}

module.exports = SapBranchController;
