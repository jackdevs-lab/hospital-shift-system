.PHONY: help start stop build test clean db-migrate db-seed logs shell

help:
	@echo "Hospital Shift System - Management Commands"
	@echo ""
	@echo "Development:"
	@echo "  make start          Start development environment"
	@echo "  make stop           Stop all containers"
	@echo "  make restart        Restart all containers"
	@echo "  make logs           View container logs"
	@echo "  make shell          Open shell in server container"
	@echo ""
	@echo "Database:"
	@echo "  make db-migrate     Run database migrations"
	@echo "  make db-seed        Seed database with sample data"
	@echo "  make db-backup      Create database backup"
	@echo "  make db-restore     Restore database from backup"
	@echo ""
	@echo "Testing:"
	@echo "  make test           Run all tests"
	@echo "  make test-unit      Run unit tests"
	@echo "  make test-integration Run integration tests"
	@echo "  make test-e2e       Run E2E tests"
	@echo ""
	@echo "Production:"
	@echo "  make build          Build production images"
	@echo "  make deploy         Deploy to production"
	@echo "  make clean          Clean up containers and volumes"
	@echo ""

start:
	docker-compose up -d

stop:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

shell:
	docker-compose exec server sh

db-migrate:
	docker-compose exec server npm run db:migrate

db-seed:
	docker-compose exec server npm run db:seed

db-backup:
	docker-compose exec postgres pg_dump -U postgres hospital_shifts > backup/$(shell date +%Y%m%d_%H%M%S).sql

db-restore:
	@read -p "Enter backup file: " file; \
	docker-compose exec -T postgres psql -U postgres hospital_shifts < backup/$$file

test:
	docker-compose exec server npm test

test-unit:
	docker-compose exec server npm run test:unit

test-integration:
	docker-compose exec server npm run test:integration

test-e2e:
	docker-compose exec server npm run test:e2e

build:
	docker-compose -f docker-compose.prod.yml build

deploy:
	@echo "Deploying to production..."
	# Add your deployment script here

clean:
	docker-compose down -v
	docker system prune -f

# Code quality
lint:
	docker-compose exec client npm run lint
	docker-compose exec server npm run lint

format:
	docker-compose exec client npm run format
	docker-compose exec server npm run format