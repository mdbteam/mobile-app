import { Platform } from "react-native";

/**
 * Detecta la plataforma y devuelve la API correcta
 */
export function getBaseURL() {
  // 🌐 WEB → necesita CORS (Render)
  if (Platform.OS === "web") {
    return "https://auth-service-1-8301.onrender.com";
  }

  // 📱 Android emulator
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000";
  }

  // 📱 Android/iOS en dispositivo real (misma red que tu PC)
  return "http://192.168.1.17:8000"; // Cambia si tu IP cambia
}
