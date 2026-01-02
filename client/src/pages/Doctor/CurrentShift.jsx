import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import {
  ClockIcon,
  LocationMarkerIcon,
  CalendarIcon,
  UserIcon,
  QrcodeIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import AttendanceButton from '../../components/doctor/AttendanceButton';
import shiftService from '../../services/shiftService';

const CurrentShift = () => {
  const { user } = useAuth();
  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  useEffect(() => {
    fetchCurrentShift();
  }, []);

  const fetchCurrentShift = async () => {
    try {
      setLoading(true);
      const data = await shiftService.getTodayShift();
      setShift(data);
      
      if (data?.id) {
        fetchAttendanceHistory(data.id);
      }
    } catch (error) {
      toast.error('Failed to load shift details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceHistory = async (shiftId) => {
    try {
      const history = await shiftService.getAttendanceHistory({ shift_id: shiftId });
      setAttendanceHistory(history);
    } catch (error) {
      console.error('Failed to fetch attendance history:', error);
    }
  };

  const handleCheckIn = async () => {
    try {
      await shiftService.checkIn(shift.id);
      toast.success('Checked in successfully!');
      fetchCurrentShift();
    } catch (error) {
      toast.error(error.message || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      await shiftService.checkOut(shift.id);
      toast.success('Checked out successfully!');
      fetchCurrentShift();
    } catch (error) {
      toast.error(error.message || 'Failed to check out');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="text-center py-12">
        <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Shift Today</h2>
        <p className="text-gray-600 mb-6">
          You don't have any shifts scheduled for today.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shift Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Current Shift</h1>
          <p className="text-gray-600 mt-1">
            {shift.date} • {shift.department?.name}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="outline"
            startIcon={<QrcodeIcon className="h-5 w-5" />}
            onClick={() => window.location.href = '/doctor/scan'}
          >
            Scan QR Code
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Shift Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Shift Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Scheduled Time</p>
                    <p className="text-lg font-semibold">
                      {shift.start_time} - {shift.end_time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <LocationMarkerIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-lg font-semibold">{shift.department?.name}</p>
                    <p className="text-sm text-gray-600">{shift.department?.code}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shift Type</p>
                    <p className="text-lg font-semibold capitalize">{shift.shift_type}</p>
                    <p className="text-sm text-gray-600">
                      {shift.shift_type === 'day' ? 'Day Shift' : 'Night Shift'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <UserIcon className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Assigned Doctor</p>
                    <p className="text-lg font-semibold">Dr. {user?.full_name?.split(' ')[0]}</p>
                    <p className="text-sm text-gray-600">{user?.employee_id}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Attendance Actions */}
          <Card title="Attendance">
            <div className="max-w-md mx-auto">
              <AttendanceButton
                shift={shift}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
              />
            </div>
          </Card>

          {/* Attendance History */}
          {attendanceHistory.length > 0 && (
            <Card title="Attendance History">
              <div className="space-y-4">
                {attendanceHistory.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        event.event_type === 'check_in' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {event.event_type === 'check_in' ? (
                          <ClockIcon className="h-5 w-5 text-green-600" />
                        ) : (
                          <CalendarIcon className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium capitalize">
                          {event.event_type.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {format(parseISO(event.event_time), 'MMM d, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Method</p>
                      <p className="font-medium capitalize">{event.method}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Status & Timeline */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card title="Shift Status">
            <div className="space-y-4">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                  shift.status === 'active' ? 'bg-green-100' :
                  shift.status === 'completed' ? 'bg-blue-100' :
                  shift.status === 'missed' ? 'bg-red-100' :
                  'bg-gray-100'
                }`}>
                  <span className={`text-2xl font-bold ${
                    shift.status === 'active' ? 'text-green-600' :
                    shift.status === 'completed' ? 'text-blue-600' :
                    shift.status === 'missed' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {shift.status.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {shift.status}
                </h3>
                {shift.status === 'active' && (
                  <p className="text-sm text-gray-600 mt-1">
                    Shift is currently in progress
                  </p>
                )}
              </div>

              {shift.actual_start_time && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">Check-in Time</p>
                  <p className="font-medium">
                    {format(parseISO(shift.actual_start_time), 'HH:mm')}
                    {shift.late_minutes > 0 && (
                      <span className="text-amber-600 ml-2">
                        ({shift.late_minutes} minutes late)
                      </span>
                    )}
                  </p>
                </div>
              )}

              {shift.actual_end_time && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">Check-out Time</p>
                  <p className="font-medium">
                    {format(parseISO(shift.actual_end_time), 'HH:mm')}
                    {shift.early_exit_minutes > 0 && (
                      <span className="text-amber-600 ml-2">
                        ({shift.early_exit_minutes} minutes early)
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="space-y-2">
              <Button
                variant="outline"
                fullWidth
                onClick={() => window.location.href = '/doctor/scan'}
                startIcon={<QrcodeIcon className="h-5 w-5" />}
              >
                Scan QR Code
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => window.location.href = '/doctor/history'}
                startIcon={<CalendarIcon className="h-5 w-5" />}
              >
                View History
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => window.location.href = '/profile'}
              >
                Update Profile
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CurrentShift;