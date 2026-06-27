const UserRepository = require("../repositories/userRepository");
const CompanyRepository = require("../repositories/CompanyRepository");
const ProjectRepository = require("../repositories/ProjectRepository");
const UserService = require('../services/userService');
const CompanyService = require('../services/CompanyService');
const ProjectService = require('../services/ProjectService');
const { encodeId, decodeId } = require("../utils/hashids");
const { roleService } = require("../routes/v1/admin/roleRoutes");

class CompanyAdmin {
    constructor(){
        this.userRepository = new UserRepository();
        this.companyRepository = new CompanyRepository();
        this.projectRepository = new ProjectRepository();
        this.userService = new UserService(this.userRepository);
        this.companyService = new CompanyService(this.companyRepository);
        this.projectService = new ProjectService(this.projectRepository);
    }

    CompanyUsers = async (req, res) => {
        try {

            const users = await this.userService.getCompanyUsers(req.user.id);

            const encoded = users.map((user) => {
                const plain = user.get ? user.get({ plain: true }) : user;

                return {
                    ...plain,
                    id: encodeId(plain.id),

                    Companies: plain.Companies?.map((company) => ({
                        ...company,
                        id: encodeId(company.id)
                    })),

                    Projects: plain.Projects?.map((project) => ({
                        ...project,

                        id: encodeId(project.id)
                    })),

                    Roles: plain.Roles?.map((role) => ({
                        ...role,
                        id: encodeId(role.id),
                        companyId: encodeId(role.companyId)
                    }))
                };
            });
            return res.status(200).json(encoded);

        } catch (error) {
            console.log('error while getting company users', error);
            return res.status(500).json({
                message: "Internal Server Error"
            });
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
            return res.status(200).json(menus);
        } catch (error) {
            console.log('Error while getting company menus', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };

    getByIdCAdmin = async (req, res) => {
        try{
            const userdata = await this.userService.getByIdCA(decodeId(req.params.id));
            return res.status(200).json(userdata);
        }catch(error){
            console.log('Error while getting company admin user', error);
            this.handleError(res, `getting ${this.entityName}s`, error);
        }
    }

    CompanyProjects = async (req, res) => {
        try {
            const companyIds = await this.userRepository.getUserCompanyIds(req.user.id);
            if (!companyIds.length) {
                return res.status(200).json([]);
            }

            const projects = await this.projectRepository.getByCompany(companyIds[0]);
            const encoded = projects.map((project) => {
                const plain = project.get ? project.get({ plain: true }) : project;
                return { ...plain, id: encodeId(plain.id) };
            });

            return res.status(200).json(encoded);
        } catch (error) {
            console.log('Error while getting company projects', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    SyncCompanyProjects = async (req, res) => {
        try {
            let companyId = req.body?.company_id ? decodeId(req.body.company_id) : null;
            if (!companyId) {
                const companyIds = await this.userRepository.getUserCompanyIds(req.user.id);
                companyId = companyIds[0];
            }

            if (!companyId) {
                return res.status(400).json({ message: "Company not found for this admin" });
            }

            const result = await this.projectService.syncCompanyProjects(req, companyId);

            return res.status(200).json(result);
        } catch (error) {
            console.log('Error while syncing company projects', error);
            return res.status(500).json({
                message: "Error while syncing company projects",
                error: error.response?.data || error.message
            });
        }
    }

}

module.exports = CompanyAdmin;

