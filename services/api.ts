import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// 1. Define the correct Production URL (Must include /api/v1)
const PROD_URL = "https://recall-st2b.onrender.com/api/v1";

// 2. Define Local URL for testing
const DEV_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5000/api/v1"
    : "http://localhost:5000/api/v1";

// 3. Toggle this variable to switch modes
const IS_PROD = true; // Set to TRUE to use Render backend

const api = axios.create({
  baseURL: IS_PROD ? PROD_URL : DEV_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add this interceptor to DEBUG exactly what URL is failing
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = token;
  }

  // LOG THE URL to your terminal so you can see if it's correct
  console.log(
    `[Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
  );

  return config;
});

export default api;
