import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(...inputs));

const Input = React.forwardRef(({ 
  label, 
  error, 
  helperText, 
  className, 
  type = 'text', 
  ...props 
}, ref) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-12 w-full rounded-2xl border border-white/5 bg-bg-surface px-5 py-2 text-sm text-white transition-all duration-300 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-bg-elevated/30 focus:bg-bg-elevated/50 shadow-sm',
          error && 'border-expense/50 focus:ring-expense/20 focus:border-expense/50',
          className
        )}
        {...props}
      />
      {helperText && !error && (
        <p className="text-[10px] text-text-muted font-medium ml-1">{helperText}</p>
      )}
      {error && (
        <p className="text-[10px] text-expense font-black uppercase tracking-wider ml-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
