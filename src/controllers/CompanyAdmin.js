const UserRepository = require("../repositories/userRepository");
const CompanyRepository = require("../repositories/CompanyRepository");
const UserService = require('../services/userService');
const CompanyService = require('../services/CompanyService');
const { encodeId } = require("../utils/hashids");
const { roleService } = require("../routes/v1/admin/roleRoutes");

class CompanyAdmin {
    constructor(){
        this.userRepository = new UserRepository();
        this.companyRepository = new CompanyRepository();
        this.userService = new UserService(this.userRepository);
        this.companyService = new CompanyService(this.companyRepository);
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

    CompanyRoles = async (req, res) => {
        try {
            const roles = await roleService.getCompanyRoles(req.user.id);
            const encodedRoles = roles.map(role => {
                const json = role;
                json.id = encodeId(json.id);
                json.companyId = encodeId(json.companyId);
                return json;
            });
            return res.status(200).json(encodedRoles);
        } catch (error) {
            console.log('error while getting company roles', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    AdminCompanies = async (req, res) => {
        try {
            const companies = await this.userService.getAdminCompanies(req.user.id);
            const encodedCompanies = companies.map(company => {
                const json = company;
                json.id = encodeId(json.id);

                if (json.Company) {
                    json.Company.id = encodeId(json.Company.id);
                }
                return json;
            });
            
            return res.status(200).json(encodedCompanies);
        } catch (error) {
            console.log('Error while getting admin companies', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };

    CompanyMenus = async (req, res) => {
        try {
            const menus = await this.userService.getCompanyMenus(req.user.id);
            const encodedMenues = menus.map(menu => {
                const json = menu;
                json.id = encodeId(json.id);
                json.companyId = encodeId(json.companyId);
                return json;
            });
            return res.status(200).json(encodedMenues);
        } catch (error) {
            console.log('Error while getting company menus', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };

}

module.exports = CompanyAdmin;

