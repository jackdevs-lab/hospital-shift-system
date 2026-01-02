module.exports = {
// Application
env: process.env.NODE_ENV || 'development',
port: parseInt(process.env.PORT) || 3000,
apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
// Database
db: {
host: process.env.DB_HOST || 'localhost',
port: parseInt(process.env.DB_PORT) || 5432,
name: process.env.DB_NAME || 'hospital_shifts',
user: process.env.DB_USER || 'postgres', password: process.env.DB_PASSWORD || 'postgres'
  },
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
    expiry: process.env.JWT_EXPIRY || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d'
  },
  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || null
  },
  // Email
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@hospitalshift.com',
    fromName: process.env.EMAIL_FROM_NAME || 'Hospital Shift System'
  },
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',') 
      : ['http://localhost:5173', 'http://localhost:3000']
  },
  // QR Codes
  qrCode: {
    secret: process.env.QR_CODE_SECRET || 'qr_system_secret_key',
    expiryDays: parseInt(process.env.QR_CODE_EXPIRY_DAYS) || 90
  },// Shift settings
shift: {
gracePeriodMinutes: 15,
missedThresholdMinutes: 60,
earlyCheckoutWindowMinutes: 30
},
// Logging
morgan: {
format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
},
// Audit
audit: {
retentionDays: parseInt(process.env.AUDIT_LOG_RETENTION_DAYS) || 365 * 7 // 7 years
}
};