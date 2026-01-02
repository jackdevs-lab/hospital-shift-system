const { sequelize } = require('../config/database');
const User = require('./User');
const Shift = require('./Shift');
const Assignment = require('./Assignment');
const AttendanceEvent = require('./AttendanceEvent');
const AuditLog = require('./AuditLog');
const QRCode = require('./QRCode');
const Department = require('./Department');
const Notification = require('./Notification');
// Define relationships
// User - Shift (through Assignment)
User.hasMany(Assignment, { foreignKey: 'doctor_id', as: 'assignments' });
Assignment.belongsTo(User, { foreignKey: 'doctor_id', as: 'doctor' });
User.hasMany(Shift, { foreignKey: 'created_by', as: 'created_shifts' });
User.hasMany(Shift, { foreignKey: 'updated_by', as: 'updated_shifts' });
// Shift - Assignment
Shift.hasMany(Assignment, { foreignKey: 'shift_id', as: 'assignments' });
Assignment.belongsTo(Shift, { foreignKey: 'shift_id', as: 'shift' });
// Shift - AttendanceEvent
Shift.hasMany(AttendanceEvent, { foreignKey: 'shift_id', as: 'attendance_events' });
AttendanceEvent.belongsTo(Shift, { foreignKey: 'shift_id', as: 'shift' });
// User - AttendanceEvent
User.hasMany(AttendanceEvent, { foreignKey: 'doctor_id', as: 'attendance_history' });
AttendanceEvent.belongsTo(User, { foreignKey: 'doctor_id', as: 'doctor' });
// Department relationships
Department.hasMany(User, { foreignKey: 'department_id', as: 'doctors' });
User.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Department.hasMany(Shift, { foreignKey: 'department_id', as: 'shifts' });
Shift.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Department.hasMany(QRCode, { foreignKey: 'department_id', as: 'qr_codes' });
QRCode.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
// User - AuditLog
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'audit_logs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
// User - Notification
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
// Shift with assignments (eager loading)
Shift.addScope('withAssignment', {
include: [{
model: Assignment,
as: 'assignments',
include: [{
model: User,
as: 'doctor',
attributes: ['id', 'full_name', 'email', 'employee_id']
}]
}, {
model: Department,
as: 'department',
attributes: ['id', 'name']
}]
});
module.exports = {
sequelize,
User,
Shift,
Assignment,
AttendanceEvent,
AuditLog,
QRCode,
Department,
Notification
};