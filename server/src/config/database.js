const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');
const config = {
host: process.env.DB_HOST || 'localhost',
port: parseInt(process.env.DB_PORT) || 5432,
database: process.env.DB_NAME || 'hospital_shifts',
username: process.env.DB_USER || 'postgres',
password: process.env.DB_PASSWORD || 'postgres',
dialect: 'postgres',
logging: process.env.NODE_ENV === 'development' ? 
(msg) => logger.debug(msg) : false,
pool: {
max: 10,
min: 0,
acquire: 30000,
idle: 10000
},
define: {
timestamps: true,
underscored: true,
paranoid: false
}
};
const sequelize = new Sequelize(
config.database,
config.username,
config.password,
{
host: config.host,
port: config.port,
dialect: config.dialect,
logging: config.logging,
pool: config.pool,
define: config.define
}
);
const connectDB = async () => {
try {
await sequelize.authenticate();
logger.info('Database connection established successfully.');
// Sync models in development (not in production)
if (process.env.NODE_ENV === 'development') {
await sequelize.sync({ alter: true });
logger.info('Database synchronized.');
}
} catch (error) {
logger.error('Unable to connect to the database:', error);
throw error;
}
};
module.exports = {
sequelize,
connectDB,
config
};