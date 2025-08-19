const { User, Role, Branch } = require('../models');
const BaseRepository = require('./baseRepository');

class UserRepository extends BaseRepository {
  
    constructor(){
        super(User)
    }

    async findAll(){
        return await this.model.findAll({ include: [ Branch ] });
    }

    async findById(id){
        return await this.model.findByPk(id, {include: [ Branch ]});
    }

    async findByEmail(email){
        return await this.model.findOne({ where: {email} });
    }

}

module.exports = UserRepository;