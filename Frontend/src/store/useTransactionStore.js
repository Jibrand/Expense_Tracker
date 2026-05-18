import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { transactionApi } from '../api/transactionApi';
import { useUIStore } from './useUIStore';
import toast from 'react-hot-toast';

const normalizeDateToYYYYMMDD = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') {
    return new Date().toISOString().split('T')[0];
  }
  
  // Try to match YYYY-MM-DD or YYYY/MM/DD
  let match = dateStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (match) {
    const [_, y, m, d] = match;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  // Try to match DD/MM/YYYY or DD-MM-YYYY
  match = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (match) {
    const [_, d, m, y] = match;
    const dayVal = parseInt(d);
    const monthVal = parseInt(m);
    
    let day, month;
    if (dayVal > 12) {
      // Must be DD/MM/YYYY
      day = d.padStart(2, '0');
      month = m.padStart(2, '0');
    } else if (monthVal > 12) {
      // Must be MM/DD/YYYY
      day = m.padStart(2, '0');
      month = d.padStart(2, '0');
    } else {
      // Default to DD/MM/YYYY
      day = d.padStart(2, '0');
      month = m.padStart(2, '0');
    }
    return `${y}-${month}-${day}`;
  }

  // Fallback to standard Date formatting if possible
  try {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
  } catch (e) {}

  return dateStr;
};

const parseDateStringToMs = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return 0;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [_, y, m, d] = match;
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).getTime();
  }
  const parsed = new Date(dateStr).getTime();
  return isNaN(parsed) ? 0 : parsed;
};

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 0;
  let [_, hours, minutes, ampm] = match;
  hours = parseInt(hours);
  minutes = parseInt(minutes);
  if (ampm) {
    if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
  }
  return hours * 60 + minutes;
};

const recalculateBalances = (list) => {
  // 1. Normalize all dates in the list so sorting and calculations are perfectly uniform
  const normalizedList = list.map(t => ({
    ...t,
    date: normalizeDateToYYYYMMDD(t.date)
  }));

  // 2. Sort chronologically (oldest first) so running balance compiles correctly
  const sorted = [...normalizedList].sort((a, b) => {
    const timeA = parseDateStringToMs(a.date);
    const timeB = parseDateStringToMs(b.date);
    if (timeA !== timeB) return timeA - timeB;
    
    const minA = parseTimeToMinutes(a.time);
    const minB = parseTimeToMinutes(b.time);
    if (minA !== minB) return minA - minB;

    const timeCreateA = new Date(a.createdAt || 0).getTime();
    const timeCreateB = new Date(b.createdAt || 0).getTime();
    return timeCreateA - timeCreateB;
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

  addBulkTransactions: async (list, bookId) => {
    const prevTransactions = get().transactions;
    const tempTransactions = list.map(t => {
      const tid = uuidv4();
      return {
        ...t,
        _id: tid,
        id: tid,
        bookId: t.bookId || bookId,
        createdAt: new Date().toISOString()
      };
    });

    // Optimistic Update
    const newTransactions = [...prevTransactions, ...tempTransactions];
    set({ transactions: recalculateBalances(newTransactions) });
    toast.success(`Importing ${list.length} records...`);

    // Background Sync
    useUIStore.getState().setSyncing(true);
    try {
      const saved = await transactionApi.createBulkTransactions(list.map(t => ({ ...t, bookId: t.bookId || bookId })));
      set((state) => {
        const nonTemp = state.transactions.filter(t => !tempTransactions.some(temp => temp._id === t._id || temp.id === t.id));
        return { transactions: recalculateBalances([...nonTemp, ...saved]) };
      });
      toast.success('Import completed successfully!');
    } catch (error) {
      // Rollback
      set({ transactions: prevTransactions });
      toast.error('Failed to import records. Rolling back.');
    } finally {
      useUIStore.getState().setSyncing(false);
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
