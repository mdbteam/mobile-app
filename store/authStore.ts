import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getBaseURL } from '../utils/api'; // ⭐ AUTODETECCIÓN DE PLATAFORMA

export interface User {
  id: string;
  nombres: string;
  primer_apellido: string;
  segundo_apellido: string | null;
  rut: string;
  correo: string;
  direccion: string | null;
  rol: string;
  foto_url: string | null;
  genero: string | null;
  fecha_nacimiento: string | null;
  telefono?: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

// ============================
// 🔥 CONFIG AXIOS BASE URL
// ============================
const API_URL = getBaseURL();
axios.defaults.baseURL = API_URL;

console.log("🌐 API BASE URL:", API_URL);

// ============================
// 🔥 ZUSTAND AUTH STORE
// ============================
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        delete axios.defaults.headers.common['Authorization'];
        set({ token: null, user: null, isAuthenticated: false });
        AsyncStorage.removeItem('auth-storage');
      },

      setUser: (user: User) => {
        set({ user });
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) return;

        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // ⭐ Cambié "/api/users/me" → "/users/me" según tu API real
          const { data } = await axios.get('/users/me');

          set({ user: data, isAuthenticated: true });
        } catch (error) {
          console.log("Error auth", error);
          get().logout();
        } 
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
