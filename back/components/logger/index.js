const winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

module.exports = winston.createLogger({
  format: combine(
    label({ label: '!' }),
    timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
