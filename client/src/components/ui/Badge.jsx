import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(...inputs));

const Badge = ({ 
  children, 
  variant = 'default', 
  dot = false, 
  className 
}) => {
  const variants = {
    default: 'bg-bg-elevated text-text-secondary border-bg-border',
    admin: 'bg-info/10 text-info border-info/20',
    analyst: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    user: 'bg-text-muted/10 text-text-secondary border-text-muted/20',
    active: 'bg-income/10 text-income border-income/20',
    inactive: 'bg-text-muted/10 text-text-secondary border-text-muted/20',
    income: 'bg-income/10 text-income border-income/20',
    expense: 'bg-expense/10 text-expense border-expense/20',
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
      variants[variant],
      className
    )}>
      {dot && (
        <span className={cn(
          "mr-1.5 h-1.5 w-1.5 rounded-full",
          variant === 'active' || variant === 'income' ? "bg-income" : "bg-text-muted"
        )} />
      )}
      {children}
    </span>
  );
};

export default Badge;
