import { create } from 'zustand';

interface User {
  id: string;
  full_name: string;
  phone: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  setAuth: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
