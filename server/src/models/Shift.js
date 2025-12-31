const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Shift = sequelize.define('Shift', {
id: {
type: DataTypes.INTEGER,
primaryKey: true,
autoIncrement: true
},
date: {
type: DataTypes.DATEONLY,
allowNull: false
},
start_time: {
type: DataTypes.TIME,
allowNull: false
},
end_time: {
type: DataTypes.TIME,
allowNull: false
},
shift_type: {
type: DataTypes.ENUM('day', 'night'),
allowNull: false,
defaultValue: 'day'
},
department_id: {
type: DataTypes.INTEGER,
allowNull: false,
references: {
model: 'departments',
key: 'id'
 }
  },
  status: {
    type: DataTypes.ENUM('planned', 'active', 'completed', 'missed', 'exception'),
    defaultValue: 'planned',
    allowNull: false
  },
  actual_start_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actual_end_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  late_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  early_exit_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'shifts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
indexes: [
{
name: 'idx_shifts_date_status',
fields: ['date', 'status']
},
{
name: 'idx_shifts_department_date',
fields: ['department_id', 'date']
},
{
name: 'idx_shifts_status',
fields: ['status']
}
]
});

// Instance methods
Shift.prototype.getDuration = function() {
const start = new Date(`${this.date}T${this.start_time}`);
const end = new Date(`${this.date}T${this.end_time}`);
return (end - start) / (1000 * 60 * 60); // Hours
};
Shift.prototype.getActualDuration = function() {
if (!this.actual_start_time || !this.actual_end_time) {
return null;
}
return (this.actual_end_time - this.actual_start_time) / (1000 * 60 * 60);
};
Shift.prototype.isActive = function() {
return this.status === 'active';
};
Shift.prototype.isCompleted = function() {
return this.status === 'completed';
};
Shift.prototype.isMissed = function() {
return this.status === 'missed';
};
Shift.prototype.hasException = function() {
return this.status === 'exception';
};
module.exports = Shift;
