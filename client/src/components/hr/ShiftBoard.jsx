import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import {
CalendarIcon,
ClockIcon,
UserIcon,
CheckCircleIcon,
XCircleIcon,
ExclamationIcon,
ChevronDownIcon
} from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Table from '../common/Table';
import shiftService from '../../services/shiftService';
const ShiftBoard = () => {
const [shifts, setShifts] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedShift, setSelectedShift] = useState(null);
const [showShiftModal, setShowShiftModal] = useState(false);
const [filters, setFilters] = useState({
date: format(new Date(), 'yyyy-MM-dd'),
department: 'all',
status: 'all'
});
useEffect(() => {
fetchShifts();
}, [filters]);
const fetchShifts = async () => {
try {
setLoading(true);
const data = await shiftService.getAllShifts({
date: filters.date !== 'all' ? filters.date : undefined,
department_id: filters.department !== 'all' ? filters.department : undefined,
status: filters.status !== 'all' ? filters.status : undefined
});
setShifts(data);
} catch (error) {
console.error('Failed to fetch shifts:', error);
} finally {
setLoading(false);
} };
  const handleOverride = async (shiftId, data) => {
    try {
      await shiftService.manualOverride(shiftId, data);
      fetchShifts();
      setShowShiftModal(false);
    } catch (error) {
      console.error('Failed to override shift:', error);
    }
  };
  const columns = [
    {
      key: 'time',
      title: 'Time',
      dataIndex: 'start_time',
      render: (value, record) => (
        <div>
          <div className="font-medium">{record.start_time} - {record.end_time}</div>
          <div className="text-xs text-gray-500">{record.date}</div>
        </div>
      )
    },
    {
      key: 'doctor',
      title: 'Doctor',
      dataIndex: 'assignment',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <UserIcon className="h-4 w-4 text-gray-400" />
          <span>{value?.doctor?.full_name || 'Unassigned'}</span>
        </div>
      )
    },
    {
      key: 'department',
      title: 'Department',
      dataIndex: 'department',
      render: (value) => (
        <div>
          <div className="font-medium">{value?.name}</div>
          <div className="text-xs text-gray-500">{value?.code}</div>
        </div>
      )
    },
    { key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (value) => {
        const config = getStatusConfig(value);
        const Icon = config.icon;
        
        return (
          <div className="flex items-center space-x-2">
            <Icon className={`h-4 w-4 ${config.iconColor}`} />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          </div>
        );
      }
    },
    {
      key: 'attendance',
      title: 'Attendance',
      dataIndex: 'actual_start_time',
      render: (value, record) => {
        if (!value) return <span className="text-gray-500">-</span>;
        
        return (
          <div className="space-y-1">
            <div className="text-sm">
              In: {format(parseISO(record.actual_start_time), 'HH:mm')}
              {record.late_minutes > 0 && (
                <span className="text-amber-600 ml-1">({record.late_minutes}m late)</span>
              )}
            </div>
            {record.actual_end_time && (
              <div className="text-sm">
                Out: {format(parseISO(record.actual_end_time), 'HH:mm')}
                {record.early_exit_minutes > 0 && (
                  <span className="text-amber-600 ml-1">({record.early_exit_minutes}m early)</span>
                )}
              </div>
            )}
          </div>
        );
      }
    }, {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      render: (value, record) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="small"
            onClick={() => {
              setSelectedShift(record);
              setShowShiftModal(true);
            }}
          >
            View
          </Button>
          {record.status === 'missed' && (
            <Button
              variant="warning"
              size="small"
              onClick={() => handleOverride(value, { status: 'exception', reason: 'Manual override' })}
            >
              Override
            </Button>
          )}
        </div>
      )
    }
  ];
  const getStatusConfig = (status) => {
    const configs = {
      planned: {
        color: 'bg-gray-100 text-gray-800',
        iconColor: 'text-gray-500',
        icon: ClockIcon,
        label: 'Planned'
      },
      active: {
        color: 'bg-green-100 text-green-800',
        iconColor: 'text-green-500',
        icon: CheckCircleIcon,
        label: 'Active'
      },
      completed: {
        color: 'bg-blue-100 text-blue-800',iconColor: 'text-blue-500',
        icon: CheckCircleIcon,
        label: 'Completed'
      },
      missed: {
        color: 'bg-red-100 text-red-800',
        iconColor: 'text-red-500',
        icon: XCircleIcon,
        label: 'Missed'
      },
      exception: {
        color: 'bg-amber-100 text-amber-800',
        iconColor: 'text-amber-500',
        icon: ExclamationIcon,
        label: 'Exception'
      }
    };
    return configs[status] || configs.planned;
  };
  const stats = {
    total: shifts.length,
    active: shifts.filter(s => s.status === 'active').length,
    missed: shifts.filter(s => s.status === 'missed').length,
    completed: shifts.filter(s => s.status === 'completed').length
  };
  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Shifts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" /> </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Now</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Missed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.missed}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-lg">
              <ExclamationIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Exceptions</p>
              <p className="text-2xl font-bold text-gray-900">
                {shifts.filter(s => s.status === 'exception').length}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:spacey-0 md:space-x-4">
          <div className="flex-1">
            <label className="label">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="input"
            /></div>
          
          <div className="flex-1">
            <label className="label">Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value 
})}
              className="input"
            >
              <option value="all">All Departments</option>
              <option value="1">Emergency Room</option>
              <option value="2">Cardiology</option>
              <option value="3">Surgery</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="label">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
              <option value="exception">Exception</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button
              onClick={() => setFilters({
                date: format(new Date(), 'yyyy-MM-dd'),
                department: 'all',
                status: 'all'
              })}
              variant="outline"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>{/* Shifts Table */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Shifts</h2>
        </div>
        <div className="p-6">
          <Table
            columns={columns}
            data={shifts}
            loading={loading}
            emptyMessage="No shifts found for the selected filters"
            onRowClick={(row) => {
              setSelectedShift(row);
              setShowShiftModal(true);
            }}
          />
        </div>
      </div>
      {/* Shift Details Modal */}
      {selectedShift && (
        <Modal
          isOpen={showShiftModal}
          onClose={() => setShowShiftModal(false)}
          title="Shift Details"
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="font-medium">{selectedShift.assignment?.doctor?.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{selectedShift.department?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Scheduled Time</p>
                <p className="font-medium">{selectedShift.start_time} - {selectedShift.end_time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Shift Type</p>
                <p className="font-medium capitalize">{selectedShift.shift_type}</p></div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusConfig
(selectedShift.status).color}`}>
                    {getStatusConfig(selectedShift.status).label}
                  </span>
                </p>
              </div>
            </div>
            {selectedShift.actual_start_time && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Attendance Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Check-in Time</p>
                    <p className="font-medium">
                      {format(parseISO(selectedShift.actual_start_time), 'HH:mm')}
                      {selectedShift.late_minutes > 0 && (
                        <span className="text-amber-600 ml-2">({selectedShift.late_minutes} minutes late)</span>
                      )}
                    </p>
                  </div>
                  {selectedShift.actual_end_time && (
                    <div>
                      <p className="text-sm text-gray-500">Check-out Time</p>
                      <p className="font-medium">
                        {format(parseISO(selectedShift.actual_end_time), 'HH:mm')}
                        {selectedShift.early_exit_minutes > 0 && (
                          <span className="text-amber-600 ml-2">({selectedShift.early_exit_minutes} minutes early)</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {selectedShift.notes && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Notes</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedShift.notes}</p></div>
)}
<div className="border-t pt-4 flex justify-end space-x-3">
{selectedShift.status === 'missed' && (
<Button
variant="warning"
onClick={() => handleOverride(selectedShift.id, {
status: 'exception',
reason: 'Manual override by HR',
actual_start_time: selectedShift.actual_start_time,
actual_end_time: selectedShift.actual_end_time
})}
>
Mark as Exception
</Button>
)}
<Button variant="outline" onClick={() => setShowShiftModal(false)}>
Close
</Button>
</div>
</div>
</Modal>
)}
</div>
);
};
export default ShiftBoard;
