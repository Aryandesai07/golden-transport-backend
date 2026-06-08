import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.31.182:8000",
  timeout: 15000,
});

API.interceptors.request.use(
  (config) => {
    console.log(
      `${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;