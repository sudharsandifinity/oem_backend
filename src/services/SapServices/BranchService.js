const SapBaseSetvice = require("./SapBaseService");
const AuthSetvice = require("../AuthService");
const SapBranchRepository = require("../../repositories/SapBranchRepository");
const { exist } = require("joi");


class BranchService extends SapBaseSetvice {

    constructor(){
        super();
        this.SapBranchRepository = new SapBranchRepository();
        this.authService = new AuthSetvice();
    }

    async listAll(req) {
        const data = await this.SapBranchRepository.findAll(req);
        return data;
    }

     async syncBranch(req) {
        const sapLogin = await this.authService.sapLogin(req, req.user.id);
        console.log('sapLogin', sapLogin);
        
        const branches = await this.getBranches(req);
        if(!branches){ 
            return "Branches not availble!";
        }
        
        const companyId = req.user.companyID;

        let createdCount = 0;
        let updatedCount = 0;

        for (const branch of branches) {
            const existing = await this.SapBranchRepository.findByBPLID(branch.BPLID);

            const data = {
                companyId,
                ...branch,
            };

            console.log('import data', data);
            

            if (existing) {
                await this.SapBranchRepository.update(existing.id, data);
                updatedCount++;
            } else {
                await this.SapBranchRepository.create(data);
                createdCount++;
            }
        }

        return {
            message: "Branch sync completed",
            total: branches.length,
            created: createdCount,
            updated: updatedCount
        };
    }

}

module.exports = BranchService;