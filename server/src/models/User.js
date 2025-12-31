const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const User = sequelize.define('User', {
id: {
type: DataTypes.INTEGER,
primaryKey: true,
autoIncrement: true
},
email: { type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('doctor', 'hr_admin', 'super_admin'),
    allowNull: false,
    defaultValue: 'doctor'
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'departments',
      key: 'id'
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  employee_id: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  profile_image_url: {
    type: DataTypes.STRING(500),
    allowNull: true
},
push_notification_token: {
type: DataTypes.STRING(500),
allowNull: true
},
email_notifications_enabled: {
type: DataTypes.BOOLEAN,
defaultValue: true
},
push_notifications_enabled: {
type: DataTypes.BOOLEAN,
defaultValue: true
}
}, {
tableName: 'users',
timestamps: true,
createdAt: 'created_at',
updatedAt: 'updated_at',
hooks: {
beforeCreate: async (user) => {
if (user.password_hash) {
const salt = await bcrypt.genSalt(10);
user.password_hash = await bcrypt.hash(user.password_hash, salt);
}
},
beforeUpdate: async (user) => {
if (user.changed('password_hash')) {
const salt = await bcrypt.genSalt(10);
user.password_hash = await bcrypt.hash(user.password_hash, salt);
}
}
}
});
// Instance methods
User.prototype.verifyPassword = async function(password) {
return await bcrypt.compare(password, this.password_hash);
};
User.prototype.toJSON = function() {
const values = Object.assign({}, this.get());
delete values.password_hash;
delete values.push_notification_token;
return values;
};
User.findByEmail = function(email) {
return this.findOne({ where: { email } });
};
User.findActiveById = function(id) {
return this.findOne({ where: { id, is_active: true } });
};
module.exports = User;