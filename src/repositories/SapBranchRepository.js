const BaseRepository = require("./baseRepository");
const { SapBranch } = require('../models');

class SapBranchRepository extends BaseRepository {

    constructor(){
        super(SapBranch)
    }

    async findByBPLID (BPLID) {
        return await this.model.findOne({ where: {BPLID: BPLID}, raw: true });
    }

}

module.exports = SapBranchRepository;