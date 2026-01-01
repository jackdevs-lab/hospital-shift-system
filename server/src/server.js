const app = require('./app');
const http = require('http');
const WebSocketManager = require('./lib/websocket/WebSocketManager');
const { connectDB } = require('./config/database');
const { connectRedis } = require('./lib/redis');
const logger = require('./utils/logger');
const config = require('./config');
// Load environment variables
require('dotenv').config();
// Create HTTP server
const server = http.createServer(app);
// Initialize WebSocket
const wss = new WebSocketManager(server);
// Graceful shutdown handler
const gracefulShutdown = async () => {
logger.info('Received shutdown signal, starting graceful shutdown...');
try {
// Close WebSocket connections
await wss.close();
// Close HTTP server
server.close(() => {
logger.info('HTTP server closed');
});
// Close database connections
await require('./config/database').sequelize.close();
logger.info('Database connections closed');
// Close Redis connection
const redisClient = require('./lib/redis').getClient();
if (redisClient) {
await redisClient.quit();
logger.info('Redis connection closed');
}
logger.info('Graceful shutdown completed');
process.exit(0);
} catch (error) {
logger.error('Error during graceful shutdown:', error);
process.exit(1);
}
};
// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
// Uncaught exception handler
process.on('uncaughtException', (error) => {
logger.error('Uncaught Exception:', error);
process.exit(1);
});
// Start server
const startServer = async () => {
try {
// Connect to database
await connectDB();
logger.info('Database connected successfully');
// Connect to Redis
await connectRedis();
logger.info('Redis connected successfully');
// Start server
server.listen(config.port, () => {
    logger.info(`Server running in ${config.env} mode on port ${config.port}`);
logger.info(`API Base URL: ${config.apiBaseUrl}`);
});
} catch (error) {
logger.error('Failed to start server:', error);
process.exit(1);
}
};
// Start the application
startServer();
module.exports = server;