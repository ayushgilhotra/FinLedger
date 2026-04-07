import { cn } from '../../utils/cn';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-bg-border transition-colors hover:bg-bg-elevated disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronLeft size={18} />
      </button>

      {start > 1 && (
        <>
          <button 
            onClick={() => onPageChange(1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium hover:bg-bg-elevated"
          >
            1
          </button>
          {start > 2 && <span className="text-text-muted">...</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-all',
            currentPage === p 
              ? 'bg-accent text-bg-base' 
              : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
          )}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-text-muted">...</span>}
          <button 
            onClick={() => onPageChange(totalPages)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium hover:bg-bg-elevated"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-bg-border transition-colors hover:bg-bg-elevated disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
