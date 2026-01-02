module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('audit_logs', {
      id: { type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      action: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      entity_type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      old_values: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      new_values: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      ip_address: {
        type: Sequelize.INET,
        allowNull: true
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      correlation_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
},
updated_at: {
type: Sequelize.DATE,
allowNull: false,
defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
}
});
await queryInterface.addIndex('audit_logs', ['user_id', 'created_at']);
await queryInterface.addIndex('audit_logs', ['entity_type', 'entity_id']);
await queryInterface.addIndex('audit_logs', ['action']);
await queryInterface.addIndex('audit_logs', ['created_at']);
await queryInterface.addIndex('audit_logs', ['correlation_id']);
},
down: async (queryInterface, Sequelize) => {
await queryInterface.dropTable('audit_logs');
}
};