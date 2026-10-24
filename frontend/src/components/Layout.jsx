import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { TransactionModal } from './TransactionModal';
import { transactionApi } from '../api/transactionApi';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { currency } = useAuth();

  const handleCreateTransaction = async (formData) => {
    await transactionApi.createTransaction(formData);
    // Trigger re-render across child pages
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenAddTransaction={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenAddTransaction={() => setIsAddModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ refreshTrigger, onTriggerRefresh: () => setRefreshTrigger((p) => p + 1) }} />
        </main>
      </div>

      {/* Global Add Transaction Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateTransaction}
        currency={currency}
      />
    </div>
  );
};

