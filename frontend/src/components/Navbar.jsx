import React from 'react';
import { Menu, Plus, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCurrencySymbol } from '../utils/currency';

export const Navbar = ({ onOpenSidebar, onOpenAddTransaction }) => {
  const { user, currency } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-bold text-slate-900 hidden sm:block">
            Welcome back, {user?.fullName?.split(' ')[0] || 'User'} 👋
          </h2>
          <p className="text-xs text-slate-400 hidden sm:block">Here is your financial summary</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Currency Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>{currency} ({getCurrencySymbol(currency)})</span>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={onOpenAddTransaction}
          className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-1.5 rounded-xl font-semibold text-xs shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Transaction</span>
        </button>
      </div>
    </header>
  );
};

