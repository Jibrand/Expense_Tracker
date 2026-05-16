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
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './screens/Login';
import Register from './screens/Register';

import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

const AppContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authView, setAuthView] = useState('login');
  
  const { deleteTransaction, loading: contextLoading } = useAppContext();
  const { user, loading: authLoading } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => {
        if (!contextLoading) setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [authLoading, contextLoading]);

  if (authLoading || (user && isLoading)) return <SkeletonLoader />;

  if (!user) {
    return authView === 'login' 
      ? <Login onToggle={() => setAuthView('register')} /> 
      : <Register onToggle={() => setAuthView('login')} />;
  }

  const isStatsPage = location.pathname === '/stats';

  return (
    <div className="mobile-container">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-3 no-scrollbar mb-10">
        {isStatsPage && (
          <button
            onClick={() => navigate('/')}
            className="sticky top-2 z-[40] mb-2 px-3 py-1 bg-white shadow-md rounded-full text-[10px] font-semibold text-primary active:scale-95 transition-all"
          >
            ← Back to Home
          </button>
        )}

        <Routes>
          <Route path="/" element={
            <Dashboard
              onStatsClick={() => navigate('/stats')}
              onDeleteRequest={(id) => setDeleteId(id)}
              onViewAll={() => navigate('/transactions')}
            />
          } />
          <Route path="/transactions" element={<Transactions onDeleteRequest={(id) => setDeleteId(id)} />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Spacer for bottom nav */}
        <div className="h-28" />
      </div>

      {/* Static Bottom Navigation */}
      <BottomNav
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
    <AuthProvider>
      <AppProvider>
        <Toaster position="top-center" />
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
