import React from 'react';
import clsx from 'clsx';
const LoadingSpinner = ({ size = 'md', color = 'primary', className }) => {
const sizeClasses = {sm: 'h-4 w-4',
md: 'h-8 w-8',
lg: 'h-12 w-12',
xl: 'h-16 w-16'
};
const colorClasses = {
primary: 'border-t-sky-600',
secondary: 'border-t-indigo-600',
white: 'border-t-white',
gray: 'border-t-gray-600'
};
return (
<div className={clsx('flex justify-center items-center', className)}>
<div
className={clsx(
'animate-spin rounded-full border-4 border-solid border-current border-r-transparent',
sizeClasses[size],
colorClasses[color]
)}
role="status"
>
<span className="sr-only">Loading...</span>
</div>
</div>
);
};
export default LoadingSpinner;