import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BellIcon,MenuIcon } from '@heroicons/react/solid';
const Header = () => {
const { user, logout, isAuthenticated } = useAuth();
const navigate = useNavigate();
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const doctorNavItems = [
    { label: 'Dashboard', path: '/doctor' },
    { label: 'Current Shift', path: '/doctor/shift' },
    { label: 'History', path: '/doctor/history' },
    { label: 'QR Scan', path: '/doctor/scan' },
  ];
  const hrNavItems = [
    { label: 'Dashboard', path: '/hr' },
    { label: 'Shift Planner', path: '/hr/planner' },
    { label: 'Live Board', path: '/hr/live' },
    { label: 'Reports', path: '/hr/reports' },
    { label: 'Audit Log', path: '/hr/audit' },
  ];
  const adminNavItems = [
    { label: 'System Config', path: '/admin/system' },
    { label: 'User Management', path: '/admin/users' },
    { label: 'Departments', path: '/admin/departments' },
  ];
  const getNavItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'doctor':
        return doctorNavItems;
      case 'hr_admin':
        return hrNavItems;
      case 'super_admin':
        return [...hrNavItems, ...adminNavItems];
      default:
        return [];
    }
  };
  const navItems = getNavItems();
  if (!isAuthenticated) {
    return null;
  } return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justi
fy-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Hospital Shift</h1>
                <p className="text-xs text-gray-500">Doctor Planning System</p>
              </div>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hov
er:text-sky-600 hover:bg-gray-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2 text-gray-600 hover:text-sky-600"
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-ful
l"></span>
            </Link>
            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none"></button><div className="w-8 h-8 bg-sky-100 rounded-full flex items-center jus
tify-center">
<span className="text-sky-600 font-semibold">
{user?.full_name?.charAt(0) || 'U'}
</span>
</div>
<div className="hidden md:block text-left">
<p className="text-sm font-medium text-gray-900">
{user?.full_name}
</p>
<p className="text-xs text-gray-500 capitalize">
{user?.role?.replace('_', ' ')}
</p>
</div>
{/* Dropdown Menu */}
<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
<Link
to="/profile"
className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
>
Profile Settings
</Link>
<Link
to="/settings"
className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
>
Preferences
</Link>
<div className="border-t border-gray-100 my-1"></div>
<button
onClick={handleLogout}
className="block w-full text-left px-4 py-2 text-sm text-red-600 ho
ver:bg-gray-50"
>
Logout
</button>
</div>
</div>
{/* Mobile Menu Button */}
<button
className="md:hidden p-2"
onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
{mobileMenuOpen ? (
<XIcon className="h-6 w-6 text-gray-600" />
) : (
<MenuIcon className="h-6 w-6 text-gray-600" />
)}
</button>
</div>
</div>
{/* Mobile Navigation */}
{mobileMenuOpen && (
<div className="md:hidden border-t border-gray-200 py-4">
<nav className="flex flex-col space-y-1">
{navItems.map((item) => (
<Link
key={item.path}
to={item.path}
className="px-3 py-2 rounded-md text-base font-medium text-gray-700 
hover:text-sky-600 hover:bg-gray-50"
onClick={() => setMobileMenuOpen(false)}
>
{item.label}
</Link>
))}
</nav>
</div>
)}
</div>
</header>);
};
export default Header;