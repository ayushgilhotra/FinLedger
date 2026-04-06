import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Button from './Button';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(...inputs));

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  maxWidth = 'max-w-lg' 
}) => {
  const onEsc = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onEsc);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', onEsc);
    };
  }, [isOpen, onEsc]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-bg-base/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Content */}
      <div className={cn(
        'relative bg-bg-surface border border-bg-border w-full rounded-2xl shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200 overflow-hidden',
        maxWidth
      )}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-bg-border px-6 py-4">
          <h2 className="text-xl font-semibold text-text-primary uppercase tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-bg-border bg-bg-base/30 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
