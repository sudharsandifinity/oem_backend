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
        await this.userServiceClass.create(data);
        return;
    }

    async updateSapEmployees(id, data){
        if (data.email) {
            const existing = await this.userRepository.findByEmail(data.email);
            if (existing && existing.id != id) {
                console.log('Email already exists');
                return "duplicate";
            }
        }
        const user = await this.userRepository.findById(id);
        if(!user) throw new Error('user not found!');
        await this.userServiceClass.update(id, data);
        return;
    }

}

module.exports = UserController;