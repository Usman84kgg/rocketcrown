import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  balance: number;
  avatar_url?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loginTelegram: (initData: string) => Promise<void>;
  loginWeb: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),

  loginTelegram: async (initData) => {
    const { data } = await axios.post('/api/auth/telegram', { initData });
    localStorage.setItem('token', data.token);
    set({ token: data.token, user: data.user });
  },

  loginWeb: async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    set({ token: data.token, user: data.user });
  },

  checkAuth: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const { data } = await axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      set({ user: data.user, token });
    } catch {
      localStorage.removeItem('token');
      set({ token: null, user: null });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));