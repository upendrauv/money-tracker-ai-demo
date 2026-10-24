import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Plus,
  Edit2,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { transactionApi } from '../api/transactionApi';
import { categoryApi } from '../api/categoryApi';
import { useAuth } from '../context/AuthContext';
import { CategoryBadge } from '../components/CategoryBadge';
import { TransactionModal } from '../components/TransactionModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { formatCurrency } from '../utils/currency';
import { formatDate, formatPaymentMethod } from '../utils/formatters';
import { exportTransactionsToCsv } from '../utils/exportCsv';

export const TransactionsPage = () => {
  const { currency } = useAuth();
  const { refreshTrigger } = useOutletContext() || {};

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load categories for filter
  useEffect(() => {
    categoryApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 15,
        sortBy: 'date',
        direction: 'desc',
      };
      if (search.trim()) params.search = search.trim();
      if (type) params.type = type;
      if (categoryId) params.categoryId = categoryId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await transactionApi.getTransactions(params);
      setTransactions(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, type, categoryId, startDate, endDate, refreshTrigger]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchTransactions();
  };

  const handleResetFilters = () => {
    setSearch('');
    setType('');
    setCategoryId('');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  const handleSaveTransaction = async (formData) => {
    if (editingTransaction) {
      await transactionApi.updateTransaction(editingTransaction.id, formData);
    } else {
      await transactionApi.createTransaction(formData);
    }
    fetchTransactions();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await transactionApi.deleteTransaction(deletingId);
      setDeletingId(null);
      fetchTransactions();
    } catch (err) {
      alert('Failed to delete transaction.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    exportTransactionsToCsv(transactions, currency);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transactions</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            View, filter, and track all your income and expenses ({totalElements} total)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingTransaction(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition shadow-md shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition"
          >
            Search
          </button>
        </form>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Type Select */}
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(0);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
          >
            <option value="">All Types</option>
            <option value="INCOME">Income Only</option>
            <option value="EXPENSE">Expense Only</option>
          </select>

          {/* Category Select */}
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(0);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Start Date */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(0);
              }}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            />
          </div>

          {/* End Date */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(0);
              }}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            />
          </div>

          {(type || categoryId || startDate || endDate || search) && (
            <button
              onClick={handleResetFilters}
              className="text-brand-600 hover:text-brand-800 font-semibold underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm animate-pulse">
            Loading transactions...
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Title / Note</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {transactions.map((tx) => {
                  const isIncome = tx.type === 'INCOME';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        <div>{tx.title}</div>
                        {tx.notes && <div className="text-xs text-slate-400 font-normal">{tx.notes}</div>}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <CategoryBadge category={tx.category} />
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatPaymentMethod(tx.paymentMethod)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold whitespace-nowrap">
                        <span className={isIncome ? 'text-emerald-600' : 'text-slate-900'}>
                          {isIncome ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingTransaction(tx);
                              setIsModalOpen(true);
                            }}
                            title="Edit"
                            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingId(tx.id)}
                            title="Delete"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-sm">
            No transactions matching your criteria.
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Add / Edit Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTransaction}
        transaction={editingTransaction}
        currency={currency}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction record? This cannot be undone."
      />
    </div>
  );
};

