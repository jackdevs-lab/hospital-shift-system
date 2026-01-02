const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const crypto = require('crypto');
const QRCode = sequelize.define('QRCode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'departments',
      key: 'id'
    }
  },
  code: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  secret_hash: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_used: {
    type: DataTypes.DATE,
    allowNull: true
  },
  usage_count: {type: DataTypes.INTEGER,
    defaultValue: 0
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'qr_codes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: (qrCode) => {
      // Generate a secure code
      if (!qrCode.code) {
        qrCode.code = `QR-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
      }
      
      // Generate secret hash
      const secret = process.env.QR_CODE_SECRET || 'default_secret';
      qrCode.secret_hash = crypto
        .createHmac('sha256', secret)
        .update(qrCode.code)
        .digest('hex');
      
      // Set expiry (default 90 days)
      if (!qrCode.expires_at) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 90);
        qrCode.expires_at = expiryDate;
      }
    }
  },
  indexes: [
  {
    fields: ['department_id', 'is_active']
  },
  {
    unique: true,
    fields: ['code']
  },
  {
    fields: ['expires_at']
  }
]
});
fields: ['expires_at']
// Instance method to verify QR code
QRCode.prototype.verify = function(inputCode) {
const secret = process.env.QR_CODE_SECRET || 'default_secret';
const inputHash = crypto
.createHmac('sha256', secret)
.update(inputCode)
.digest('hex');
return this.secret_hash === inputHash && this.is_active && new Date() < this.expire
s_at;
};
// Static method to generate QR code
QRCode.generate = async function(departmentId, createdById, options = {}) {
const code = `QR-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
return await this.create({
department_id: departmentId,
code,
created_by: createdById,
expires_at: options.expiresAt || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
});
};
module.exports = QRCode;