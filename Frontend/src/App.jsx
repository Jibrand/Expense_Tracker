import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Dashboard from './screens/Dashboard';
import Transactions from './screens/Transactions';
import Categories from './screens/Categories';
import Settings from './screens/Settings';
import Stats from './screens/Stats';
import AddTransactionModal from './components/AddTransactionModal';
import ConfirmationDialog from './components/ConfirmDialog';
import SkeletonLoader from './components/Skeleton';
import Sidebar from './components/Sidebar';
import Login from './screens/Login';
import Register from './screens/Register';

// Stores
import { useAuthStore } from './store/useAuthStore';
import { useBookStore } from './store/useBookStore';
import { useCategoryStore } from './store/useCategoryStore';
import { useTransactionStore } from './store/useTransactionStore';

const AppContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editTransaction, setEditTransaction] = useState(null);
  const [authView, setAuthView] = useState('login');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Zustand State
  const { user, isAuthLoading, checkAuth } = useAuthStore();
  const { activeBookId, fetchInitialData, isLoading: bookLoading } = useBookStore();
  const { fetchCategories, isLoading: categoryLoading } = useCategoryStore();
  const { fetchTransactions, deleteTransaction, isLoading: transactionLoading } = useTransactionStore();

  // Initial Auth Check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Initial Data Fetch
  useEffect(() => {
    if (user) {
      fetchInitialData();
      fetchCategories();
    }
  }, [user, fetchInitialData, fetchCategories]);

  // Fetch Transactions on active book change
  useEffect(() => {
    if (user && activeBookId) {
      fetchTransactions(activeBookId);
    }
  }, [user, activeBookId, fetchTransactions]);

  const handleAddClick = () => {
    setEditTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditRequest = (transaction) => {
    setEditTransaction(transaction);
    setIsModalOpen(true);
  };

  // While checking auth, or initial data loading is happening, show Skeleton
  const isGlobalLoading = isAuthLoading || (user && (bookLoading || categoryLoading || transactionLoading));

  if (isGlobalLoading) return <SkeletonLoader />;

  if (!user) {
    return authView === 'login'
      ? <Login onToggle={() => setAuthView('register')} />
      : <Register onToggle={() => setAuthView('login')} />;
  }

  const isStatsPage = location.pathname === '/stats';

  return (
    <>
      {/* Desktop & Mobile Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="mobile-container">
        {/* Main Content Area */}
        <div className="main-content-wrapper no-scrollbar overflow-y-auto relative">
          <div className="dashboard-container">
            {isStatsPage && (
              <button
                onClick={() => navigate('/')}
                className="sticky top-2 z-[40] mb-2 px-3 py-1 bg-white shadow-md rounded-full text-[10px] font-semibold text-primary active:scale-95 transition-all lg:hidden"
              >
                ← Back to Home
              </button>
            )}

            <Routes>
              <Route path="/" element={
                <Dashboard
                  onMenuClick={() => setIsMobileSidebarOpen(true)}
                  onAddClick={handleAddClick}
                  onEditRequest={handleEditRequest}
                  onStatsClick={() => navigate('/stats')}
                  onDeleteRequest={(id) => setDeleteId(id)}
                  onViewAll={() => navigate('/transactions')}
                />
              } />
              <Route path="/transactions" element={
                <Transactions
                  onMenuClick={() => setIsMobileSidebarOpen(true)}
                  onEditRequest={handleEditRequest}
                  onDeleteRequest={(id) => setDeleteId(id)}
                />
              } />
              <Route path="/categories" element={<Categories onMenuClick={() => setIsMobileSidebarOpen(true)} />} />
              <Route path="/settings" element={<Settings onMenuClick={() => setIsMobileSidebarOpen(true)} />} />
              <Route path="/stats" element={<Stats onMenuClick={() => setIsMobileSidebarOpen(true)} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Spacer for bottom nav on mobile */}
            <div className="h-28 lg:h-10" />
          </div>
        </div>

        {/* Static Bottom Navigation - Mobile Only */}
        <div className="lg:hidden">
          <BottomNav
            onAddClick={() => setIsModalOpen(true)}
          />
        </div>

        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditTransaction(null);
          }}
          editData={editTransaction}
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
    </>
  );
};

const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <AppContent />
    </>
  );
};

export default App;
