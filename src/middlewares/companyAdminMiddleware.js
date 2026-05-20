const { logger } = require('../config/logger');

const companyAdminMiddleware = async (req, res, next) => {

    try {
        const user = req.user;

        if (!user) {
            logger.warn('Unauthorized access attempt');

            return res.status(401).json({
                error: 'Unauthorized'
            });
        }

        if (user.isComAdmin !== true && user.isComAdmin !== 1) {

            logger.warn('Company admin access denied', {
                userId: user.id,
                route: req.originalUrl,
                method: req.method
            });

            return res.status(403).json({
                error: 'Forbidden: Company admin access required'
            });
        }

        next();

    } catch (error) {

        logger.error('Company admin middleware error', {
            error: error.message,
            stack: error.stack,
            userId: req.user?.id,
            route: req.originalUrl,
            method: req.method
        });

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};

module.exports = companyAdminMiddleware;