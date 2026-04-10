import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthLoading: true,
  setUser: (user) => set({ user }),
  setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
  clearUser: () => set({ user: null }),
}));
