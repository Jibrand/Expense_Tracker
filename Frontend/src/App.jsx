import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import BottomNav from './components/BottomNav';
import Dashboard from './screens/Dashboard';
import Transactions from './screens/Transactions';
import Categories from './screens/Categories';
import Settings from './screens/Settings';
import Stats from './screens/Stats';
import AddTransactionModal from './components/AddTransactionModal';
import ConfirmationDialog from './components/ConfirmDialog';
import SkeletonLoader from './components/Skeleton';
import { useAppContext } from './context/AppContext';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { deleteTransaction, loading: contextLoading } = useAppContext();

  useEffect(() => {
    // Keep minimum 1.2s loading to prevent flicker, but wait for context
    const timer = setTimeout(() => {
      if (!contextLoading) setIsLoading(false);
    }, 1200);
    
    if (!contextLoading) {
      const minTimer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(minTimer);
    }

    return () => clearTimeout(timer);
  }, [contextLoading]);

  const renderScreen = () => {
    if (showStats) return <Stats />;

    switch (activeTab) {
      case 'home':
        return <Dashboard
          onStatsClick={() => setShowStats(true)}
          onDeleteRequest={(id) => setDeleteId(id)}
          onViewAll={() => setActiveTab('transactions')}
        />;
      case 'transactions':
        return <Transactions onDeleteRequest={(id) => setDeleteId(id)} />;
      case 'categories':
        return <Categories />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onStatsClick={() => setShowStats(true)} />;
    }
  };

  if (isLoading) return <SkeletonLoader />;

  return (
    <div className="mobile-container">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-3 no-scrollbar mb-10">
        {showStats && (
          <button
            onClick={() => setShowStats(false)}
            className="sticky top-2 z-[40] mb-2 px-3 py-1 bg-white shadow-md rounded-full text-[10px] font-semibold text-primary active:scale-95 transition-all"
          >
            ← Back to Home
          </button>
        )}

        {renderScreen()}

        {/* Spacer for bottom nav */}
        <div className="h-28" />
      </div>

      {/* Static Bottom Navigation */}
      <BottomNav
        activeTab={showStats ? 'stats' : activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setShowStats(false);
        }}
        onAddClick={() => setIsModalOpen(true)}
      />

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          deleteTransaction(deleteId);
          setDeleteId(null);
        }}
        title="Delete Record"
        message="Are you sure you want to delete this transaction?"
      />
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <Toaster position="top-center" />
      <AppContent />
    </AppProvider>
  );
};

export default App;
