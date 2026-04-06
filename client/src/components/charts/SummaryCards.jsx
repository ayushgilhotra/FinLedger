import { cn } from '../../utils/cn';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Activity,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import Card from '../ui/Card';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(...inputs));

const SummaryCards = ({ summary, loading }) => {
  const navigate = useNavigate();

  const renderValue = (card) => {
    if (card.isCount) {
      return (
        <span className="text-4xl font-display font-black text-white tabular-nums leading-none tracking-tighter">
          {card.val}
        </span>
      );
    }

    const formatted = formatCurrency(card.val);
    const symbol = formatted.substring(0, 1);
    const value = formatted.substring(1);

    return (
      <div className="flex items-baseline gap-1 group-hover:scale-105 transition-transform duration-500 origin-left">
        <span className="text-xl font-black text-text-muted/60 leading-none mr-1">{symbol}</span>
        <span className="text-4xl font-display font-black text-white tabular-nums leading-none tracking-tighter">
          {value}
        </span>
      </div>
    );
  };

  const cards = [
    { 
      label: 'Gross Network Inflow', 
      val: summary?.totalIncome || 0, 
      icon: TrendingUp, 
      color: 'text-income', 
      bg: 'bg-income/5',
      glow: 'shadow-[0_0_20px_rgba(0,212,160,0.15)]',
      path: '/transactions?type=income',
      trend: '+12.4%',
      trendIcon: ChevronUp
    },
    { 
      label: 'Operational Outflow', 
      val: summary?.totalExpenses || 0, 
      icon: TrendingDown, 
      color: 'text-expense', 
      bg: 'bg-expense/5',
      glow: 'shadow-[0_0_20px_rgba(255,77,109,0.15)]',
      path: '/transactions?type=expense',
      trend: '-2.1%',
      trendIcon: ChevronUp
    },
    { 
      label: 'Net Ledger Capital', 
      val: summary?.netBalance || 0, 
      icon: Wallet, 
      color: 'text-accent', 
      bg: 'bg-accent/5',
      glow: 'shadow-neon',
      path: '/transactions',
      trend: '+8.9%',
      trendIcon: ChevronUp
    },
    { 
      label: 'Total Node Transactions', 
      val: summary?.transactionCount || 0, 
      icon: Activity, 
      color: 'text-warning', 
      bg: 'bg-warning/5',
      glow: 'shadow-[0_0_20px_rgba(245,166,35,0.15)]',
      isCount: true,
      path: '/transactions',
      trend: '+156',
      trendIcon: ChevronUp
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 w-full animate-pulse rounded-[3rem] bg-bg-surface/50 border border-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {cards.map((card, i) => (
        <button
          key={i}
          onClick={() => navigate(card.path)}
          className="text-left w-full h-full transition-all duration-500 group"
        >
          <Card 
            noPadding 
            variant="glass" 
            className="h-full border-white/5 hover:border-accent/40 rounded-[3rem] transition-all duration-700 bg-bg-elevated/20"
          >
            <div className={cn(
              "absolute -top-20 -right-20 h-48 w-48 rounded-full blur-[100px] opacity-0 group-hover:opacity-30 transition-opacity duration-1000",
              card.bg.replace('bg-', 'bg-')
            )} />
            
            <div className="flex flex-col h-full justify-between p-10 space-y-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className={cn(
                  "p-4 rounded-3xl transition-all duration-500 group-hover:scale-110",
                  card.bg,
                  card.color,
                  card.glow
                )}>
                  <card.icon size={28} strokeWidth={3} />
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                  card.color === 'text-expense' ? 'bg-expense/10 text-expense' : 'bg-income/10 text-income'
                )}>
                  <card.trendIcon size={12} strokeWidth={3} />
                  {card.trend}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-80">{card.label}</p>
                <div className="flex justify-start pt-1">
                  {renderValue(card)}
                </div>
              </div>

              <div className="pt-2">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", card.color.replace('text-', 'bg-'))} 
                    style={{ width: '70%' }} 
                  />
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
