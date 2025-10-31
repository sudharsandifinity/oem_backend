const BaseRepository = require("./baseRepository");
const { FormData } = require('../models');


class FormDataRepository extends BaseRepository{

    constructor(){
        super(FormData);
    }

}

module.exports = FormDataRepository;