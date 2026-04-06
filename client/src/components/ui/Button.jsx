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
    primary: 'bg-accent text-bg-base hover:bg-accent-hover shadow-neon ring-1 ring-white/10',
    secondary: 'bg-white/5 text-white hover:bg-white/10 border border-white/10 backdrop-blur-sm',
    danger: 'bg-expense text-white hover:opacity-90',
    ghost: 'bg-transparent text-text-secondary hover:text-white hover:bg-white/5',
    outline: 'bg-transparent text-accent border border-accent/30 hover:border-accent hover:bg-accent/5',
  };

  const sizes = {
    sm: 'px-5 py-2 text-xs',
    md: 'px-8 py-3 text-sm font-bold uppercase tracking-widest',
    lg: 'px-10 py-4 text-base font-bold uppercase tracking-widest',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50 active:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none',
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
