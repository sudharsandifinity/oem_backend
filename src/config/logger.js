const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
const path = require('path');

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
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
  ],
});

// In development, also log to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(colorize(), logFormat)
  }));
}

module.exports = logger;