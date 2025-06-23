const BaseRepository = require("./baseRepository");
const { Branch, Company } = require('../models');

class BranchRepository extends BaseRepository{

    constructor(){
        super(Branch);
    }

    async findAll(){
        return await this.model.findAll({ include: Company });
    }

    async findById(id){
        return await this.model.findByPk(id, { include: Company });
    }

}

module.exports = BranchRepository;