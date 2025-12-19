import axiosInstance from "./axiosConfig";

const BASE_PATH = "/address";

export const getAddresses = async () => {
  const res = await axiosInstance.get(BASE_PATH);
  return res.data.data;
};

export const addAddress = async (address) => {
  const res = await axiosInstance.post(BASE_PATH, address);
  return res.data.data;
};

export const updateAddress = async (addressUid, address) => {
  const res = await axiosInstance.put(`${BASE_PATH}/${addressUid}`, address);
  return res.data.data;
};

export const deleteAddress = async (addressUid) => {
  const res = await axiosInstance.delete(`${BASE_PATH}/${addressUid}`);
  return res.data.data;
};
