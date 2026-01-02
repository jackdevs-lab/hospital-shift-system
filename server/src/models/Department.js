const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Department = sequelize.define('Department', {
id: {
type: DataTypes.INTEGER,
primaryKey: true,
autoIncrement: true },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  hospital_id: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'For multi-hospital expansion'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  contact_person: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  contact_email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  contact_phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'departments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['hospital_id', 'is_active']
    },
    {
      fields: ['code'],
      unique: true
    }
  ]
});
module.exports = Department;