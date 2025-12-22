import sellerAxios from "./sellerAxios";
import axiosInstance from "./axiosConfig";

export const registerSeller = (data) =>
  sellerAxios.post("/seller/register", data);

export const loginSeller = (credentials) =>
  sellerAxios.post("/seller/login", credentials);


  export const sellerDetails = async (sellerId, formData) => {
    try {
      const response = await axiosInstance.post(`/seller/${sellerId}/business`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

export const getSellerStats = async (sellerUid) => {
  const res = await axiosInstance.get(`/seller/${sellerUid}/stats`);
  return res.data.data;
}


export const getMonthlySales = async (sellerUid) => {
  const res = await axiosInstance.get(`/seller/${sellerUid}/sales`);
  return res.data.data;
};

export const getCategoryStats = async (sellerUid) => {
  const res = await axiosInstance.get(`/seller/${sellerUid}/category-stats`);
  return res.data.data;
};


export const getSellerProducts = async (page = 0, size = 10) => {
  try {
    const res = await sellerAxios.get("/seller/seller-product", {
      params: { page, size }
    });
    return res.data.data;   
  } catch (err) {
    return { products: [], currentPage: 0, totalItems: 0, totalPages: 0 };
  }
};

export const updateProduct = async (productUid, productData) => {
  try {
    const res = await sellerAxios.put(
      "/seller/seller-productupdate",
      productData,
      {
        headers: {
          productUid: productUid,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Update API error:", err.response?.data || err.message);
    throw err;
  }
};


  export const deleteProduct = async (productUid) => {
    try {
      const res = await sellerAxios.delete(`/seller/seller-delete-Product`, {
        headers: {
          productUid,
        },
      });
      return res.data;
    } catch (err) {
      console.error("Delete API error:", err.response?.data || err.message);
      throw err;
    }
  };
