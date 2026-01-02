const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');
const { jwt: jwtConfig } = require('../config/constants');
const authenticate = async (req, res, next) => {
try {
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {
return res.status(401).json({
error: 'Authentication required',
message: 'No authorization token provided'
});
}
const token = authHeader.split(' ')[1];
let decoded;
try {
decoded = jwt.verify(token, jwtConfig.secret);
} catch (err) {
return res.status(401).json({
error: 'Invalid token',
message: 'Token is invalid or expired'
});
}
const user = await User.findActiveById(decoded.userId);
if (!user) {
return res.status(401).json({
error: 'User not found',
message: 'User account may be inactive or deleted'
});
}
// Attach user to request
req.user = user;
req.userId = user.id;
req.userRole = user.role;
next();} catch (error) {
logger.error('Authentication error:', error);
res.status(500).json({
error: 'Authentication failed',
message: 'Internal server error during authentication'
});
}
};
const requireRole = (...allowedRoles) => {
return (req, res, next) => {
if (!req.user) {
return res.status(401).json({
error: 'Authentication required',
message: 'User not authenticated'
});
}
if (!allowedRoles.includes(req.user.role)) {
logger.warn(`Unauthorized access attempt by user ${req.user.id} with role ${req.user.role}`);
return res.status(403).json({
error: 'Access forbidden',
message: 'You do not have permission to access this resource'
});
}
next();
};
};
// Role-specific middleware
const requireDoctor = requireRole('doctor');
const requireHRAdmin = requireRole('hr_admin');
const requireSuperAdmin = requireRole('super_admin');
const requireAdmin = requireRole('hr_admin', 'super_admin');
module.exports = {
authenticate,
requireRole,
requireDoctor,
requireHRAdmin,
requireSuperAdmin,
requireAdmin
};