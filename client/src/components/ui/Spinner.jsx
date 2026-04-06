import { cn } from '../../utils/cn';
import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(...inputs));

const Spinner = ({ 
  size = 'md', 
  label, 
  className 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-accent", sizes[size])} />
      {label && <p className="text-sm font-medium text-text-secondary">{label}</p>}
    </div>
  );
};

export default Spinner;
