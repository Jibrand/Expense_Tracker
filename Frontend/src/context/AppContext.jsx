import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const INITIAL_CATEGORIES = [
  { id: '1', name: 'Grocery', icon: 'HiOutlineShoppingCart', color: '#4F46E5' },
  { id: '2', name: 'Food', icon: 'HiOutlineFastFood', color: '#F59E0B' },
  { id: '3', name: 'Salary', icon: 'HiOutlineBriefcase', color: '#10B981' },
  { id: '4', name: 'Reward', icon: 'HiOutlineGift', color: '#8B5CF6' },
  { id: '5', name: 'Bills', icon: 'HiOutlineDocumentText', color: '#EF4444' },
  { id: '6', name: 'Transport', icon: 'HiOutlineTruck', color: '#3B82F6' },
  { id: '7', name: 'Other', icon: 'HiOutlineSparkles', color: '#64748B' },
];

const COLORS_POOL = ['#4F46E5', '#22C55E', '#EF4444', '#F59E0B', '#8B5CF6', '#10B981', '#3B82F6', '#EC4899', '#06B6D4'];
const ICONS_POOL = ['HiOutlineTag', 'HiOutlineHome', 'HiOutlineLightBulb', 'HiOutlineUserGroup', 'HiOutlineStar', 'HiOutlineFire'];

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : { entryBy: 'Jibran' };
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: Date.now(),
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(recalculateBalances(updatedTransactions));
    toast.success('Record saved');
  };

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(recalculateBalances(updatedTransactions));
    toast.success('Record deleted');
  };

  const addCategory = (name) => {
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Exists');
      return;
    }
    const color = COLORS_POOL[Math.floor(Math.random() * COLORS_POOL.length)];
    const icon = ICONS_POOL[Math.floor(Math.random() * ICONS_POOL.length)];
    const newCategory = { id: uuidv4(), name, icon, color };
    setCategories([...categories, newCategory]);
    toast.success('Category added');
  };

  const recalculateBalances = (list) => {
    const sorted = [...list].sort((a, b) => {
      // Sort by date first
      const dA = new Date(a.date);
      const dB = new Date(b.date);
      if (dA - dB !== 0) return dA - dB;
      // Then by actual creation time to preserve sequence of entries
      return a.createdAt - b.createdAt;
    });

    let currentBalance = 0;
    return sorted.map(t => {
      currentBalance = currentBalance + (t.cashIn || 0) - (t.cashOut || 0);
      return { ...t, balance: currentBalance };
    });
  };

  const totals = transactions.reduce((acc, t) => {
    acc.cashIn += (t.cashIn || 0);
    acc.cashOut += (t.cashOut || 0);
    return acc;
  }, { cashIn: 0, cashOut: 0 });

  const currentBalance = totals.cashIn - totals.cashOut;

  const today = new Date().toISOString().split('T')[0];
  const todayTotals = transactions.filter(t => t.date === today).reduce((acc, t) => {
    acc.cashIn += (t.cashIn || 0);
    acc.cashOut += (t.cashOut || 0);
    return acc;
  }, { cashIn: 0, cashOut: 0 });

  return (
    <AppContext.Provider value={{
      transactions,
      categories,
      settings,
      setSettings,
      addTransaction,
      deleteTransaction,
      addCategory,
      totals: {
        ...totals,
        balance: currentBalance,
        todayCashIn: todayTotals.cashIn,
        todayCashOut: todayTotals.cashOut
      }
    }}>
      {children}
    </AppContext.Provider>
  );
};
