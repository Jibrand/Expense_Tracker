import { create } from 'zustand';
import { bookApi, settingApi } from '../api/bookApi';
import { useUIStore } from './useUIStore';
import toast from 'react-hot-toast';

export const useBookStore = create((set, get) => ({
  books: [],
  activeBookId: null,
  settings: { entryBy: 'User' },
  isLoading: false,

  setActiveBookId: (id) => set({ activeBookId: id }),

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      const [books, settings] = await Promise.all([
        bookApi.getBooks(),
        settingApi.getSettings(),
      ]);
      
      const activeBookId = books.length > 0 ? books[0]._id : null;
      set({ books, settings, activeBookId, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch initial book data:', error);
      set({ isLoading: false });
    }
  },

  addBook: async (name) => {
    const books = get().books;
    if (books.some(b => b.name.toLowerCase() === name.trim().toLowerCase())) {
      toast.error('Book with this name already exists');
      return;
    }

    // Optimistic Update
    const tempId = Date.now().toString();
    const tempBook = { name: name.trim(), _id: tempId };
    
    set({ books: [...books, tempBook] });
    if (!get().activeBookId) set({ activeBookId: tempId });
    toast.success('Book created');

    // Background Sync
    useUIStore.getState().setSyncing(true);
    try {
      const savedBook = await bookApi.createBook(name.trim());
      set((state) => {
        const updatedBooks = state.books.map(b => b._id === tempId ? savedBook : b);
        let currentActive = state.activeBookId;
        if (currentActive === tempId) currentActive = savedBook._id;
        
        return { books: updatedBooks, activeBookId: currentActive };
      });
    } catch (error) {
      set({ books });
      if (get().activeBookId === tempId) set({ activeBookId: books[0]?._id || null });
      const errorMsg = error?.response?.data?.message || 'Failed to create book';
      toast.error(errorMsg);
    } finally {
      useUIStore.getState().setSyncing(false);
    }
  },

  deleteBook: async (id) => {
    const books = get().books;
    const activeBookId = get().activeBookId;

    // Optimistic Update
    const updatedBooks = books.filter(b => b._id !== id);
    set({ books: updatedBooks });
    if (activeBookId === id) {
      set({ activeBookId: updatedBooks[0]?._id || null });
    }
    toast.success('Book deleted');

    // Background Sync
    useUIStore.getState().setSyncing(true);
    try {
      await bookApi.deleteBook(id);
    } catch (error) {
      set({ books, activeBookId });
      toast.error('Failed to delete book');
    } finally {
      useUIStore.getState().setSyncing(false);
    }
  },

  setSettings: async (newSettings) => {
    const prevSettings = get().settings;
    
    // Optimistic Update
    set({ settings: newSettings });
    toast.success('Settings updated');

    // Background Sync
    useUIStore.getState().setSyncing(true);
    try {
      const savedSettings = await settingApi.updateSettings(newSettings);
      set({ settings: savedSettings });
    } catch (error) {
      set({ settings: prevSettings });
      toast.error('Failed to update settings');
    } finally {
      useUIStore.getState().setSyncing(false);
    }
  },
}));
