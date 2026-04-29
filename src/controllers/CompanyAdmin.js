const UserRepository = require("../repositories/userRepository");
const UserService = require('../services/userService');

class CompanyAdmin {
    constructor(){
        this.userRepository = new UserRepository();
        this.userService = new UserService(this.userRepository);
    }

    CompanyUsers = async (req, res) => {
        try {
            console.log('uid', req.user.id);
            const users = await this.userService.getCompanyUsers(req.user.id);
            return res.status(200).json(users);
        } catch (error) {
            console.log('error while getting company users', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

}

module.exports = CompanyAdmin;

