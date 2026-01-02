import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
const { user, loading, isAuthenticated } = useAuth();
const location = useLocation();
if (loading) {
return (
<div className="flex items-center justify-center min-h-screen">
<div className="spinner"></div>
</div>
);
}
if (!isAuthenticated) {
// Redirect to login page with return url
return <Navigate to="/login" state={{ from: location }} replace />;
}
// Check if user has required role
if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {// Redirect based on role
switch (user.role) {
case 'doctor':
return <Navigate to="/doctor" replace />;
case 'hr_admin':
case 'super_admin':
return <Navigate to="/hr" replace />;
default:
return <Navigate to="/login" replace />;
}
}
return children;
};
export default ProtectedRoute;