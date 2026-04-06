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
  variant = 'default',
  noPadding = false 
}) => {
  return (
    <div className={cn(
      'rounded-[2.5rem] border border-white/5 transition-all duration-500 overflow-hidden group',
      variant === 'glass' ? 'glass shadow-neon' : 'bg-bg-elevated/40 hover:bg-bg-elevated/60 shadow-card-elevated',
      className
    )}>
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between px-10 pt-8 pb-4">
          <div>
            {title && <h3 className="text-xl font-display font-bold text-white tracking-tight leading-tight">{title}</h3>}
            {subtitle && <p className="text-sm text-text-secondary mt-1 font-medium">{subtitle}</p>}
          </div>
          {action && <div className="animate-in fade-in slide-in-from-right-4 duration-700">{action}</div>}
        </div>
      )}
      <div className={cn(noPadding ? '' : 'px-10 pb-10 pt-4')}>
        {children}
      </div>
    </div>
  );
};

export default Card;
