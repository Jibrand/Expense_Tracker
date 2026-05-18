import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isSyncing: false,
  setSyncing: (status) => set({ isSyncing: status }),
}));
