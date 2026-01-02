import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, ClockIcon, UserIcon, XIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Modal from '../common/Modal';
import shiftService from '../../services/shiftService';
const shiftSchema = z.object({
date: z.string().min(1, 'Date is required'),
start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
shift_type: z.enum(['day', 'night']),
department_id: z.string().min(1, 'Department is required'),
doctor_id: z.string().min(1, 'Doctor is required'),
notes: z.string().optional()
});
const ShiftForm = ({ isOpen, onClose, shift, onSuccess, mode = 'create' }) => {
const [departments, setDepartments] = useState([]);
const [doctors, setDoctors] = useState([]);
const [loading, setLoading] = useState(false);
const {
register,
handleSubmit,
formState: { errors },
reset,
watch
} = useForm({
resolver: zodResolver(shiftSchema),
defaultValues: shift || {
date: new Date().toISOString().split('T')[0],
start_time: '08:00',
end_time: '16:00',
shift_type: 'day',
notes: ''
}
});
const selectedDepartment = watch('department_id');
useEffect(() => {
if (isOpen) {
fetchDepartments();
reset(shift || {
date: new Date().toISOString().split('T')[0],
start_time: '08:00',
end_time: '16:00',
shift_type: 'day',
notes: ''
});
}
}, [isOpen, shift, reset]);
useEffect(() => {
if (selectedDepartment) {fetchDoctors(selectedDepartment);
    }
  }, [selectedDepartment]);
  const fetchDepartments = async () => {
    try {
      // Mock data - replace with API call
      const mockDepartments = [
        { id: '1', name: 'Emergency Room', code: 'ER' },
        { id: '2', name: 'Cardiology', code: 'CARD' },
        { id: '3', name: 'Surgery', code: 'SURG' },
        { id: '4', name: 'Pediatrics', code: 'PEDS' },
        { id: '5', name: 'Orthopedics', code: 'ORTHO' }
      ];
      setDepartments(mockDepartments);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };
  const fetchDoctors = async (departmentId) => {
    try {
      // Mock data - replace with API call
      const mockDoctors = [
        { id: '1', full_name: 'Dr. Sarah Chen' },
        { id: '2', full_name: 'Dr. Michael Rodriguez' },
        { id: '3', full_name: 'Dr. James Wilson' },
        { id: '4', full_name: 'Dr. Emily Parker' }
      ];
      setDoctors(mockDoctors);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      if (mode === 'create') {
        await shiftService.createShift(data);
      } else if (mode === 'edit' && shift?.id) {
        await shiftService.updateShift(shift.id, data);
      }
      
      onSuccess?.();
      onClose(); } catch (error) {
      console.error('Failed to save shift:', error);
    } finally {
      setLoading(false);
    }
  };
  const calculateDuration = () => {
    const start = watch('start_time');
    const end = watch('end_time');
    
    if (!start || !end) return '0 hours';
    
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    
    let totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    
    // Handle overnight shifts
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim();
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create New Shift' : 'Edit Shift'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">
              <CalendarIcon className="inline h-4 w-4 mr-1" />
              Date
            </label>
            <input
              type="date"
              {...register('date')}className={`input ${errors.date ? 'input-error' : ''}`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>
          
          <div>
            <label className="label">
              <ClockIcon className="inline h-4 w-4 mr-1" />
              Start Time
            </label>
            <input
              type="time"
              {...register('start_time')}
              className={`input ${errors.start_time ? 'input-error' : ''}`}
            />
            {errors.start_time && (
              <p className="mt-1 text-sm text-red-600">{errors.start_time.message}</p
>
            )}
          </div>
          
          <div>
            <label className="label">
              <ClockIcon className="inline h-4 w-4 mr-1" />
              End Time
            </label>
            <input
              type="time"
              {...register('end_time')}
              className={`input ${errors.end_time ? 'input-error' : ''}`}
            />
            {errors.end_time && (
              <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>
            )}
          </div>
        </div>
        {/* Duration Display */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Shift Duration: <span className="fontsemibold">{calculateDuration()}</span></p>
        </div>
        {/* Department and Doctor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Department</label>
            <select
              {...register('department_id')}
              className={`input ${errors.department_id ? 'input-error' : ''}`}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
            {errors.department_id && (
              <p className="mt-1 text-sm text-red-600">{errors.department_id.message}</p>
            )}
            </div>
          
          <div>
            <label className="label">
              <UserIcon className="inline h-4 w-4 mr-1" />
              Doctor
            </label>
            <select
              {...register('doctor_id')}
              className={`input ${errors.doctor_id ? 'input-error' : ''}`}
              disabled={!selectedDepartment}
            >
              <option value="">Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.full_name}
                </option>
              ))}
            </select>
            {errors.doctor_id && (
              <p className="mt-1 text-sm text-red-600">{errors.doctor_id.message}</p>
            )}
          </div>
        </div>
        {/* Shift Type */}
        <div>
          <label className="label">Shift Type</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center"><input
                type="radio"
                {...register('shift_type')}
                value="day"
                className="h-4 w-4 text-sky-600 focus:ring-sky-500"
              />
              <span className="ml-2">Day Shift (08:00 - 16:00)</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('shift_type')}
                value="night"
                className="h-4 w-4 text-sky-600 focus:ring-sky-500"
              />
              <span className="ml-2">Night Shift (16:00 - 08:00)</span>
            </label>
          </div>
          {errors.shift_type && (
            <p className="mt-1 text-sm text-red-600">{errors.shift_type.message}</p>
          )}
        </div>
        {/* Notes */}
        <div>
          <label className="label">Notes (Optional)</label>
          <textarea
            {...register('notes')}
            rows="3"
            className={`input ${errors.notes ? 'input-error' : ''}`}
            placeholder="Any additional notes about this shift..."
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>
        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button><Button
type="submit"
variant="primary"
loading={loading}
>
{mode === 'create' ? 'Create Shift' : 'Update Shift'}
</Button>
</div>
</form>
</Modal>
);
};
export default ShiftForm;