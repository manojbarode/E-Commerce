import axiosInstance from "./axiosConfig";

export const registerSeller = async (data) => {
  try {
    const response = await axiosInstance.post("/seller/register", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const loginSeller = async (credentials) => {
  try {
    const response = await axiosInstance.post("/seller/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};