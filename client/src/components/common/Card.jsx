import React from 'react';
import clsx from 'clsx';
const Card = ({ children, className, title, subtitle, actions, padding = true, shadow 
= true }) => {
return (
<div className={clsx(
'bg-white rounded-lg border border-gray-200',
shadow && 'shadow-sm',
className
)}>
{(title || subtitle || actions) && (
<div className="flex items-center justify-between px-6 py-4 border-b border-g
ray-200">
<div>
{title && (
<h2 className="text-lg font-semibold text-gray-900">{title}</h2>
)}
{subtitle && (
<p className="mt-1 text-sm text-gray-600">{subtitle}</p>
)}
</div>
{actions && (<div className="flex items-center space-x-2">
{actions}
</div>
)}
</div>
)}
<div className={clsx(padding && 'p-6')}>
{children}
</div>
</div>
);
};
export default Card;