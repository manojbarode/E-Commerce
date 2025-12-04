import axiosInstance from "./axiosConfig";

const BASE_PATH = "address";

export const getAddresses = async () => {
  const res = await axiosInstance.get(BASE_PATH);
  return res.data.data;
};

export const addAddress = async (address) => {
  const res = await axiosInstance.post(BASE_PATH, address);
  return res.data.data;
};

export const updateAddress = async (id, address) => {
  const res = await axiosInstance.put(`${BASE_PATH}/${id}`, address);
  return res.data.data;
};

export const deleteAddress = async (id) => {
  const res = await axiosInstance.delete(`${BASE_PATH}/${id}`);
  return res.data.data;
};
