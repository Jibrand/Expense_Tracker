import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api' 
  : 'https://expense-tracker-3fvx.vercel.app/api';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const COLORS_POOL = ['#4F46E5', '#22C55E', '#EF4444', '#F59E0B', '#8B5CF6', '#10B981', '#3B82F6', '#EC4899', '#06B6D4'];
const ICONS_POOL = ['HiOutlineTag', 'HiOutlineHome', 'HiOutlineLightBulb', 'HiOutlineUserGroup', 'HiOutlineStar', 'HiOutlineFire'];

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettingsState] = useState({ entryBy: 'User' });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Initial Fetch
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setTransactions([]);
        setCategories([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [transRes, catRes, setRes] = await Promise.all([
          axios.get(`${API_URL}/transactions`),
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/settings`)
        ]);

        setCategories(catRes.data);
        setTransactions(recalculateBalances(transRes.data));
        setSettingsState(setRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
    else {
      setTransactions([]);
      setCategories([]);
      setLoading(false);
    }
  }, [user]);

  const addTransaction = async (transaction) => {
    try {
      const res = await axios.post(`${API_URL}/transactions`, transaction);
      const updated = [...transactions, res.data];
      setTransactions(recalculateBalances(updated));
      toast.success('Record saved');
    } catch (error) {
      toast.error('Failed to save record');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      // Find the transaction ID in MongoDB (it might be _id)
      const t = transactions.find(t => t.id === id || t._id === id);
      const mongoId = t._id || t.id;
      
      await axios.delete(`${API_URL}/transactions/${mongoId}`);
      const updated = transactions.filter(t => t.id !== id && t._id !== id);
      setTransactions(recalculateBalances(updated));
      toast.success('Record deleted');
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  const addCategory = async (name) => {
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Exists');
      return;
    }
    const color = COLORS_POOL[Math.floor(Math.random() * COLORS_POOL.length)];
    const icon = ICONS_POOL[Math.floor(Math.random() * ICONS_POOL.length)];
    const newCategory = { name, icon, color };
    
    try {
      const res = await axios.post(`${API_URL}/categories`, newCategory);
      setCategories([...categories, res.data]);
      toast.success('Category added');
    } catch (error) {
      toast.error('Failed to add category');
    }
  };

  const setSettings = async (newSettings) => {
    try {
      const res = await axios.post(`${API_URL}/settings`, newSettings);
      setSettingsState(res.data);
      toast.success('Settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const recalculateBalances = (list) => {
    const sorted = [...list].sort((a, b) => {
      const dA = new Date(a.date);
      const dB = new Date(b.date);
      if (dA - dB !== 0) return dA - dB;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    let currentBalance = 0;
    const withBalances = sorted.map(t => {
      currentBalance = currentBalance + (t.cashIn || 0) - (t.cashOut || 0);
      return { ...t, balance: currentBalance };
    });

    return withBalances.reverse(); // Latest first
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
      loading,
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
