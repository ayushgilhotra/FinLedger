import { cn } from '../../utils/cn';
import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';


/**
 * DataTable component for high-density transactional data presentation.
 * 
 * @param {Array} columns - Array of columns { header, accessor, render, className }
 * @param {Array} data - Array of transactional data.
 * @param {boolean} loading - Loading state for shimmer skeletons.
 */
const DataTable = ({ columns, data, loading = false }) => {
  return (
    <div className="w-full overflow-hidden rounded-lg bg-bg-surface border border-bg-border shadow-card modern-scrollbar">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-bottom 2px solid #1E3A5F bg-bg-base/30">
              {columns.map((col, i) => (
                <th 
                  key={i} 
                  className={cn(
                    "px-6 py-4 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-text-secondary border-b-2 border-bg-border",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-border">
            {loading ? (
              // Skeleton rows
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-bg-elevated rounded-md w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((row, i) => (
                <tr 
                  key={i} 
                  className="group hover:bg-white/[0.025] hover:shadow-[inset_4px_0_0_rgba(0,212,170,0.4)] transition-all duration-200"
                >
                  {columns.map((col, j) => (
                    <td 
                      key={j} 
                      className={cn(
                        "px-6 py-4 text-[0.875rem] text-text-primary whitespace-nowrap",
                        col.className
                      )}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-text-dim uppercase tracking-widest text-xs font-bold">
                  No data available in this ledger.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
