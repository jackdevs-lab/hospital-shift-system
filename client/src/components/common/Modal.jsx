import React, { useEffect } from 'react';
import { XIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const Modal = ({ isOpen, onClose, title, children, size = 'md', hideClose = false }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={clsx(
            'relative bg-white rounded-lg shadow-xl w-full',
            sizeClasses[size]
          )}
        >
          {/* Header */}
          {(title || !hideClose) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
              {!hideClose && (
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
                  aria-label="Close"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-4">
            {children}
          </div>

          {/* Footer (optional) */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex justify-end space-x-3">
              <button onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;