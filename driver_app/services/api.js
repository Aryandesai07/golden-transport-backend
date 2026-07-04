import axios from "axios";

// =====================================
// RAILWAY BACKEND URL
// =====================================
const BASE_URL =
  "https://golden-transport-backend-production.up.railway.app";

console.log("=================================");
console.log("🚀 API STARTING");
console.log("BASE URL:", BASE_URL);
console.log("=================================");

// =====================================
// AXIOS INSTANCE
// =====================================
const API = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

console.log("✅ AXIOS INSTANCE CREATED");

// =====================================
// REQUEST LOGGER
// =====================================
API.interceptors.request.use(
  async (config) => {
    console.log("=================================");
    console.log("➡️ REQUEST");
    console.log("METHOD :", config.method?.toUpperCase());
    console.log("URL    :", `${config.baseURL}${config.url}`);
    console.log("DATA   :", config.data);
    console.log("HEADERS:", config.headers);
    console.log("=================================");

    return config;
  },
  (error) => {
    console.log("❌ REQUEST ERROR");
    console.log(error);
    return Promise.reject(error);
  }
);

// =====================================
// RESPONSE LOGGER
// =====================================
API.interceptors.response.use(
  (response) => {
    console.log("=================================");
    console.log("✅ RESPONSE");
    console.log("STATUS :", response.status);
    console.log("URL    :", response.config.url);
    console.log("DATA   :", response.data);
    console.log("=================================");

    return response;
  },
  (error) => {
    console.log("=================================");
    console.log("❌ AXIOS ERROR");
    console.log("MESSAGE :", error.message);
    console.log("CODE    :", error.code);
    console.log("STATUS  :", error.response?.status);
    console.log("URL     :", error.config?.url);
    console.log("DATA    :", error.response?.data);

    if (error.request) {
      console.log("REQUEST EXISTS");
    }

    if (error.response) {
      console.log("RESPONSE EXISTS");
    }

    console.log("FULL ERROR:");
    console.log(error);
    console.log("=================================");

    return Promise.reject(error);
  }
);

export default API;