module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      full_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('doctor', 'hr_admin', 'super_admin'),
        allowNull: false,
        defaultValue: 'doctor'
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      last_login_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      employee_id: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true
      },
      profile_image_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      push_notification_token: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      email_notifications_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      push_notifications_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Safely add unique index on email
    try {
      await queryInterface.addIndex('users', ['email'], {
        unique: true,
        name: 'users_email'
      });
    } catch (err) {
      if (!err.message.includes('already exists')) {
        throw err;
      }
      // Ignore if index already exists
    }

    // Safely add unique index on employee_id
    try {
      await queryInterface.addIndex('users', ['employee_id'], {
        unique: true,
        name: 'users_employee_id'
      });
    } catch (err) {
      if (!err.message.includes('already exists')) {
        throw err;
      }
    }

    // Safely add regular index on is_active
    try {
      await queryInterface.addIndex('users', ['is_active'], {
        name: 'users_is_active'
      });
    } catch (err) {
      if (!err.message.includes('already exists')) {
        throw err;
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};