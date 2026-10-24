import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/currency';

export const CategoryPieChart = ({ data = [], currency = 'USD' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm">
        <span>No expense data for this month</span>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
          <p className="font-semibold text-slate-200">{item.categoryName}</p>
          <p className="text-slate-300">
            Amount: <span className="font-medium text-white">{formatCurrency(item.amount, currency)}</span>
          </p>
          <p className="text-brand-400 font-medium">{item.percentage?.toFixed(1)}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-center">
      <div className="w-full sm:w-1/2 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="categoryName"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#6366F1'} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown legend list */}
      <div className="w-full sm:w-1/2 space-y-2 max-h-56 overflow-y-auto pr-1">
        {data.slice(0, 5).map((entry, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color || '#6366F1' }}
              />
              <span className="text-slate-600 truncate">{entry.categoryName}</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-slate-900">
              <span>{formatCurrency(entry.amount, currency)}</span>
              <span className="text-slate-400 text-[11px] w-9 text-right">
                {entry.percentage?.toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

