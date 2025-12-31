set -e
BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
echo "
💾
 Starting database backup..."
# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR
# Backup PostgreSQL
echo "
📦
 Backing up PostgreSQL database..."
docker-compose exec -T postgres pg_dump -U postgres hospital_shifts > $BACKUP_DIR/db_
$TIMESTAMP.sql
# Backup Redis if needed
echo "
🔴
 Backing up Redis data..."
docker-compose exec -T redis redis-cli save
docker cp hospital-shift-redis:/data/dump.rdb $BACKUP_DIR/redis_$TIMESTAMP.rdb
# Backup uploads and important files
echo "
📁
 Backing up important files..."
tar -czf $BACKUP_FILE \
$BACKUP_DIR/db_$TIMESTAMP.sql \
$BACKUP_DIR/redis_$TIMESTAMP.rdb \
server/.env \
server/src/config/ \
2>/dev/null || true
# Clean up temporary files
rm $BACKUP_DIR/db_$TIMESTAMP.sql
rm $BACKUP_DIR/redis_$TIMESTAMP.rdb
echo "
✅
 Backup completed: $BACKUP_FILE"
# Keep only last 7 backups
echo "
🧹
 Cleaning up old backups (keeping last 7)..."
ls -t $BACKUP_DIR/backup_*.tar.gz | tail -n +8 | xargs rm -f
echo "
🎉
 Backup process completed!"