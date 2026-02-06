const BaseController = require('./BaseController');
const UserRepository = require("../repositories/userRepository");
const { decodeId } = require('../utils/hashids');
const UserService = require('../services/userService');

class UserController extends BaseController {
  
    constructor(userService){
        super(userService, "user");
        this.userRepository = new UserRepository();
        this.userServiceClass = new UserService(this.userRepository);
    }

    async syncSapEmployees(data){
        const existing = await this.userRepository.findByEmail(data.email);
        if(existing){
            console.log(`User id ${existing.id}, email ${existing.email} already exit`);
            return "duplicate";
        };
        await this.userServiceClass.createSapUser(data);
        return;
    }

    async updateSapEmployees(id, data){
        const user = await this.userRepository.findById(id);
        if(!user) throw new Error('user not found!');
        await this.userServiceClass.updatesapemp(id, data);
        return;
    }

}

module.exports = UserController;