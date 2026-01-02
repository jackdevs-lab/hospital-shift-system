import React from 'react';
import clsx from 'clsx';
const Table = ({columns,
data,
keyField = 'id',
loading = false,
emptyMessage = 'No data available',
onRowClick,
className,
striped = true,
hoverable = true
}) => {
if (loading) {
return (
<div className="flex justify-center items-center h-64">
<div className="spinner"></div>
</div>
);
}
if (!data || data.length === 0) {
return (
<div className="text-center py-12">
<div className="text-gray-400 mb-4">
<svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke
="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 
12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.
75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.801 0A2.251 2.251 0 0113.5 
2.25H15c1.012 0 1.867.668 2.15 1.586m-5.801 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.
25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.1
25 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125
H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
</svg>
</div>
<p className="text-gray-500">{emptyMessage}</p>
</div>
);
}
return (
<div className="overflow-x-auto rounded-lg border border-gray-200">
<table className={clsx('min-w-full divide-y divide-gray-200', className)}>
<thead className="bg-gray-50">
<tr>
{columns.map((column) => (
<th
key={column.key}className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppe
rcase tracking-wider"
style={column.width ? { width: column.width } : {}}
>
{column.title}
</th>
))}
</tr>
</thead>
<tbody className="bg-white divide-y divide-gray-200">
{data.map((row, rowIndex) => (
<tr
key={row[keyField]}
className={clsx(
hoverable && 'hover:bg-gray-50 cursor-pointer',
striped && rowIndex % 2 === 0 && 'bg-gray-50'
)}
onClick={() => onRowClick && onRowClick(row)}
>
{columns.map((column) => (
<td
key={column.key}
className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
>
{column.render ? column.render(row[column.dataIndex], row) : row[column.dataIndex]}
</td>
))}
</tr>
))}
</tbody>
</table>
</div>
);
};
export default Table;