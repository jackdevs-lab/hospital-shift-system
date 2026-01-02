module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('shifts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      start_time: {type: Sequelize.TIME,
        allowNull: false
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      shift_type: {
        type: Sequelize.ENUM('day', 'night'),
        allowNull: false,
        defaultValue: 'day'
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('planned', 'active', 'completed', 'missed', 'exception'),
        defaultValue: 'planned',
        allowNull: false
      },
      actual_start_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      actual_end_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      late_minutes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      early_exit_minutes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_by: { type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
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
    await queryInterface.addIndex('shifts', ['date', 'status']);
    //await queryInterface.addIndex('shifts', ['department_id', 'date']);
    await queryInterface.addIndex('shifts', ['status']);
    await queryInterface.addIndex('shifts', ['created_by']);
    await queryInterface.addIndex('shifts', ['updated_by']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('shifts');
  }
};