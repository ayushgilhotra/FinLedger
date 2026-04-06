import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(...inputs));

const Card = ({ 
  children, 
  title, 
  subtitle, 
  action, 
  className, 
  noPadding = false 
}) => {
  return (
    <div className={cn(
      'rounded-xl border border-bg-border bg-bg-surface shadow-sm transition-all duration-200',
      className
    )}>
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between border-b border-bg-border px-6 py-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-text-primary tracking-tight">{title}</h3>}
            {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={cn(noPadding ? '' : 'p-6')}>
        {children}
      </div>
    </div>
  );
};

export default Card;
