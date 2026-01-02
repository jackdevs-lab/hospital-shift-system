const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Notification = sequelize.define('Notification', {
id: {
type: DataTypes.INTEGER,
primaryKey: true,
autoIncrement: true
},
user_id: {
type: DataTypes.INTEGER,
allowNull: false,
references: {
model: 'users',
key: 'id'
}
},
type: {
type: DataTypes.ENUM(
'shift_reminder',
'checkin_reminder',
'missed_shift',
'checkout_reminder',
'shift_completed',
'shift_assigned',
'shift_updated',
'system_alert'
),
allowNull: false
},
title: {
type: DataTypes.STRING(255),
allowNull: false },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sent_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  delivery_method: {
    type: DataTypes.ENUM('push', 'email', 'both'),
    defaultValue: 'push'
  },
  email_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  push_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
indexes: [
  {
    fields: ['user_id', 'is_read']
  },
  {
    fields: ['type', 'sent_at']
  },
  {
    fields: ['sent_at']
  }
],
hooks: {
beforeCreate: (notification) => {
if (!notification.title) {
notification.title = this.getDefaultTitle(notification.type);
}
}
}
});
// Static methods
Notification.getDefaultTitle = function(type) {
const titles = {
shift_reminder: 'Upcoming Shift Reminder',
checkin_reminder: 'Check-in Reminder',
missed_shift: 'Missed Shift Alert',
checkout_reminder: 'Check-out Reminder',
shift_completed: 'Shift Completed',
shift_assigned: 'New Shift Assigned',
shift_updated: 'Shift Updated',
system_alert: 'System Notification'
};
return titles[type] || 'Notification';
};
module.exports = Notification;