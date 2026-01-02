const jwt = require('jsonwebtoken');
const { User, AuditLog } = require('../../models');
const logger = require('../../utils/logger');
const { jwt: jwtConfig } = require('../../config/constants');
const AuditService = require('../../services/audit/AuditService');
const authController = {
login: async (req, res) => {
try {
const { email, password } = req.body;
// Find user
const user = await User.findByEmail(email);
if (!user) {
logger.warn(`Failed login attempt for non-existent email: ${email}`);
return res.status(401).json({
error: 'Authentication failed',
message: 'Invalid email or password'
});
}
if (!user.is_active) {
logger.warn(`Login attempt for inactive user: ${email}`);
return res.status(401).json({
error: 'Account inactive',
message: 'Your account has been deactivated. Please contact HR.'
});
}
// Verify password
const isValidPassword = await user.verifyPassword(password);
if (!isValidPassword) {
logger.warn(`Failed login attempt for user: ${email}`);
await AuditService.logAction(user.id, 'auth.login_failed', 'user', user.id, {
reason: 'Invalid password',
ip: req.ip
});
return res.status(401).json({
error: 'Authentication failed',
message: 'Invalid email or password'
});
}
// Update last login
user.last_login_at = new Date();
await user.save(); // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiry }
      );
      const refreshToken = jwt.sign(
        { userId: user.id },
        jwtConfig.refreshSecret,
        { expiresIn: jwtConfig.refreshExpiry }
      );
      // Log successful login
      await AuditService.logAction(user.id, 'auth.login_success', 'user', user.id, {
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });
      logger.info(`User logged in: ${email} (${user.role})`);
      res.json({
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          department_id: user.department_id
        },
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: 24 * 60 * 60 // 24 hours in seconds
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        error: 'Login failed',
        message: 'An error occurred during login'
      });
    }
  },
  logout: async (req, res) => {
    try { const user = req.user;
      
      await AuditService.logAction(user.id, 'auth.logout', 'user', user.id, {
        ip: req.ip
      });
      logger.info(`User logged out: ${user.email}`);
      res.json({
        message: 'Logged out successfully'
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        error: 'Logout failed',
        message: 'An error occurred during logout'
      });
    }
  },
  refreshToken: async (req, res) => {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) {
        return res.status(400).json({
          error: 'Invalid request',
          message: 'Refresh token is required'
        });
      }
      let decoded;
      try {
        decoded = jwt.verify(refresh_token, jwtConfig.refreshSecret);
      } catch (err) {
        return res.status(401).json({
          error: 'Invalid refresh token',
          message: 'Refresh token is invalid or expired'
        });
      }
      const user = await User.findActiveById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          error: 'User not found',
          message: 'User account may be inactive or deleted' });
      }
      // Generate new access token
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiry }
      );
      await AuditService.logAction(user.id, 'auth.token_refresh', 'user', user.id, {
        ip: req.ip
      });
      res.json({
        access_token: accessToken,
        expires_in: 24 * 60 * 60
      });
    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(500).json({
        error: 'Token refresh failed',
        message: 'An error occurred while refreshing token'
      });
    }
  },
  getProfile: async (req, res) => {
    try {
      const user = req.user;
      
      // Get user with department info
      const userWithDept = await User.findByPk(user.id, {
        include: [{
          association: 'department',
          attributes: ['id', 'name', 'code']
        }]
      });
      res.json({
        user: userWithDept
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        error: 'Failed to get profile',
        message: 'An error occurred while fetching profile' });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const user = req.user;
      const updates = req.body;
      // Fields that can be updated
      const allowedUpdates = ['full_name', 'phone_number', 'profile_image_url'];
      const filteredUpdates = {};
      
      allowedUpdates.forEach(field => {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      });
      if (Object.keys(filteredUpdates).length === 0) {
        return res.status(400).json({
          error: 'No valid updates',
          message: 'No valid fields to update'
        });
      }
      await user.update(filteredUpdates);
      await AuditService.logAction(user.id, 'auth.profile_update', 'user', user.id, {
        updates: filteredUpdates
      });
      logger.info(`Profile updated for user: ${user.email}`);
      res.json({
        message: 'Profile updated successfully',
        user: user
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        error: 'Profile update failed',
        message: 'An error occurred while updating profile'
      });
    }
  }
};module.exports = authController;