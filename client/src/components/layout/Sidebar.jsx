import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  CalendarIcon,
  ClockIcon,
  QrcodeIcon,
  UsersIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CogIcon,
  LogoutIcon  // This is the modern logout icon
} from '@heroicons/react/outline';
const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const doctorNavItems = [
    { label: 'Dashboard', path: '/doctor', icon: HomeIcon },
    { label: 'Current Shift', path: '/doctor/shift', icon: ClockIcon },
    { label: 'Shift History', path: '/doctor/history', icon: CalendarIcon },
    { label: 'QR Scanner', path: '/doctor/scan', icon: QrcodeIcon },
  ];
  const hrNavItems = [
    { label: 'Dashboard', path: '/hr', icon: HomeIcon },
    { label: 'Shift Planner', path: '/hr/planner', icon: CalendarIcon },
    { label: 'Live Board', path: '/hr/live', icon: ClockIcon },
    { label: 'Reports', path: '/hr/reports', icon: ChartBarIcon },
    { label: 'Audit Log', path: '/hr/audit', icon: ShieldCheckIcon },
  ];
  const adminNavItems = [
    { label: 'System Config', path: '/admin/system', icon: CogIcon },
    { label: 'User Management', path: '/admin/users', icon: UsersIcon },
    { label: 'Departments', path: '/admin/departments', icon: UsersIcon },
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
  }; const navItems = getNavItems();
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  if (!user) return null;
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 bg-white overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-bold text-gray-900">Hospital Shift</h1>
            <p className="text-xs text-gray-500">Doctor Planning System</p>
          </div>
        </div>
        {/* Navigation */}
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${active
                      ? 'bg-sky-50 text-sky-700 border-l-4 border-sky-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 flex-shrink-0
                      ${active ? 'text-sky-600' : 'text-gray-400 group-hover:text-gray-500'}
                      `}
/>
{item.label}
</NavLink>
);
})}
</nav>
{/* User profile */}
<div className="flex-shrink-0 flex border-t border-gray-200 p-4">
<div className="flex items-center">
<div className="ml-3">
<p className="text-sm font-medium text-gray-700">{user.full_name}</p>
<p className="text-xs text-gray-500 capitalize">
{user.role?.replace('_', ' ')}
</p>
</div>
</div>
<button
onClick={logout}
className="ml-auto p-2 text-gray-400 hover:text-gray-500"
title="Logout"
>
<LogoutIcon className="h-5 w-5" />
</button>
</div>
</div>
</div>
</div>
);
};
export default Sidebar;