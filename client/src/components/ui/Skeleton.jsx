import { cn } from '../../utils/cn';
import React from 'react';


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
