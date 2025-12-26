
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
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file object");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Ecommerce");

    const cloudName = "djbgoanwn";
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const res = await axios.post(url, formData);

    return res.data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload ERROR FULL:", error.response?.data);
    console.error("Cloudinary Upload ERROR MESSAGE:", error.response?.data?.error?.message);
    throw error;
  }
};





export const uploadMultipleToCloudinary = async (files) => {
  try {
    if (!files || files.length === 0) return [];

    const uploads = Array.from(files).map(file =>
      uploadToCloudinary(file)
    );

    return await Promise.all(uploads);
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

export const getProductById = async (productUid) => {
  const response = await publicAxios.get(`/product/${productUid}`);
  return response.data.data; 
};


