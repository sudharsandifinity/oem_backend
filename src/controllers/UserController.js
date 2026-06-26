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

    create = async (req, res) => {
        try {
            const limit = await this.service.checkCompanyUserLimit(req.body);
            if (!limit.ok) {
                return res.status(409).json({ message: limit.message });
            }
            const item = await this.service.create(req.body);
            return res.status(201).json(item);
        } catch (error) {
            this.handleError(res, 'creating the user', error);
        }
    }

    async syncSapEmployees(data){
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