const { sapLogger } = require('../../config/logger');
const SAPService = require('../../services/SAPService');

class SapBaseController {

    constructor(service, module){
        this.service = service;
        this.module = module;
        this.sapService = new SAPService();
    }

    errorCatch (req, res, message, error) {
        const errorData = error.response?.data || error.message;
            console.error('SAP error:', errorData);
            // console.error('SAP error:', errorData.error);
            sapLogger.error('SAP request failed', {
                method: req.method,
                url: req.originalUrl,
                sapError: errorData,
            });
        return res.status(500).json({
            message: message,
            error: errorData
        });
    }

    getAll = async (req, res) => {
        try {

            const { skip = 0, top = 20 } = req.body || {};

            const query = {
                skip,
                top
            };

            const response = await this.service.getAll(
                req,
                this.module,
                query
            );

            return res.status(200).json(response);

        } catch (error) {

            return this.errorCatch(
                req,
                res,
                'Error while fetching records',
                error
            );
        }
    }

    getById = async (req, res) => {
        try {

            const { id } = req.params;

            const response = await this.service.getById(
                req,
                this.module,
                id
            );

            return res.status(200).json(response);

        } catch (error) {

            return this.errorCatch(
                req,
                res,
                'Error while fetching record',
                error
            );
        }
    }

    create = async (req, res) => {
        try {

            const response = await this.service.create(
                req,
                this.module,
                req.body
            );

            return res.status(201).json(response);

        } catch (error) {

            return this.errorCatch(
                req,
                res,
                'Error while creating record',
                error
            );
        }
    }

    patch = async (req, res) => {
        try {

            const { id } = req.params;

            const response = await this.service.patch(
                req,
                this.module,
                id,
                req.body
            );

            return res.status(200).json(response);

        } catch (error) {

            return this.errorCatch(
                req,
                res,
                'Error while updating record',
                error
            );
        }
    }

}

module.exports = SapBaseController;