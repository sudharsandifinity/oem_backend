const logger = require('../config/logger');

const loggerMiddleware = (req, res, next) => {
  const { method, url } = req;
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${method} ${url} ${res.statusCode} - ${duration}ms`);
  });

  next();
};

module.exports = loggerMiddleware;