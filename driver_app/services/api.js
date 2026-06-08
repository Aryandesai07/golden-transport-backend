import axios from "axios";

// 🌍 Railway Production Backend URL
const BASE_URL = "https://golden-transport-backend-production.up.railway.app";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Optional: Request interceptor (debugging help)
API.interceptors.request.use(
  (config) => {
    console.log("➡️ API Request:", config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Optional: Response interceptor (better error logs)
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("❌ API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;