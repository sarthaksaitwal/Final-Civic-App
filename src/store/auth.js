import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock user data
const mockUser = {
  id: '1',
  name: 'John Anderson',
  email: 'j.anderson@citycouncil.gov',
  role: 'Civic Administrator',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: async (username, password) => {
        // Mock authentication - accept any credentials for demo
        if (username && password) {
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
      setLoading: (loading) => set({ isLoading: loading }),
      initialize: () => {
        const state = get();
        if (state.user && state.isAuthenticated) {
          set({ isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'civic-auth',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initialize();
        }
      },
    }
  )
);
