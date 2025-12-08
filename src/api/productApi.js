import axios from "axios";
import axiosInstance from "./axiosConfig";

export const ProductAdd = async (productData, sellerId) => {
  try {
    const response = await axiosInstance.post(
      "/product/add-product",
      productData,
      {
        headers: {
          sellerId: sellerId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error.response?.data || error.message);
    throw error;
  }
};


export const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Ecommerce");

    const cloudName = "djbgoanwn";
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const res = await axios.post(url, formData);
    return res.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error.response?.data || error.message);
    throw error;
  }
};


export const uploadMultipleToCloudinary = async (files) => {
  try {
    const urls = await Promise.all(files.map(file => uploadToCloudinary(file)));
    return urls;
  } catch (error) {
    console.error("Multiple Cloudinary upload error:", error);
    throw error;
  }
};


export const ShowProduct = async () => {
  try {
    const response = await axiosInstance.get("/products/show");
    return response.data; // poora object return ho raha
  } catch (error) {
    console.error("API ERROR:", error);
    return { data: [] }; // fail-safe
  }
};


export const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error.response?.data || error.message);
    throw error;
  }
};
