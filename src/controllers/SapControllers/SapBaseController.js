const { sapLogger } = require('../../config/logger');
const SAPService = require('../../services/SAPService');

class SapBaseController {

    constructor(){
        this.sapService = new SAPService();
    }

    errorCatch (req, res, message, error) {
        const errorData = error.response?.data || error.message;
            console.error('SAP error:', errorData);
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
    }

module.exports = SapBaseController;