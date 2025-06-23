class BaseRepository {

    constructor(model){
        this.model = model
    }

    async findAll(){
        return await this.model.findAll();
    }

    async findById(id){
        return await this.model.findByPk(id);
    }

    async findByName(name){
        return await this.model.findOne({ where: { name }});
    }

    async create(data){
        return await this.model.create(data);
    }

    async update(id, data){
        const record = await this.model.findByPk(id);
        if(!record) return null;
        return await record.update(data);
    }

    async delete(id){
        const record = await this.model.findByPk(id);
        if(!record) return null;
        await record.destroy();
        return record;
    }

}

module.exports = BaseRepository;