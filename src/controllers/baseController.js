const {logger} = require('../config/logger');
const { encodeId, decodeId } = require('../utils/hashids');

class BaseController {

    constructor(service, entityName="Item"){
        this.service = service;
        this.entityName = entityName;
    }

    getAll = async (req, res) => {

        try{
            const items = await this.service.getAll();
            return res.status(200).json(items);
        }catch(error){
            this.handleError(res, `getting ${this.entityName}s`, error);
        }
        
    }

    getById = async (req, res) => {
        try{
            const id = decodeId(req.params.id);
            const item = await this.service.getById(id);
            if(!item) res.status(404).json({message: `${this.entityName} not found!`});
            return res.status(200).json(item);
        }catch(error){
            this.handleError(res, `getting the ${this.entityName}`, error);
        }
    }

    create = async (req, res) => {
        try{
            const item = await this.service.create(req.body);
            return res.status(201).json(item);
        }catch(error){
            this.handleError(res, `creating the ${this.entityName}`, error);
        }
    }

    update = async (req, res) => {
        try{
            const id = decodeId(req.params.id);
            
            const item = await this.service.update(id, req.body); 
            if (!item) return res.status(404).json({message: `${this.entityName} not found!`});
            return res.json(item);
        }catch(error){
            this.handleError(res, `creating the ${this.entityName}`, error);
        }
    }

    delete = async (req, res) => {
        try{
            const {id} = req.params;
            const item = await this.service.delete(id);
            if (!item) return res.status(404).json({message: `${this.entityName} not found!`});
            return res.status(204).send();
        } catch(error){
            this.handleError(res, `creating the ${this.entityName}`, error);
        }
    }

    handleError(res, action, error) {
        console.error(`Error while ${action}:`, error);
        logger.error(
            `Error while ${action}`,
            error.stack,
            error.message
        );
        return res.status(500).json({
            message: `Error while ${action}`,
            error: error.message
        });
    }

}

module.exports = BaseController;