import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(...inputs));

/**
 * Skeleton component for animated shimmer loading states.
 */
const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-bg-elevated/50 rounded-md",
        className
      )}
      {...props}
    />
  );
};

export default Skeleton;
