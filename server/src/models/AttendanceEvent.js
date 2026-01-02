const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const AttendanceEvent = sequelize.define('AttendanceEvent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  shift_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'shifts',
      key: 'id'
    }
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  event_type: {
    type: DataTypes.ENUM('check_in', 'check_out', 'override'),
    allowNull: false
  },
  event_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  method: {
    type: DataTypes.ENUM('qr', 'manual_override'),
    allowNull: false
  },qr_code_id: {
type: DataTypes.INTEGER,
allowNull: true,
references: {
model: 'qr_codes',
key: 'id'
}
},
override_reason: {
type: DataTypes.TEXT,
allowNull: true
},
override_by: {
type: DataTypes.INTEGER,
allowNull: true,
references: {
model: 'users',
key: 'id'
}
},
lateness_minutes: {
type: DataTypes.INTEGER,
defaultValue: 0
},
early_exit_minutes: {
type: DataTypes.INTEGER,
defaultValue: 0
},
device_info: {
type: DataTypes.JSONB,
allowNull: true
},
location_data: {
type: DataTypes.JSONB,
allowNull: true
}
}, {
tableName: 'attendance_events',
timestamps: true,
createdAt: 'created_at',
updatedAt: 'updated_at',
indexes: [
{
fields: ['shift_id', 'doctor_id']
},
{
fields: ['event_time']
 },
    {
      fields: ['doctor_id', 'event_time']
    }
  ]
});
module.exports = AttendanceEvent;