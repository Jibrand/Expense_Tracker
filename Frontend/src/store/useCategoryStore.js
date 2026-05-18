import { create } from 'zustand';
import { categoryApi } from '../api/categoryApi';
import { useUIStore } from './useUIStore';
import toast from 'react-hot-toast';

const COLORS_POOL = ['#4F46E5', '#22C55E', '#EF4444', '#F59E0B', '#8B5CF6', '#10B981', '#3B82F6', '#EC4899', '#06B6D4'];
const ICONS_POOL = ['HiOutlineTag', 'HiOutlineHome', 'HiOutlineLightBulb', 'HiOutlineUserGroup', 'HiOutlineStar', 'HiOutlineFire'];

export const useCategoryStore = create((set, get) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const data = await categoryApi.getCategories();
      set({ categories: data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      set({ isLoading: false });
    }
  },

  addCategory: async (name) => {
    const categories = get().categories;
    if (categories.some(c => c.name.toLowerCase() === name.trim().toLowerCase())) {
      toast.error('Category with this name already exists');
      return;
    }

    const color = COLORS_POOL[Math.floor(Math.random() * COLORS_POOL.length)];
    const icon = ICONS_POOL[Math.floor(Math.random() * ICONS_POOL.length)];
    const newCategory = { name: name.trim(), icon, color };
    
    // Optimistic Update
    const tempId = Date.now().toString();
    const tempCategory = { ...newCategory, _id: tempId };
    
    set({ categories: [...categories, tempCategory] });
    toast.success('Category added');

    // Background Sync
    useUIStore.getState().setSyncing(true);
    try {
      const savedCategory = await categoryApi.createCategory(newCategory);
      set((state) => ({
        categories: state.categories.map(c => c._id === tempId ? savedCategory : c)
      }));
    } catch (error) {
      // Rollback
      set({ categories });
      const errorMsg = error?.response?.data?.message || 'Failed to add category';
      toast.error(errorMsg);
    } finally {
      useUIStore.getState().setSyncing(false);
    }
  },

  updateCategory: async (id, data) => {
    const categories = get().categories;
    const original = categories.find(c => c._id === id);
    
    if (data.name && categories.some(c => c._id !== id && c.name.toLowerCase() === data.name.trim().toLowerCase())) {
      toast.error('Category with this name already exists');
      return;
    }

    // Optimistic Update
    const updatedCategories = categories.map(c => c._id === id ? { ...c, ...data, name: data.name ? data.name.trim() : c.name } : c);
    set({ categories: updatedCategories });
    toast.success('Category updated');

    // Background Sync
    useUIStore.getState().setSyncing(true);
    try {
      const savedCategory = await categoryApi.updateCategory(id, {
        ...data,
        name: data.name ? data.name.trim() : undefined
      });
      set((state) => ({
        categories: state.categories.map(c => c._id === id ? savedCategory : c)
      }));
    } catch (error) {
      // Rollback
      set({ categories });
      const errorMsg = error?.response?.data?.message || 'Failed to update category';
      toast.error(errorMsg);
    } finally {
      useUIStore.getState().setSyncing(false);
    }
  },

  deleteCategory: async (id) => {
    const categories = get().categories;
    
    // Optimistic Update
    set({ categories: categories.filter(c => c._id !== id) });
    toast.success('Category deleted');

    // Background Sync
    useUIStore.getState().setSyncing(true);
    try {
      await categoryApi.deleteCategory(id);
    } catch (error) {
      // Rollback
      set({ categories });
      toast.error('Failed to delete category');
    } finally {
      useUIStore.getState().setSyncing(false);
    }
  },
}));
