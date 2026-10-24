import React, { useState } from 'react';
import {
  User,
  Globe,
  Database,
  Server,
  Cloud,
  Check,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CURRENCIES } from '../utils/currency';
import { formatDate } from '../utils/formatters';

export const SettingsPage = () => {
  const { user, currency, updateCurrency, logout } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState(currency || 'USD');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCurrencySave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateCurrency(selectedCurrency);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update currency preference.');
    } finally {
      setSaving(false);
    }
  };

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin + '/api';

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings & Preferences</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your account profile, display currency, and deployment connections
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-brand-600" />
          <span>User Profile</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Full Name</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{user?.fullName}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Email Address</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{user?.email}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Member Since</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Currency Preferences */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Globe className="w-4 h-4 text-brand-600" />
          <span>Currency & Regional Format</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Choose which currency symbol and format should be used across all charts, budgets, and statements.
        </p>

        <form onSubmit={handleCurrencySave} className="space-y-4 max-w-md">
          <div>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving || selectedCurrency === currency}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-500/20 transition disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Save Preference'}
            </button>

            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Updated successfully!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Deployment & Cloud Architecture */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Cloud className="w-4 h-4 text-brand-600" />
          <span>Cloud Infrastructure Status</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="font-bold text-slate-800">Backend API (Spring Boot on Render)</p>
                <p className="text-slate-400 font-mono text-[11px] truncate">{apiBaseUrl}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200">
              Configured
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-amber-500" />
              <div>
                <p className="font-bold text-slate-800">Database (MySQL on Aiven Cloud)</p>
                <p className="text-slate-400 text-[11px]">Cloud MySQL with SSL/TLS Encryption & Connection Pooling</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200">
              Aiven Ready
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-cyan-500" />
              <div>
                <p className="font-bold text-slate-800">Frontend Client (React on Vercel)</p>
                <p className="text-slate-400 text-[11px]">Vite SPA with Single-Page URL Rewrites (`vercel.json`)</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200">
              Vercel Ready
            </span>
          </div>
        </div>
      </div>

      {/* Account Logout */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Sign Out of Session</h4>
          <p className="text-xs text-slate-400">Clear JWT auth tokens from this browser</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-sm font-semibold transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

