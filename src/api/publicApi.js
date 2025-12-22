import axios from "axios";

const BASE_URL = "http://localhost:8081/api";

export const publicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
