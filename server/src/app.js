const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { auditMiddleware } = require('./middleware/audit');
const app = express();
// Security middleware
app.use(helmet({
contentSecurityPolicy: {
directives: {
defaultSrc: ["'self'"],
styleSrc: ["'self'", "'unsafe-inline'"],
scriptSrc: ["'self'"],
imgSrc: ["'self'", "data:", "https:"],
connectSrc: ["'self'", "ws:", "wss:"]
}
}
}));
// CORS configuration
app.use(cors({
origin: config.cors.origin,
credentials: true,
methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
// Rate limiting
const limiter = rateLimit({
windowMs: config.rateLimit.windowMs,
max: config.rateLimit.max,
message: 'Too many requests from this IP, please try again later.',
standardHeaders: true,
legacyHeaders: false
});
app.use('/api/', limiter);
// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Compression
app.use(compression());
// Logging
if (process.env.NODE_ENV !== 'test') {
app.use(morgan(config.morgan.format));
}
// Audit logging for all requests
app.use(auditMiddleware);
// Health check endpoint
app.get('/health', (req, res) => {
res.status(200).json({
status: 'healthy',
timestamp: new Date().toISOString(),
uptime: process.uptime(),
environment: process.env.NODE_ENV
});
});
// API routes
app.use('/api', routes);
// 404 handler
app.use('*', (req, res) => {
res.status(404).json({
error: 'Not Found',
message: `Route ${req.originalUrl} not found`
});
});
// Global error handler
app.use(errorHandler);
module.exports = app;
server/src/server.js
javascript
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