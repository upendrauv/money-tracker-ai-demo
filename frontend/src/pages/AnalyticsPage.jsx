import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Layers,
} from 'lucide-react';
import { dashboardApi } from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';
import { IncomeExpenseBarChart } from '../components/Charts/IncomeExpenseBarChart';
import { CategoryPieChart } from '../components/Charts/CategoryPieChart';
import { formatCurrency } from '../utils/currency';

export const AnalyticsPage = () => {
  const { currency } = useAuth();
  const { refreshTrigger } = useOutletContext() || {};
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await dashboardApi.getSummary();
        setSummary(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [refreshTrigger]);

  if (loading && !summary) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 rounded-2xl" />
          <div className="h-80 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const activeCurrency = summary?.currency || currency;
  const trends = summary?.monthlyTrends || [];
  const categorySpends = summary?.categorySpendings || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          In-depth breakdown of your cash flows, top spending categories, and historical performance
        </p>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense History */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Historical Cash Flow</h3>
              <p className="text-xs text-slate-400">Monthly comparison over the last 6 months</p>
            </div>
          </div>
          <IncomeExpenseBarChart data={trends} currency={activeCurrency} />
        </div>

        {/* Category Expense Share */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PieChartIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Expense Allocation</h3>
              <p className="text-xs text-slate-400">Current month distribution across categories</p>
            </div>
          </div>
          <CategoryPieChart data={categorySpends} currency={activeCurrency} />
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Monthly Cash Flow Statement</h3>
          <p className="text-xs text-slate-400">Detailed financial summary month by month</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-6">Month</th>
                <th className="py-3 px-6 text-right">Income</th>
                <th className="py-3 px-6 text-right">Expenses</th>
                <th className="py-3 px-6 text-right">Net Savings</th>
                <th className="py-3 px-6 text-right">Savings Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {trends.map((row, idx) => {
                const inc = parseFloat(row.income) || 0;
                const exp = parseFloat(row.expense) || 0;
                const net = inc - exp;
                const rate = inc > 0 ? (net / inc) * 100 : 0;
                return (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-6 font-semibold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{row.monthName} {row.year}</span>
                    </td>
                    <td className="py-3.5 px-6 text-right text-emerald-600 font-semibold">
                      {formatCurrency(inc, activeCurrency)}
                    </td>
                    <td className="py-3.5 px-6 text-right text-rose-600 font-semibold">
                      {formatCurrency(exp, activeCurrency)}
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold">
                      <span className={net >= 0 ? 'text-slate-900' : 'text-rose-600'}>
                        {net >= 0 ? '+' : ''} {formatCurrency(net, activeCurrency)}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          rate >= 20
                            ? 'bg-emerald-100 text-emerald-800'
                            : rate > 0
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

