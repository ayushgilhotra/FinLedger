import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatCurrency, formatMonth } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-elevated border border-bg-border p-4 rounded-xl shadow-2xl glass">
        <p className="text-sm font-bold text-text-primary mb-2 uppercase tracking-wider">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-8">
              <span className="text-xs font-medium text-text-secondary">{entry.name}:</span>
              <span className="text-sm font-bold" style={{ color: entry.color }}>
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const TrendChart = ({ data }) => {
  const chartData = data?.map(item => ({
    ...item,
    formattedMonth: formatMonth(item.month)
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d4a0" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00d4a0" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff4d6d" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ff4d6d" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#161d2e" 
          />
          <XAxis 
            dataKey="formattedMonth" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#4a5568', fontSize: 12, fontWeight: 600 }}
            dy={15}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#4a5568', fontSize: 12, fontWeight: 600 }}
            tickFormatter={(val) => `₹${val >= 1000 ? (val/1000).toFixed(0)+'k' : val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}
          />
          <Area
            name="Income"
            type="monotone"
            dataKey="income"
            stroke="#00d4a0"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorIncome)"
          />
          <Area
            name="Expenses"
            type="monotone"
            dataKey="expenses"
            stroke="#ff4d6d"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorExpenses)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
