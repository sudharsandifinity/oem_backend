const BaseController = require("./BaseController");

class CompanyController extends BaseController{

    constructor(CompanyService){
        super(CompanyService, 'Company')
        this.service = CompanyService;
    }

    getActiveList = async (req, res) => {
        try{
            const items = await this.service.getActiveList();
            return res.status(200).json(items);
        } catch (error) {
            console.error('Error getting companies:', error.message);
            return res.status(500).json({ message: 'Error getting companies', error: error.message });
        }
    }

}

module.exports = CompanyController;