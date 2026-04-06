import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Activity 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import Card from '../ui/Card';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(...inputs));

const SummaryCards = ({ summary, loading }) => {
  const navigate = useNavigate();

  // Helper to split currency for baseline alignment control
  const renderValue = (card) => {
    if (card.isCount) {
      return (
        <span className="text-2xl font-display font-bold text-white tabular-nums leading-none tracking-tight">
          {card.val}
        </span>
      );
    }

    const formatted = formatCurrency(card.val);
    // Standard format is "₹49,44,835.00" -> split into symbol and digits
    const symbol = formatted.substring(0, 1);
    const value = formatted.substring(1);

    return (
      <div className="flex items-baseline gap-0.5 group-hover:scale-105 transition-transform duration-300 origin-left">
        <span className="text-lg font-bold text-text-muted/80 mr-0.5 leading-none self-end pb-0.5">{symbol}</span>
        <span className="text-2xl font-display font-bold text-white tabular-nums leading-none tracking-tight">
          {value}
        </span>
      </div>
    );
  };

  const cards = [
    { 
      label: 'Total Income', 
      val: summary?.totalIncome || 0, 
      icon: TrendingUp, 
      color: 'text-income', 
      bg: 'bg-income/10',
      path: '/transactions?type=income'
    },
    { 
      label: 'Total Expenses', 
      val: summary?.totalExpenses || 0, 
      icon: TrendingDown, 
      color: 'text-expense', 
      bg: 'bg-expense/10',
      path: '/transactions?type=expense'
    },
    { 
      label: 'Net Balance', 
      val: summary?.netBalance || 0, 
      icon: Wallet, 
      color: summary?.netBalance >= 0 ? 'text-income' : 'text-expense', 
      bg: 'bg-accent/10',
      path: '/transactions'
    },
    { 
      label: 'Transactions', 
      val: summary?.transactionCount || 0, 
      icon: Activity, 
      color: 'text-warning', 
      bg: 'bg-warning/10',
      isCount: true,
      path: '/transactions'
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 w-full animate-pulse rounded-xl bg-bg-surface border border-bg-border shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <button
          key={i}
          onClick={() => navigate(card.path)}
          className="text-left w-full h-full transition-all duration-300 group"
        >
          <Card className="h-full relative overflow-hidden border-bg-border/40 hover:border-accent/40 bg-bg-surface/50 hover:bg-bg-elevated transition-all duration-500 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className={cn(
              "absolute -top-12 -right-12 h-32 w-32 rounded-full blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700",
              card.bg
            )} />
            
            <div className="flex flex-col h-full justify-between p-1">
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "p-3 rounded-2xl transition-all duration-500 group-hover:rotate-6",
                  card.bg,
                  card.color
                )}>
                  <card.icon size={22} strokeWidth={2.5} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] leading-none mb-1.5 opacity-80">{card.label}</p>
                  <div className="flex justify-end">
                    {renderValue(card)}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-1 w-full bg-bg-base/50 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", card.color.replace('text-', 'bg-'))} 
                    style={{ width: loading ? '0%' : '65%' }} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-text-muted/60 uppercase tracking-widest">Efficiency</span>
                  <span className={cn("text-[10px] font-bold", card.color)}>+12.5%</span>
                </div>
              </div>
            </div>
          </Card>
        </button>
      ))}
    </div>
  );
};

export default SummaryCards;
