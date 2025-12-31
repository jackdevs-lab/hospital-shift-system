CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";-- Create hospital_shifts database (if not exists in docker-compose)-- This will be executed on first run
DO $$ 
BEGIN
IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'hospital_shifts') THEN
CREATE DATABASE hospital_shifts;
END IF;
END $$;