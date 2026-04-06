import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../utils/constants';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-elevated border border-bg-border p-3 rounded-xl glass shadow-2xl">
        <p className="text-xs font-bold text-text-secondary uppercase mb-1">{payload[0].name}</p>
        <p className="text-sm font-bold text-accent">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const CategoryChart = ({ data }) => {
  return (
    <div className="h-[400px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={5}
            dataKey="total"
            nameKey="category"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            wrapperStyle={{ 
              paddingLeft: '20px', 
              fontSize: '12px', 
              fontWeight: '700', 
              textTransform: 'uppercase',
              color: '#8896a8' 
            }}
            formatter={(value, entry) => (
              <span className="text-text-secondary hover:text-text-primary transition-colors">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" style={{ left: '33%' }}>
        <p className="text-3xl font-display font-bold text-white leading-none">
          {data?.length || 0}
        </p>
        <p className="text-xs font-bold text-text-secondary uppercase tracking-tighter mt-1">
          Categories
        </p>
      </div>
    </div>
  );
};

export default CategoryChart;
