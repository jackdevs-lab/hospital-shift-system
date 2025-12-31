set -e
echo "
🚀
 Starting Hospital Shift System Deployment"
echo "=========================================="
# Load environment variables
if [ -f .env ]; then
export $(cat .env | grep -v '^#' | xargs)
fi
# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
echo "
❌
 Docker is not running. Please start Docker and try again."
exit 1
fi
# Build production images
echo "
📦
 Building production images..."
docker-compose -f docker-compose.prod.yml build
# Stop existing containers
echo "
🛑
 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true
# Start new containers
echo "
🚀
 Starting new containers..."
docker-compose -f docker-compose.prod.yml up -d
# Run database migrations
echo "
🗄
 Running database migrations..."
docker-compose -f docker-compose.prod.yml exec server npm run db:migrate
# Seed database if needed
if [ "$SEED_DATABASE" = "true" ]; then
echo "
🌱
 Seeding database..."
docker-compose -f docker-compose.prod.yml exec server npm run db:seed
fi
# Health check
echo "
🏥
 Performing health check..."
sleep 10  # Wait for services to start
if curl -f http://localhost/health > /dev/null 2>&1; then
echo "
✅
 Deployment successful! System is healthy."
echo "
🌐
 Access the application at: http://localhost"
else
fi
echo "
❌
 Health check failed. Checking logs..."
docker-compose -f docker-compose.prod.yml logs --tail=50
exit 1
echo "
🎉
 Deployment completed successfully!"