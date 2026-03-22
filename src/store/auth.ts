import { create } from 'zustand';
import { UserVO, LoginDTO } from '../types/api';
import { userApi } from '../api';

interface AuthState {
  token: string | null;
  user: UserVO | null;
  isAuthenticated: boolean;
  login: (credentials: LoginDTO) => Promise<void>;
  logout: () => void;
  fetchUserInfo: () => Promise<void>;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('eden_token'),
  user: null,
  isAuthenticated: !!localStorage.getItem('eden_token'),

  setToken: (token: string) => {
    localStorage.setItem('eden_token', token);
    set({ token, isAuthenticated: true });
  },

  login: async (credentials) => {
    const data = await userApi.login(credentials);
    localStorage.setItem('eden_token', data.token);
    set({ token: data.token, user: data.user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('eden_token');
    set({ token: null, user: null, isAuthenticated: false });
    userApi.logout().catch(() => {}); // Fire and forget
  },

  fetchUserInfo: async () => {
    try {
      const user = await userApi.getInfo();
      set({ user, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('eden_token');
      set({ token: null, user: null, isAuthenticated: false });
    }
  },
}));
