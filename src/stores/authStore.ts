import { create } from 'zustand';
import { User, UserStatus } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  updateStatus: (status: UserStatus) => void;
  updateStats: (stats: Partial<User['stats']>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  initialized: false,

  setUser: (user) => set({ user, loading: false, error: null }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error, loading: false }),
  
  setInitialized: (initialized) => set({ initialized }),
  
  updateStatus: (status) =>
    set((state) => ({
      user: state.user ? { ...state.user, status } : null,
    })),
  
  updateStats: (stats) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            stats: { ...state.user.stats, ...stats },
          }
        : null,
    })),
  
  logout: () =>
    set({
      user: null,
      loading: false,
      error: null,
      initialized: false,
    }),
}));
