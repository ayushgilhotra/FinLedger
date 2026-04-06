import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * StatCard component for hero metrics in the FinLedger 'command center' layout.
 * 
 * @param {string} label - The label of the metric (uppercase caption).
 * @param {number} value - The numerical value to display.
 * @param {string} delta - Delta text (e.g., "+12.4% this month").
 * @param {boolean} isNegative - Whether the delta is negative/downward.
 * @param {React.ReactNode} icon - Lucide icon component.
 * @param {string} variant - 'teal', 'blue', 'green', 'red', 'amber'.
 * @param {boolean} isHero - Whether to add the teal top border gradient.
 * @param {boolean} isCurrency - Whether to format the value as currency.
 */
const StatCard = ({ 
  label, 
  value, 
  delta, 
  isNegative, 
  icon: Icon, 
  variant = 'teal', 
  isHero = false,
  isCurrency = true
}) => {
  const animatedValue = useCountUp(value);
  
  const variantColors = {
    teal: 'text-accent-teal',
    blue: 'text-accent-blue',
    green: 'text-accent-green',
    red: 'text-accent-red',
    amber: 'text-accent-amber',
  };

  return (
    <div className={`relative overflow-hidden group p-6 rounded-lg border border-bg-border bg-gradient-card hover-lift ${isHero ? 'border-t-accent-teal/50' : ''}`}>
      {/* Hero Gradient Top Border */}
      {isHero && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-teal" />
      )}
      
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-accent-teal/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-full bg-white/5 ${variantColors[variant]}`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        
        {delta && (
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isNegative ? 'bg-accent-red/10 text-accent-red' : 'bg-accent-green/10 text-accent-green'}`}>
            {isNegative ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
            {delta}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">{label}</p>
        <h3 className="text-3xl font-bold tracking-tight text-text-primary mono-data leading-none">
          {isCurrency ? formatCurrency(animatedValue) : animatedValue.toLocaleString()}
        </h3>
      </div>
    </div>
  );
};

export default StatCard;
