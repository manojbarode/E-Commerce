import axios from "axios";

const BASE_URL = "http://localhost:8081/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// In axiosInstance.js interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    console.log("Sending request to:", config.url);
    console.log("Token present:", !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header set");
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
