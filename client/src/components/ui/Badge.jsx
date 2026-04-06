import React from 'react';
import { cn } from '../../utils/cn';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(...inputs));

/**
 * Badge component for roles, statuses, and transactional types.
 * 
 * @param {string} variant - 'teal', 'blue', 'purple', 'amber', 'red'.
 * @param {boolean} outline - Whether to use an outline style.
 */
const Badge = ({ children, variant = 'teal', outline = false, className }) => {
  const variants = {
    teal: "bg-accent-teal/10 text-accent-teal border-accent-teal/20",
    blue: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
    purple: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
    amber: "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
    red: "bg-accent-red/10 text-accent-red border-accent-red/20",
  };

  const outlineStyle = outline 
    ? "bg-transparent border" 
    : "border border-transparent";

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-widest",
      variants[variant],
      outlineStyle,
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
