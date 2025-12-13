import axiosInstance from "./axiosConfig";

export const createOrder = (orderData, paymentPublicRef) => {
  const url = paymentPublicRef
    ? `/orders?paymentPublicRef=${paymentPublicRef}`
    : `/orders`;

  return axiosInstance.post(url, orderData);
};
