const express = require('express');
const router = express.Router();
// Import route modules
const authRoutes = require('./auth/auth.routes');
const shiftRoutes = require('./shifts/shift.routes');
const attendanceRoutes = require('./attendance/attendance.routes');
const userRoutes = require('./users/user.routes');
const departmentRoutes = require('./departments/department.routes');
const reportRoutes = require('./reports/report.routes');
const auditRoutes = require('./audit/audit.routes');
const qrRoutes = require('./qr/qr.routes');
const notificationRoutes = require('./notifications/notification.routes');
// Health check
router.get('/health', (req, res) => {
res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
// API routes
router.use('/auth', authRoutes);
router.use('/shifts', shiftRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/users', userRoutes);
router.use('/departments', departmentRoutes);
router.use('/reports', reportRoutes);
router.use('/audit', auditRoutes);
router.use('/qr', qrRoutes);
router.use('/notifications', notificationRoutes);
module.exports = router;