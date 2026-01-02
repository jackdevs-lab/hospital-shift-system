import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
CalendarIcon,
ClockIcon,
CheckCircleIcon,
XCircleIcon,
ExclamationIcon,
QrcodeIcon
} from '@heroicons/react/24/solid';
import { format, isToday, parseISO } from 'date-fns';
import shiftService from '../../services/shiftService';
import ShiftCard from '../../components/doctor/ShiftCard';
import AttendanceButton from '../../components/doctor/AttendanceButton';
import CalendarView from '../../components/doctor/CalendarView';
const DoctorDashboard = () => {
const { user } = useAuth();
const [todayShift, setTodayShift] = useState(null);
const [loading, setLoading] = useState(true);
const [stats, setStats] = useState({
totalShifts: 0,
completedShifts: 0,
missedShifts: 0,
onTimeRate: 0
});
useEffect(() => {
fetchDashboardData();
}, []);
const fetchDashboardData = async () => {
try {
setLoading(true);
const [todayShiftData, statistics] = await Promise.all([
shiftService.getTodayShift(),
shiftService.getStatistics()
]);
setTodayShift(todayShiftData);
setStats(statistics);
} catch (error) {
toast.error('Failed to load dashboard data');
} finally {
setLoading(false);
}
};
const handleCheckIn = async () => {
try {
await shiftService.checkIn(todayShift.id);
toast.success('Checked in successfully!');
fetchDashboardData();
} catch (error) {toast.error(error.message || 'Failed to check in');
    }
  };
  const handleCheckOut = async () => {
    try {
      await shiftService.checkOut(todayShift.id);
      toast.success('Checked out successfully!');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.message || 'Failed to check out');
    }
  };
  const getShiftStatusColor = (status) => {
    const colors = {
      planned: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      missed: 'bg-red-100 text-red-800',
      exception: 'bg-amber-100 text-amber-800'
    };
    return colors[status] || colors.planned;
  };
  const getShiftStatusIcon = (status) => {
    const icons = {
      planned: ClockIcon,
      active: CheckCircleIcon,
      completed: CheckCircleIcon,
      missed: XCircleIcon,
      exception: ExclamationIcon
    };
    return icons[status] || ClockIcon;
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Welcome Section */} <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, Dr. {user?.full_name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-600 mt-1">
              {isToday(new Date()) ? "Here's your schedule for today" : "Here's your schedule"}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => window.location.href = '/doctor/scan'}
              className="btn btn-primary flex items-center space-x-2"
            >
              <QrcodeIcon className="h-5 w-5" />
              <span>Scan QR Code</span>
            </button>
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Shifts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalShifts}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedShifts}
</p>
            </div></div>
</div>
<div className="card p-4">
<div className="flex items-center">
<div className="p-3 bg-red-100 rounded-lg">
<XCircleIcon className="h-6 w-6 text-red-600" />
</div>
<div className="ml-4">
<p className="text-sm text-gray-500">Missed</p>
<p className="text-2xl font-bold text-gray-900">{stats.missedShifts}</p
>
</div>
</div>
</div>
<div className="card p-4">
<div className="flex items-center">
<div className="p-3 bg-amber-100 rounded-lg">
<ClockIcon className="h-6 w-6 text-amber-600" />
</div>
<div className="ml-4">
<p className="text-sm text-gray-500">On Time Rate</p>
<p className="text-2xl font-bold text-gray-900">{stats.onTimeRate}%</p>
</div>
</div>
</div>
</div>
{/* Today's Shift */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
<div className="lg:col-span-2">
<div className="card">
<div className="px-6 py-4 border-b border-gray-200">
<h2 className="text-lg font-semibold text-gray-900">Today's Shift</h2>
</div>
<div className="p-6">
{todayShift ? (
<div className="space-y-4">
<div className="flex items-center justify-between">
<div>
<h3 className="text-xl font-bold text-gray-900">
{todayShift.department?.name || 'Department'}
</h3>
<p className="text-gray-600">{todayShift.shift_type} Shift</p>
</div>
<span className={`status-badge ${getShiftStatusColor(todayShift.status)}`}>
 {todayShift.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Scheduled Time</p>
                      <p className="text-lg font-semibold">
                        {todayShift.start_time} - {todayShift.end_time}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="text-lg font-semibold">
                        {todayShift.duration || '8'} hours
                      </p>
                    </div>
                  </div>
                  {todayShift.actual_start_time && (
                    <div>
                      <p className="text-sm text-gray-500">Actual Check-in</p>
                      <p className="text-lg font-semibold">
                        {format(parseISO(todayShift.actual_start_time), 'HH:mm')}
                        {todayShift.late_minutes > 0 && (
                          <span className="text-amber-600 ml-2">
                            ({todayShift.late_minutes} min late)
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  <AttendanceButton
                    shift={todayShift}
                    onCheckIn={handleCheckIn}
                    onCheckOut={handleCheckOut}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No shift tod
ay</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any shifts scheduled for today. </p>
                </div>
              )}
            </div>
          </div>
          {/* Upcoming Shifts */}
          <div className="card mt-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Shifts</h2
>
            </div>
            <div className="p-6">
              <CalendarView />
            </div>
          </div>
        </div>
        {/* Quick Actions & Notifications */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => window.location.href = '/doctor/scan'}
                className="w-full btn btn-outline flex items-center justify-center sp
ace-x-2"
              >
                <QrcodeIcon className="h-5 w-5" />
                <span>Scan QR Code</span>
              </button>
              <button
                onClick={() => window.location.href = '/doctor/history'}
                className="w-full btn btn-outline flex items-center justify-center sp
ace-x-2"
              >
                <CalendarIcon className="h-5 w-5" />
                <span>View History</span>
              </button>
              <button
                onClick={() => window.location.href = '/profile'}
                className="w-full btn btn-outline flex items-center justify-center sp
ace-x-2"
              ><span>Profile Settings</span>
              </button>
            </div>
          </div>
          {/* Recent Notifications */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Notification
s</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-cente
r justify-center">
                      <BellIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Shift reminder for tomorrow
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-cent
er justify-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Last shift completed successfully
                    </p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => window.location.href = '/notifications'}
                className="w-full mt-4 btn btn-outline text-sm"
              >
                View All Notifications</button>
</div>
</div>
</div>
</div>
</div>
);
};
export default DoctorDashboard;