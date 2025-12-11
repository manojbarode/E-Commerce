import axiosInstance from "./axiosConfig";

const BASE_PATH = "address";

// Get all addresses for a userUid
export const getAddresses = async (userUid) => {
  const res = await axiosInstance.get(`${BASE_PATH}/${userUid}`);
  return res.data.data;
};

// Add new address for a userUid
export const addAddress = async (userUid, address) => {
  const res = await axiosInstance.post(`${BASE_PATH}/${userUid}`, address);
  return res.data.data;
};

// Update address by userUid and addressUid
export const updateAddress = async (userUid, addressUid, address) => {
  const res = await axiosInstance.put(`${BASE_PATH}/${userUid}/${addressUid}`, address);
  return res.data.data;
};

// Delete address by userUid and addressUid
export const deleteAddress = async (userUid, addressUid) => {
  const res = await axiosInstance.delete(`${BASE_PATH}/${userUid}/${addressUid}`);
  return res.data.data;
};
