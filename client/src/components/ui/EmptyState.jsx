import React from 'react';
import { Ghost } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon = Ghost, 
  title, 
  description, 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="h-16 w-16 text-text-muted mb-4">
        <Icon size={64} strokeWidth={1} />
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary max-w-sm mb-8">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
};

export default EmptyState;
