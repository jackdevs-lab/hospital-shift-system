const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const AuditLog = sequelize.define('AuditLog', {
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
  action: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  entity_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  old_values: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  new_values: {type: DataTypes.JSONB,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.INET,
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  correlation_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  }
}, {
  tableName: 'audit_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id', 'created_at']
    },
    {
      fields: ['entity_type', 'entity_id']
    },
    {
      fields: ['action']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['correlation_id']
    }
  ],
  hooks: {
    beforeCreate: (auditLog) => {
      // Ensure audit logs cannot be modified
      auditLog.created_at = new Date();
      auditLog.updated_at = new Date();
    },
    beforeUpdate: () => {
      throw new Error('Audit logs are immutable and cannot be updated');
    },
    beforeDestroy: () => { throw new Error('Audit logs are immutable and cannot be deleted');
    }
  }
});
module.exports = AuditLog;