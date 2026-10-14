'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';
import { CookieStorage } from '@/lib/utils/cookies';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token?: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  syncTokenFromCookie: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user, token) => {
        if (token) {
          CookieStorage.set('zahra_token', token, { days: 7 });
        }
        set({ user, token: token || null, isAuthenticated: true });
      },

      logout: () => {
        CookieStorage.remove('zahra_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updates) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...updates } } : state
        ),

      setLoading: (isLoading) => set({ isLoading }),

      syncTokenFromCookie: () => {
        const token = CookieStorage.get('zahra_token');
        if (token) {
          set({ token, isAuthenticated: true });
        }
      },
    }),
    { name: 'zahra-auth' }
  )
);
