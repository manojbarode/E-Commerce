// src/api/paymentApi.js
import axiosInstance from "./axiosConfig";

export const getPaymentMethods = async () => {
  try {
    const response = await axiosInstance.get(`/payment/methods`);
    return response.data.data; // extract data array
  } catch (error) {
    console.error("Failed to fetch payment methods", error);
    throw error;
  }
};

export const getPaymentFields = async (methodId) => {
  try {
    const response = await axiosInstance.get(`/payment/methods/${methodId}/fields`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch payment fields", error);
    throw error;
  }
};

export const addPaymentMethod = async (methodData) => {
  try {
    const response = await axiosInstance.post(`/payment/add`, methodData);
    return response.data.data; 
  } catch (error) {
    console.error("Failed to add payment method", error);
    throw error;
  }
};

export const submitPayment = async (order) => {
  try {
    const response = await axiosInstance.post(`/payment/transaction`, order);
    console.log("submitform daa"+response.data.data);
    return response.data;
  } catch (error) {
    console.error("Payment submission failed", error);
    throw error;
  }
};
