import React from 'react';

export const StatCard = ({ title, amount, subtitle, icon: Icon, colorClass, bgClass, badgeText, badgeColor }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`}>
          <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{amount}</h3>
        {badgeText && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
            {badgeText}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
};

