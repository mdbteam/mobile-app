import axios from "axios";
import { Platform } from "react-native";

function getBaseURL() {
  if (Platform.OS === "web") return "https://auth-service-1-8301.onrender.com";
  if (Platform.OS === "android") return "http://10.0.2.2:8000";
  return "http://192.168.1.17:8000";
}

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
});
