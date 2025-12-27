import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8081/api";

const adminInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
adminInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
adminInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRole");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// Admin login
export const loginAdmin = async (credentials) => {
  const res = await adminInstance.post("/admin/login", credentials);
  const { token, role } = res.data.data;

  if (token) {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminRole", role);
  }

  return res.data.data;
};

export default adminInstance;
