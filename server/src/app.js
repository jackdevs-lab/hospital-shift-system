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
