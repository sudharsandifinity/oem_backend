const BaseController = require('./BaseController');
const UserRepository = require("../repositories/userRepository");

class UserController extends BaseController {
  
    constructor(userService){
        super(userService, "user");
        this.userRepository = new UserRepository();
    }

    async syncSapEmployees(data){
        const existing = await this.userRepository.findByEmail(data.email);
        if(existing){
            console.log(`User id ${existing.id}, email ${existing.email} already exit`);
            return "duplicate";
        };
        await this.userRepository.create(data);
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
        await this.userRepository.update(id, data);
        return;
    }

}

module.exports = UserController;