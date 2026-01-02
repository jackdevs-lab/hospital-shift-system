import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';
const AuthContext = createContext(null);
export const useAuth = () => {
const context = useContext(AuthContext);
if (!context) {
throw new Error('useAuth must be used within an AuthProvider');
}
return context;
};
export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [token, setToken] = useState(localStorage.getItem('token'));
const navigate = useNavigate();
useEffect(() => {
// Check if user is logged in on mount
const checkAuth = async () => {const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        try {
          // Validate token by fetching profile
          const profile = await authService.getProfile();
          setUser(profile);
          setToken(storedToken);
        } catch (error) {
          // Token is invalid, clear storage
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      const { user: userData, tokens } = response;
      
      // Store tokens and user info
      localStorage.setItem('token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setToken(tokens.access_token);
      
      toast.success('Login successful!');
      
      // Redirect based on role
      switch (userData.role) {
        case 'doctor':
          navigate('/doctor');
          break;
        case 'hr_admin':
        case 'super_admin':
          navigate('/hr');
          break;
        default:
          navigate('/'); }
      
      return true;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return false;
    }
  };
  const logout = () => {
    try {
      authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all storage
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      setUser(null);
      setToken(null);
      
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };
  const updateProfile = async (data) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
      return updatedUser;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        logout();
        return null;}
const response = await authService.refreshToken(refreshToken);
const newToken = response.access_token;
localStorage.setItem('token', newToken);
setToken(newToken);
return newToken;
} catch (error) {
logout();
return null;
}
};
const value = {
user,
token,
loading,
login,
logout,
updateProfile,
refreshToken,
isAuthenticated: !!user && !!token,
isDoctor: user?.role === 'doctor',
isHRAdmin: user?.role === 'hr_admin',
isSuperAdmin: user?.role === 'super_admin',
isAdmin: user?.role === 'hr_admin' || user?.role === 'super_admin'
};
return (
<AuthContext.Provider value={value}>
{children}
</AuthContext.Provider>
);
};
export default AuthContext;