// src/api/paymentApi.js
import axiosInstance from "./axiosConfig";
import adminInstance from "./services/adminApi";

export const getPaymentMethodsUser = async () => {
  try {
    const response = await axiosInstance.get(`/payment/methods`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch payment methods", error);
    throw error;
  }
};

export const getPaymentFieldsUser = async (methodId) => {
  try {
    const response = await axiosInstance.get(`/payment/methods/${methodId}/fields`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch payment fields", error);
    throw error;
  }
};
export const getPaymentMethodsAdmin = async () => {
  try {
    const response = await adminInstance.get(`/payment/methods`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch payment methods", error);
    throw error;
  }
};

export const getPaymentFieldsAdmin = async (methodId) => {
  try {
    const response = await adminInstance.get(`/payment/methods/${methodId}/fields`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch payment fields", error);
    throw error;
  }
};

export const updatePaymentMethod = async (methodId, paymentData) => {
  try {
    const response = await adminInstance.put(`/payment/methods/${methodId}`, paymentData);
    return response.data;
  } catch (error) {
    console.error("Failed to update payment method", error);
    throw error;
  }
};
export const deletePaymentMethod = async (methodId) => {
  try {
    const response = await adminInstance.delete(`/payment/methods/${methodId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete payment method", error);
    throw error;
  }
};

export const togglePaymentMethodStatus = async (methodId, isActive) => {
  try {
    const response = await adminInstance.patch(`/payment/methods/${methodId}/status`, {
      isActive
    });
    return response.data;
  } catch (error) {
    console.error("Failed to toggle payment method status", error);
    throw error;
  }
};

export const addPaymentMethod = async (methodData) => {
  try {
    const response = await adminInstance.post(`/payment/add`, methodData);
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
