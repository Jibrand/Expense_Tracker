import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { transactionApi } from '../api/transactionApi';
import { useUIStore } from './useUIStore';
import toast from 'react-hot-toast';

const recalculateBalances = (list) => {
  const sorted = [...list].sort((a, b) => {
    const dA = new Date(a.date);
    const dB = new Date(b.date);
    if (dA - dB !== 0) return dA - dB;
    return new Date(a.createdAt || Date.now()).getTime() - new Date(b.createdAt || Date.now()).getTime();
  });

  let currentBalance = 0;
  const withBalances = sorted.map(t => {
    currentBalance = currentBalance + (t.cashIn || 0) - (t.cashOut || 0);
    return { ...t, balance: currentBalance };
  });

  return withBalances.reverse(); // Latest first
};

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  isLoading: false,

  fetchTransactions: async (bookId) => {
    if (!bookId) return;
    set({ isLoading: true });
    try {
      const data = await transactionApi.getTransactions(bookId);
      set({ transactions: recalculateBalances(data), isLoading: false });
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      set({ isLoading: false });
    }
  },

  addTransaction: async (data, bookId) => {
    const tempId = uuidv4();
    const tempTransaction = { 
      ...data, 
      _id: tempId, 
      id: tempId, 
      bookId, 
      createdAt: new Date().toISOString() 
    };

    // Optimistic Update
    const prevTransactions = get().transactions;
    const newTransactions = [...prevTransactions, tempTransaction];
    set({ transactions: recalculateBalances(newTransactions) });
    toast.success('Record saved');

    // Background Sync
    useUIStore.getState().setSyncing(true);
    try {
      const savedTransaction = await transactionApi.createTransaction({ ...data, bookId });
      // Replace temp with real
      set((state) => {
        const updated = state.transactions.map(t => t.id === tempId || t._id === tempId ? savedTransaction : t);
        return { transactions: recalculateBalances(updated) };
      });
    } catch (error) {
      // Rollback
      set({ transactions: prevTransactions });
      toast.error('Failed to save record. Rolling back.');
    } finally {
      useUIStore.getState().setSyncing(false);
    }
  },

  updateTransaction: async (id, data, bookId) => {
    const prevTransactions = get().transactions;
    const originalTransaction = prevTransactions.find(t => t._id === id || t.id === id);
    
    // Optimistic Update
    const optimisticTransaction = { ...originalTransaction, ...data };
    const newTransactions = prevTransactions.map(t => (t._id === id || t.id === id ? optimisticTransaction : t));
    set({ transactions: recalculateBalances(newTransactions) });
    toast.success('Record updated');

    // Background Sync
    useUIStore.getState().setSyncing(true);
    try {
      const savedTransaction = await transactionApi.updateTransaction(id, { ...data, bookId });
      set((state) => {
        const updated = state.transactions.map(t => t._id === id || t.id === id ? savedTransaction : t);
        return { transactions: recalculateBalances(updated) };
      });
    } catch (error) {
      // Rollback
      set({ transactions: prevTransactions });
      toast.error('Failed to update record. Rolling back.');
    } finally {
      useUIStore.getState().setSyncing(false);
    }
  },

  deleteTransaction: async (id) => {
    const prevTransactions = get().transactions;
    
    // Optimistic Update
    const newTransactions = prevTransactions.filter(t => t._id !== id && t.id !== id);
    set({ transactions: recalculateBalances(newTransactions) });
    toast.success('Record deleted');

    // Background Sync
    useUIStore.getState().setSyncing(true);
    try {
      await transactionApi.deleteTransaction(id);
    } catch (error) {
      // Rollback
      set({ transactions: prevTransactions });
      toast.error('Failed to delete record. Rolling back.');
    } finally {
      useUIStore.getState().setSyncing(false);
    }
  },
}));
