import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const { isAuthenticated, checkAuth } = useAuthStore(); // Token no es necesario aquí

  useEffect(() => {
    checkAuth();
  }, []);

  // Si está autenticado, va a los TABS (Home)
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />; // <--- ¡DESCOMENTADO Y FUNCIONANDO!
  }

  // Si no, va al Login
  return <Redirect href="/login" />;
}