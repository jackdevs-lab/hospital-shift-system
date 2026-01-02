const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Assignment = sequelize.define('Assignment', {
id: {
type: DataTypes.INTEGER,
primaryKey: true,
autoIncrement: true
},
shift_id: {type: DataTypes.INTEGER,
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
  assigned_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  reassigned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  previous_doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'assignments',
  timestamps: true,
  createdAt: 'assigned_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['shift_id', 'doctor_id']
    },
    {
      fields: ['doctor_id']
    },
    {
      fields: ['assigned_by']
    } ]
});
module.exports = Assignment;