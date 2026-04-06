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
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-lg border border-bg-border bg-bg-surface px-4 py-2 text-sm text-text-primary ring-offset-bg-base transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-expense focus:ring-expense/40 focus:border-expense/40',
          className
        )}
        {...props}
      />
      {helperText && !error && (
        <p className="text-xs text-text-muted">{helperText}</p>
      )}
      {error && (
        <p className="text-xs text-expense font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
