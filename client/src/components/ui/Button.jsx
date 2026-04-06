import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(...inputs));

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled, 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-accent text-bg-base hover:bg-accent-dim shadow-glow',
    secondary: 'bg-bg-elevated text-text-primary hover:bg-bg-border border border-bg-border',
    danger: 'bg-expense text-white hover:opacity-90',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!loading && children}
      {loading && 'Processing...'}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
