const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');

const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`)
  ),
  transports: [
    new transports.File({ filename: path.join(logsDir, 'app.log'), maxsize: 1024 * 1024, maxFiles: 5 }),
    new transports.Console({ format: format.combine(format.colorize(), format.simple()) })
  ]
});

logger.success = (msg) => logger.info(`✅ ${msg}`);


module.exports = logger;
