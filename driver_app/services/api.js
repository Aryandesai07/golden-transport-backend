import axios from "axios";

// =====================================
// RAILWAY BACKEND URL
// =====================================
const BASE_URL = "https://golden-transport-backend-production.up.railway.app";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// =====================================
// REQUEST LOGGER
// =====================================
API.interceptors.request.use(
  (config) => {
    console.log("➡️ API:", `${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================
// RESPONSE LOGGER
// =====================================
API.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.data);
    return response;
  },
  (error) => {
    console.log(
      "❌ API Error:",
      error?.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default API;