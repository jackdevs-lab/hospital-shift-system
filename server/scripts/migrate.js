const { sequelize } = require('../src/models');
const logger = require('../src/utils/logger');
const migrate = async () => {
try {
logger.info('Starting database migrations...');
// Import migrations
const migrations = [
require('../database/migrations/001_create_users'),
require('../database/migrations/002_create_shifts'),
require('../database/migrations/003_create_audit_logs'),
// Add more migrations as needed
];
// Run migrations in order
for (const migration of migrations) {
logger.info(`Running migration: ${migration.up.name || 'unknown'}`);
await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
}logger.info('Database migrations completed successfully');
process.exit(0);
} catch (error) {
logger.error('Migration failed:', error);
process.exit(1);
}
};
migrate();