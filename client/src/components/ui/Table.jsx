import React from 'react';
import { cn } from '../../utils/cn';
import Spinner from './Spinner';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(...inputs));

const Table = ({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = "No records found",
  className
}) => {
  if (loading) {
    return (
      <div className="w-full space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-bg-elevated" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-muted">
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-bg-border">
            {columns.map((col, i) => (
              <th 
                key={i} 
                className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr 
              key={i} 
              className="group border-b border-bg-border/50 transition-colors hover:bg-bg-elevated/30"
            >
              {columns.map((col, j) => (
                <td key={j} className="px-6 py-4 text-sm font-medium text-text-primary">
                  {col.render ? col.render(row) : row[col.accessor]}
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
