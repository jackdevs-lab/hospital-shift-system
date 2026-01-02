import React from 'react';
import clsx from 'clsx';
const Button = ({
children,
variant = 'primary',
size = 'medium',
loading = false,
disabled = false,
fullWidth = false,
startIcon,
endIcon,
className,
...props
}) => {
const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
const variants = {
primary: 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500',
secondary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
warning: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500',
outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
};const sizes = {
small: 'px-3 py-1.5 text-sm',
medium: 'px-4 py-2 text-sm',
large: 'px-6 py-3 text-base'
};
return (
<button
className={clsx(
baseStyles,
variants[variant],
sizes[size],
fullWidth && 'w-full',
(loading || disabled) && 'opacity-50 cursor-not-allowed',
className
)}
disabled={disabled || loading}
{...props}
>
{loading && (
<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" vie
wBox="0 0 24 24">
<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" 
strokeWidth="4" />
<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.3
73 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.6
47z" />
</svg>
)}
{startIcon && !loading && <span className="mr-2">{startIcon}</span>}
{children}
{endIcon && <span className="ml-2">{endIcon}</span>}
</button>
);
};
export default Button;