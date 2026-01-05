import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } 
from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import ShiftCard from './ShiftCard';
const CalendarView = () => {
const [currentDate, setCurrentDate] = useState(new Date());
const [selectedDate, setSelectedDate] = useState(new Date());
const [view, setView] = useState('month'); // 'month' or 'list'
// Mock data - replace with actual API call
const shifts = [
{
id: 1,
date: format(new Date(), 'yyyy-MM-dd'),
start_time: '08:00',
end_time: '16:00',
department: { name: 'Emergency Room', code: 'ER' },
status: 'planned',
shift_type: 'day'
},
{
id: 2,
date: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
start_time: '16:00',
end_time: '00:00',
department: { name: 'Cardiology', code: 'CARD' },
status: 'planned',
shift_type: 'night'
}
];
const getShiftsForDate = (date) => {
const dateStr = format(date, 'yyyy-MM-dd');
return shifts.filter(shift => shift.date === dateStr);
};
const renderMonthView = () => {
const monthStart = startOfMonth(currentDate);
const monthEnd = endOfMonth(currentDate);
const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
return (
<div className="bg-white rounded-lg border border-gray-200">
{/* Calendar Header */}
<div className="flex items-center justify-between px-6 py-4 border-b border-g
ray-200">
<button
onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
className="p-2 hover:bg-gray-100 rounded-lg"
>
<ChevronLeftIcon className="h-5 w-5" />
</button>
<h2 className="text-lg font-semibold text-gray-900">
{format(currentDate, 'MMMM yyyy')}
</h2>
<button
onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
className="p-2 hover:bg-gray-100 rounded-lg"
>
<ChevronRightIcon className="h-5 w-5" />
</button>
</div>
{/* Weekday Headers */}<div className="grid grid-cols-7 gap-px bg-gray-200">
          {weekdays.map(day => (
            <div key={day} className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map(day => {
            const dayShifts = getShiftsForDate(day);
            const isCurrentDay = isToday(day);
            const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            
            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  min-h-24 bg-white p-2 text-left
                  ${isCurrentDay ? 'bg-sky-50' : ''}
                  ${isSelected ? 'ring-2 ring-sky-500' : ''}
                  hover:bg-gray-50 focus:outline-none
                `}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`
                    text-sm font-medium
                    ${isCurrentDay ? 'text-sky-600' : 'text-gray-900'}
                  `}>
                    {format(day, 'd')}
                  </span>
                  {dayShifts.length > 0 && (
                    <span className="text-xs bg-sky-100 text-sky-800 px-1 rounded">
                      {dayShifts.length}
                    </span>
                  )}
                </div>
                
                {/* Shift Indicators */}
                <div className="space-y-1">
                  {dayShifts.slice(0, 2).map(shift => (
                    <div
                      key={shift.id}className={`text-xs px-1 py-0.5 rounded truncate ${shift.shift_type === 'day' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}
title={`${shift.start_time} - ${shift.end_time}`}
>
{shift.start_time}
</div>
))}
{dayShifts.length > 2 && (
<div className="text-xs text-gray-500">
+{dayShifts.length - 2} more
</div>
)}
</div>
</button>
);
})}
</div>
</div>
);
};
const renderListView = () => {
const selectedShifts = getShiftsForDate(selectedDate);
return (
<div className="space-y-4">
<div className="flex items-center justify-between">
<h3 className="text-lg font-semibold text-gray-900">
Shifts for {format(selectedDate, 'MMMM d, yyyy')}
</h3>
<button
onClick={() => setSelectedDate(new Date())}
className="text-sm text-sky-600 hover:text-sky-700"
>
Today
</button>
</div>
{selectedShifts.length > 0 ? (
<div className="space-y-3">
{selectedShifts.map(shift => (
<ShiftCard key={shift.id} shift={shift} compact />
))}
</div>
) : (<div className="text-center py-8 bg-gray-50 rounded-lg">
<p className="text-gray-500">No shifts scheduled for this day</p>
</div>
)}
</div>
);
};
return (
<div className="space-y-6">
{/* View Toggle */}
<div className="flex justify-end">
<div className="inline-flex rounded-lg border border-gray-200 p-1">
<button
onClick={() => setView('month')}
className={`px-3 py-1.5 text-sm font-medium rounded-md ${
view === 'month' 
? 'bg-sky-600 text-white' 
: 'text-gray-700 hover:text-gray-900'
}`}
>
Month View
</button>
<button
onClick={() => setView('list')}
className={`px-3 py-1.5 text-sm font-medium rounded-md ${
view === 'list' 
? 'bg-sky-600 text-white' 
: 'text-gray-700 hover:text-gray-900'
}`}
>
List View
</button>
</div>
</div>
{view === 'month' ? renderMonthView() : renderListView()}
</div>
);};
export default CalendarView;