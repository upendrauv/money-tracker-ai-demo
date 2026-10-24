import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Target, Plus, AlertCircle, CheckCircle, Trash2, Calendar } from 'lucide-react';
import { budgetApi } from '../api/budgetApi';
import { useAuth } from '../context/AuthContext';
import { CategoryBadge } from '../components/CategoryBadge';
import { BudgetModal } from '../components/BudgetModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { formatCurrency } from '../utils/currency';

export const BudgetsPage = () => {
  const { currency } = useAuth();
  const { refreshTrigger } = useOutletContext() || {};

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const data = await budgetApi.getBudgets(selectedMonth, selectedYear);
      setBudgets(data || []);
    } catch (err) {
      console.error('Error fetching budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear, refreshTrigger]);

  const handleSetBudget = async (formData) => {
    await budgetApi.setBudget(formData);
    fetchBudgets();
  };

  const handleDeleteBudget = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await budgetApi.deleteBudget(deletingId);
      setDeletingId(null);
      fetchBudgets();
    } catch (err) {
      alert('Failed to delete budget.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculations for overall budget summary
  const totalBudgeted = budgets.reduce((acc, b) => acc + (parseFloat(b.budgetAmount) || 0), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + (parseFloat(b.spentAmount) || 0), 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const overallPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Category Budgets</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Set spending limits and keep your finances in check
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month / Year Picker */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-xl shadow-sm text-xs font-semibold text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December',
              ].map((m, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              {[2024, 2025, 2026, 2027].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition shadow-md shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Set Budget</span>
          </button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Total Budgeted
            </span>
            <p className="text-3xl font-extrabold mt-1">{formatCurrency(totalBudgeted, currency)}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Total Spent
            </span>
            <p className="text-3xl font-extrabold mt-1 text-rose-400">
              {formatCurrency(totalSpent, currency)}
            </p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Remaining
            </span>
            <p
              className={`text-3xl font-extrabold mt-1 ${
                totalRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatCurrency(totalRemaining, currency)}
            </p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span>Overall Monthly Budget Progress</span>
            <span className="font-bold">{overallPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallPercentage > 100
                  ? 'bg-rose-500'
                  : overallPercentage > 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-400 animate-pulse">
            Loading budgets...
          </div>
        ) : budgets.length > 0 ? (
          budgets.map((b) => {
            const isOver = b.overBudget;
            const pct = b.percentageSpent;
            let barColor = 'bg-emerald-500';
            if (pct >= 100) barColor = 'bg-rose-500';
            else if (pct >= 75) barColor = 'bg-amber-500';

            return (
              <div
                key={b.budgetId}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <CategoryBadge category={b.category} size="md" />
                    <button
                      onClick={() => setDeletingId(b.budgetId)}
                      title="Delete budget"
                      className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Spent</span>
                      <p className="text-xl font-bold text-slate-900">
                        {formatCurrency(b.spentAmount, currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400">Limit</span>
                      <p className="text-sm font-semibold text-slate-600">
                        {formatCurrency(b.budgetAmount, currency)}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {isOver ? (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    <span className={isOver ? 'text-rose-600 font-semibold' : 'text-slate-500'}>
                      {isOver
                        ? `Over by ${formatCurrency(Math.abs(b.remainingAmount), currency)}`
                        : `${formatCurrency(b.remainingAmount, currency)} left`}
                    </span>
                  </div>
                  <span className="font-bold text-slate-700">{pct.toFixed(0)}%</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-100">
            <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No budgets set for this month</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Setting budgets helps you plan and prevent unexpected overspending.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow transition"
            >
              + Create First Budget
            </button>
          </div>
        )}
      </div>

      {/* Budget Set Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSetBudget}
        currentMonth={selectedMonth}
        currentYear={selectedYear}
        currency={currency}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteBudget}
        isDeleting={isDeleting}
        title="Delete Budget"
        message="Are you sure you want to remove this budget limit?"
      />
    </div>
  );
};

