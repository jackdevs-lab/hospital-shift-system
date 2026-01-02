const winston = require('winston');
const { env } = require('../config/constants');
const logLevels = {
error: 0,
warn: 1,
info: 2,
http: 3,
debug: 4
};
const logColors = {
error: 'red',
warn: 'yellow',
info: 'green',
http: 'magenta',
debug: 'white'
};
winston.addColors(logColors);
const format = winston.format.combine(
winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),winston.format.errors({ stack: true }),
winston.format.json()
);
const transports = [
new winston.transports.File({
filename: 'logs/error.log',
level: 'error',
maxsize: 5242880, // 5MB
maxFiles: 5
}),
new winston.transports.File({
filename: 'logs/combined.log',
maxsize: 5242880, // 5MB
maxFiles: 5
})
];
if (env !== 'production') {
transports.push(
new winston.transports.Console({
format: winston.format.combine(
winston.format.colorize({ all: true }),
winston.format.printf(
(info) => `${info.timestamp} ${info.level}: ${info.message}`
)
)
})
);
}
const logger = winston.createLogger({
level: env === 'development' ? 'debug' : 'info',
levels: logLevels,
format,
transports,
exitOnError: false
});
// Create a stream object for Morgan
logger.stream = {
write: (message) => logger.http(message.trim())
};
module.exports = logger;