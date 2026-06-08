import axios from "axios";

const API = axios.create({
  baseURL: "https://golden-transport-backend-production.up.railway.app",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;