import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Percent,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { dashboardApi } from '../api/dashboardApi';
import { transactionApi } from '../api/transactionApi';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { CategoryBadge } from '../components/CategoryBadge';
import { IncomeExpenseBarChart } from '../components/Charts/IncomeExpenseBarChart';
import { CategoryPieChart } from '../components/Charts/CategoryPieChart';
import { TransactionModal } from '../components/TransactionModal';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/formatters';

export const DashboardPage = () => {
  const { currency } = useAuth();
  const { refreshTrigger } = useOutletContext() || {};
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardApi.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshTrigger]);

  const handleCreateTransaction = async (formData) => {
    await transactionApi.createTransaction(formData);
    fetchDashboardData();
  };

  if (loading && !summary) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-200 rounded-2xl" />
          <div className="h-80 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const activeCurrency = summary?.currency || currency;

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Net Balance"
          amount={formatCurrency(summary?.totalBalance, activeCurrency)}
          subtitle="All-time accumulated savings"
          icon={Wallet}
          colorClass="text-brand-600"
          bgClass="bg-brand-50"
        />
        <StatCard
          title="Monthly Income"
          amount={formatCurrency(summary?.monthlyIncome, activeCurrency)}
          subtitle="This calendar month"
          icon={TrendingUp}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
          badgeText="Active"
          badgeColor="bg-emerald-100 text-emerald-800"
        />
        <StatCard
          title="Monthly Expense"
          amount={formatCurrency(summary?.monthlyExpense, activeCurrency)}
          subtitle="This calendar month"
          icon={TrendingDown}
          colorClass="text-rose-600"
          bgClass="bg-rose-50"
          badgeText="Spent"
          badgeColor="bg-rose-100 text-rose-800"
        />
        <StatCard
          title="Savings Rate"
          amount={`${summary?.savingsRate || 0}%`}
          subtitle="Income retained after expenses"
          icon={Percent}
          colorClass="text-indigo-600"
          bgClass="bg-indigo-50"
          badgeText="Goal: 20%+"
          badgeColor="bg-indigo-100 text-indigo-800"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Trends (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Income vs Expenses</h3>
              <p className="text-xs text-slate-400">Monthly cash flow over the last 6 months</p>
            </div>
          </div>
          <IncomeExpenseBarChart data={summary?.monthlyTrends} currency={activeCurrency} />
        </div>

        {/* Category Breakdown (1 col) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Spending by Category</h3>
            <p className="text-xs text-slate-400 mb-4">Breakdown for this month</p>
            <CategoryPieChart data={summary?.categorySpendings} currency={activeCurrency} />
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              to="/analytics"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center justify-between group"
            >
              <span>View full financial report</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-400">Your latest transactions across all accounts</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
            <Link
              to="/transactions"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {summary?.recentTransactions && summary.recentTransactions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {summary.recentTransactions.map((tx) => {
              const isIncome = tx.type === 'INCOME';
              return (
                <div
                  key={tx.id}
                  className="py-3.5 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-xl transition"
                >
                  <div className="flex items-center gap-3">
                    <CategoryBadge category={tx.category} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{tx.title}</p>
                      <p className="text-xs text-slate-400">{formatDate(tx.date)}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-sm font-bold ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(tx.amount, activeCurrency)}
                    </span>
                    <p className="text-[11px] text-slate-400">{tx.paymentMethod}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 text-sm">
            <p>No transactions found. Click "+ Add" to create your first transaction!</p>
          </div>
        )}
      </div>

      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateTransaction}
        currency={activeCurrency}
      />
    </div>
  );
};

