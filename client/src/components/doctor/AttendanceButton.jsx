import React from 'react';
import { QrcodeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Modal from '../common/Modal';
const AttendanceButton = ({ shift, onCheckIn, onCheckOut }) => {
const [showQRModal, setShowQRModal] = React.useState(false);
if (!shift) return null;
const renderCheckInButton = () => (
<div className="space-y-3">
<Button
variant="primary"
size="large"
fullWidth
startIcon={<CheckCircleIcon className="h-5 w-5" />}
onClick={() => onCheckIn(shift.id)}
>
Check In Now
</Button>
<Button
variant="outline"
size="large"
fullWidth
startIcon={<QrcodeIcon className="h-5 w-5" />}
onClick={() => setShowQRModal(true)}
>
Scan QR Code
</Button>
</div>
);
const renderCheckOutButton = () => (
<Button
variant="primary"
size="large"fullWidth
      startIcon={<XCircleIcon className="h-5 w-5" />}
      onClick={() => onCheckOut(shift.id)}
    >
      Check Out Now
    </Button>
  );
  const renderCompletedStatus = () => (
    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
      <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-2" />
      <p className="font-semibold text-green-800">Shift Completed</p>
      <p className="text-sm text-green-600 mt-1">
        Thank you for your service today!
      </p>
    </div>
  );
  const renderMissedStatus = () => (
    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
      <XCircleIcon className="h-12 w-12 text-red-600 mx-auto mb-2" />
      <p className="font-semibold text-red-800">Shift Missed</p>
      <p className="text-sm text-red-600 mt-1">
        Please contact HR if this was unexpected
      </p>
    </div>
  );
  const renderExceptionStatus = () => (
    <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
      <ExclamationIcon className="h-12 w-12 text-amber-600 mx-auto mb-2" />
      <p className="font-semibold text-amber-800">Exception Status</p>
      <p className="text-sm text-amber-600 mt-1">
        {shift.notes || 'Please see HR for details'}
      </p>
    </div>
  );
  const renderQRModal = () => (
    <Modal
      isOpen={showQRModal}
      onClose={() => setShowQRModal(false)}
      title="Scan QR Code"
    >
      <div className="text-center">
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-2"> Point your camera at the department QR code
          </p>
          <div className="relative w-64 h-64 mx-auto border-4 border-dashed border-gr
ay-300 rounded-lg flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-sky-500 rounded-lg m-4">
</div>
            <div className="relative z-10">
              <QrcodeIcon className="h-24 w-24 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              // Handle QR scan success
              onCheckIn(shift.id, { method: 'qr' });
              setShowQRModal(false);
            }}
          >
            Simulate QR Scan
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={() => setShowQRModal(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
  switch (shift.status) {
    case 'planned':
      return (
        <>
          {renderCheckInButton()}
          {renderQRModal()}
        </>
      );
    
    case 'active':return renderCheckOutButton();
case 'completed':
return renderCompletedStatus();
case 'missed':
return renderMissedStatus();
case 'exception':
return renderExceptionStatus();
default:
return null;
}
};
export default AttendanceButton;