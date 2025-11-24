import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// import { getBaseURL } from '../utils/api'; // (Opcional: Lo comentamos para ir a lo seguro)

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
// 🔥 CONFIGURACIÓN MANUAL DE LA URL
// ============================
// Opción A: Desarrollo Local (Tu PC)
// const API_URL = 'http://192.168.1.17:8000'; 

// Opción B: Producción (Render) - ¡USAMOS ESTA AHORA!
const API_URL = 'https://auth-service-1-8301.onrender.com';

// Aplicamos la configuración global a Axios
axios.defaults.baseURL = API_URL;

console.log("🌐 API BASE URL FIJADA EN:", API_URL);

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
        // Configurar el token por defecto para futuras peticiones
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        // Limpiar cabeceras y estado
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
          // Aseguramos que el token esté en la cabecera
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // 👇 AQUÍ ESTABA EL ERROR 404: Agregamos '/api' al inicio
          const { data } = await axios.get('/api/users/me');

          set({ user: data, isAuthenticated: true });
          console.log("✅ Sesión restaurada con éxito");
        } catch (error) {
          console.log("❌ Error restaurando sesión (Token vencido o ruta incorrecta):", error);
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