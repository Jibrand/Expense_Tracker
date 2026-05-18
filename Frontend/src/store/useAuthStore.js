import { create } from 'zustand';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthLoading: true,

  checkAuth: async () => {
    try {
      set({ isAuthLoading: true });
      const user = await authApi.checkAuth();
      set({ user, isAuthLoading: false });
    } catch (error) {
      set({ user: null, isAuthLoading: false });
    }
  },

  login: async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      set({ user: data.user });
      toast.success('Welcome back!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  },

  register: async (name, email, password, bookName) => {
    try {
      await authApi.register(name, email, password, bookName);
      toast.success('Registration successful! Please login.');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
      set({ user: null });
      toast.success('Logged out');
    } catch (error) {
      toast.error('Logout failed');
    }
  },
}));
