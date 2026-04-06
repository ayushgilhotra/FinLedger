import { cn } from '../../utils/cn';
import React from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(...inputs));

/**
 * Drawer component that slides in from the right.
 * 
 * @param {boolean} isOpen - Whether the drawer is visible.
 * @param {function} onClose - Function to close the drawer.
 * @param {string} title - Drawer header title.
 */
const Drawer = ({ isOpen, onClose, title, children, className }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-full max-w-[480px] bg-bg-surface border-l border-bg-border z-50 transform transition-transform duration-300 ease-out shadow-2xl",
        isOpen ? "translate-x-0" : "translate-x-full",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-bg-border">
            <h2 className="text-xl font-bold tracking-tight text-text-primary">{title}</h2>
            <button 
              onClick={onClose} 
              className="p-2 -mr-2 text-text-dim hover:text-accent-teal transition-colors rounded-full hover:bg-white/5"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 modern-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
