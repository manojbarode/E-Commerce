import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8081/api";
const adminInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

adminInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    console.log("Sending request to:", config.url);
    console.log("Admin Token present:", !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header set for admin");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export const loginAdmin = async (credentials) => {
  const res = await adminInstance.post("/admin/login", credentials);

  const { token, role } = res.data.data;
  console.log("admin token"+token);
  if (token) {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminRole", role);
  }
  return res.data.data;
};


export default adminInstance;
