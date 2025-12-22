import axiosInstance from "./axiosConfig";
import { publicAxios } from "./publicApi";
import sellerAxios from "./sellerAxios";
import axios from "axios";

export const ProductAdd = async (productData) => {
  try {
    const response = await sellerAxios.post("/seller/add-product", productData);
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

    const res = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.secure_url;

  } catch (error) {
    console.error("Cloudinary Upload ERROR:", error.response?.data || error.message);
    throw error;
  }
};



export const uploadMultipleToCloudinary = async (files) => {
  try {
    const uploads = files.map((file) => uploadToCloudinary(file));
    const results = await Promise.all(uploads);
    return results;
  } catch (error) {
    console.error("Multiple Cloudinary upload error:", error);
    throw error;
  }
};


// Fetch paginated products (public, no token)
export const ShowProductPaginated = async (page = 0, size = 10) => {
  try {
    const response = await publicAxios.get(`/product/all/paginated?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    console.error('API ERROR:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error;
  }
};

// Fetch single product by UID (public, no token)
export const getProductById = async (productUid) => {
  try {
    const response = await publicAxios.get(`/product/${productUid}`);
    return response.data.data;
  } catch (error) {
    console.error("API ERROR:", error);
    return null;
  }
};

