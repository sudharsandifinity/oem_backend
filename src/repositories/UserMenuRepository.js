const BaseRepository = require("./baseRepository");
const { UserMenu, Form, FormTab, SubForm, FormField } = require('../models');

class UserMenuRepository extends BaseRepository {

    constructor(){
        super(UserMenu);
    }

    async findAll() {
        return await this.model.findAll({
            include: [Form],
        });
    }

    async findById(id) {
        return await this.model.findByPk(id, {
            include: [
            {
                model: Form,
                include: [
                    {
                        model: FormTab,
                        include: [{
                            model: SubForm,
                            include: [FormField]
                        }],
                    } 
                ],
            },
            ],
        });
    }

}

module.exports = UserMenuRepository;