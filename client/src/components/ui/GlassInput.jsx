import { cn } from '../../utils/cn';
import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(...inputs));

/**
 * GlassInput component with high-contrast, translucent design.
 * 
 * @param {string} label - Input label.
 * @param {React.ReactNode} icon - Leading icon component.
 * @param {React.ReactNode} suffix - Trailing content (e.g., password toggle).
 * @param {string} error - Error message string.
 */
const GlassInput = ({ label, icon: Icon, suffix, error, className, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn("space-y-1.5 group", className)}>
      {label && (
        <label className={cn(
          "text-[0.75rem] font-bold uppercase tracking-[0.08em] ml-1 transition-colors",
          isFocused ? "text-accent-teal" : "text-text-secondary"
        )}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
            isFocused ? "text-accent-teal" : "text-text-dim"
          )}>
            <Icon size={18} />
          </div>
        )}
        
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            "w-full h-11 bg-bg-base border border-bg-border text-text-primary text-sm px-4 rounded-btn transition-all duration-200 outline-none placeholder:text-text-dim/50",
            Icon && "pl-11",
            suffix && "pr-11",
            isFocused && "border-accent-teal/60 ring-2 ring-accent-teal/10 bg-bg-surface",
            error && "border-accent-red/50 ring-2 ring-accent-red/10"
          )}
        />

        {suffix && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-accent-teal transition-colors cursor-pointer">
            {suffix}
          </div>
        )}
      </div>

      {error && (
        <p className="text-[0.65rem] font-bold text-accent-red/80 ml-1 uppercase tracking-wider animate-in fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default GlassInput;
