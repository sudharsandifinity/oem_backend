const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
const path = require('path');

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

const sapFilter = format((info) => {
  return info.service === 'SAP' ? info : false;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.File({ filename: path.join('logs', 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join('logs', 'combined.log') }),
    new transports.File({
      filename: path.join('logs', 'sap.log'),
      format: combine(sapFilter(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat)
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(colorize(), logFormat)
    })
  );
}

const sapLogger = logger.child({ service: 'SAP' });

module.exports = { logger, sapLogger };
