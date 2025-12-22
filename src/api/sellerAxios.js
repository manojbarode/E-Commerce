import axios from "axios";

const sellerAxios = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

sellerAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("sellerToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default sellerAxios;
