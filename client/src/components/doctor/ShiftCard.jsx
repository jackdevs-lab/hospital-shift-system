import React from 'react';
import { format, parseISO } from 'date-fns';
import {
CalendarIcon,
ClockIcon,
LocationMarkerIcon,
UserIcon,
CheckCircleIcon,
XCircleIcon,
ExclamationIcon
} from '@heroicons/react/24/outline';
import Button from '../common/Button';
const ShiftCard = ({ shift, onCheckIn, onCheckOut, onViewDetails, compact = false }) => {
const getStatusConfig = (status) => {
const configs = {
planned: {
color: 'bg-gray-100 text-gray-800',
icon: ClockIcon,
label: 'Planned'
},
active: {
color: 'bg-green-100 text-green-800',
icon: CheckCircleIcon,
label: 'Active'
},
completed: {
color: 'bg-blue-100 text-blue-800',
icon: CheckCircleIcon,
label: 'Completed'
},
missed: {
color: 'bg-red-100 text-red-800',
icon: XCircleIcon,
label: 'Missed'
},exception: {
color: 'bg-amber-100 text-amber-800',
icon: ExclamationIcon,
label: 'Exception'
}
};
return configs[status] || configs.planned;
};
const statusConfig = getStatusConfig(shift.status);
const StatusIcon = statusConfig.icon;
const renderCompact = () => (
<div className="card p-4 hover:shadow-md transition-shadow">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-3">
<div className={`p-2 rounded-lg ${statusConfig.color}`}>
<StatusIcon className="h-5 w-5" />
</div>
<div>
<h4 className="font-medium text-gray-900">{shift.department?.name}</h4>
<p className="text-sm text-gray-500">
{shift.start_time} - {shift.end_time}
</p>
</div>
</div>
<span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig.color}`}>
{statusConfig.label}
</span>
</div>
</div>
);
const renderDetailed = () => (
<div className="card p-6 hover:shadow-md transition-shadow">
<div className="flex items-start justify-between mb-4">
<div>
<div className="flex items-center space-x-2 mb-2">
<span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig.color}`}>
{statusConfig.label}
</span>
<span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
{shift.shift_type} Shift
</span></div>
          <h3 className="text-xl font-bold text-gray-900">{shift.department?.name}</h3>
          <p className="text-gray-600">{shift.date}</p>
        </div>
        {onViewDetails && (
          <Button variant="outline" size="small" onClick={() => onViewDetails(shift)}
>
            Details
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <ClockIcon className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Scheduled Time</p>
            <p className="font-medium">{shift.start_time} - {shift.end_time}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <LocationMarkerIcon className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-medium">{shift.department?.code}</p>
          </div>
        </div>
        {shift.actual_start_time && (
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Check-in</p>
              <p className="font-medium">
                {format(parseISO(shift.actual_start_time), 'HH:mm')}
                {shift.late_minutes > 0 && (
                  <span className="text-amber-600 ml-1">({shift.late_minutes}m late)
</span>
                )}
              </p>
            </div>
          </div>
        )}
        {shift.actual_end_time && (<div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Check-out</p>
              <p className="font-medium">
                {format(parseISO(shift.actual_end_time), 'HH:mm')}
                {shift.early_exit_minutes > 0 && (
                  <span className="text-amber-600 ml-1">({shift.early_exit_minutes}m 
early)</span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <UserIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            {shift.assignment?.doctor?.full_name || 'Unassigned'}
          </span>
        </div>
        <div className="flex space-x-2">
          {shift.status === 'planned' && onCheckIn && (
            <Button variant="primary" onClick={() => onCheckIn(shift.id)}>
              Check In
            </Button>
          )}
          
          {shift.status === 'active' && onCheckOut && (
            <Button variant="primary" onClick={() => onCheckOut(shift.id)}>
              Check Out
            </Button>
          )}
          
          {shift.status === 'completed' && (
            <Button variant="outline" disabled>
              Completed
            </Button>
          )}
        </div>
      </div>
    </div>
  );return compact ? renderCompact() : renderDetailed();
};
export default ShiftCard;