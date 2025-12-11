import axiosInstance from "./axiosConfig";

export const ProductAdd = async (productData) => {
  try {
    const sellerUid = localStorage.getItem("sellerUid");
    if (!sellerUid) {
      throw new Error("Seller UID not found. Please login again.");
    }

    const response = await axiosInstance.post(
      "/product/add-product",
      productData,
      {
        headers: {
          sellerId: sellerUid,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "ADD PRODUCT ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};



export const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // must be "file"
    formData.append("upload_preset", "Ecommerce"); // unsigned preset

    const cloudName = "djbgoanwn";
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const res = await axiosInstance.post(url, formData, {
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

export const ShowProduct = async () => {
  try {
    const response = await axiosInstance.get("/product/all");
    return response.data.data;
  } catch (error) {
    console.error("API ERROR:", error);
    return [];
  }
};

export const getProductById = async (productUid) => {
  try {
    const response = await axiosInstance.get(`/product/${productUid}`);
    return response.data.data;
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error.response?.data || error.message);
    throw error;
  }
};
