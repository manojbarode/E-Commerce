import axios from "axios";

const sellerAxios = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

sellerAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("sellerToken");

  if (
    config.url?.includes("/seller/login") ||
    config.url?.includes("/seller/register")
  ) {
    delete config.headers.Authorization;
    return config;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default sellerAxios;
