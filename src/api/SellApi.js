import axiosInstance from "./axiosConfig";
export const registerSeller = async (data) => {
  try {
    const response = await axiosInstance.post("/seller/register", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const loginSeller = async (credentials) => {
  try {
    const response = await axiosInstance.post("/seller/login", credentials);
    return response;
  } 
  catch (error) {
    throw error;
  }
};

export const sellerDetails = async (sellerId, formData) => {
  try {
    const response = await axiosInstance.post(`/seller/${sellerId}/business`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};



// export const getSellerStats = async(sellerId)=>{
//   try
//   {
//     const response = await axiosInstance.get(`/seller/${sellerId}/stats`);
//     return response.data;
//   }
//   catch(error){
//     throw error.response?.data || error.message;
//   }
// };

// export const getMonthlySales =  async(sellerId)=>{
//   try
//   {
//     const response = await axiosInstance.get(`/seller/${sellerId}/sales`);
//     return response.data;
//   }
//   catch(error){
//     throw error.response?.data || error.message;
//   }
// };

// export const getCategoryStats = async(sellerId)=>{
//   try 
//   {
//     const res = await axiosInstance.get(`/seller/${sellerId}/category-stats`);
//     return res.data;
//   } 
//   catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// Get products by seller id

export const getSellerProducts = async (sellerId) => {
  try {
    const res = await axiosInstance.get(`/product/seller/${sellerId}`);
    return res.data.data;
  } catch (err) {
    console.error("API error:", err);
    return [];
  }
};
export const updateProduct = async (productId, productData) => {
  try {
    const res = await axiosInstance.put(`/product/update/${productId}`, productData);
    return res.data;
  } catch (err) {
    console.error("Update API error:", err);
    throw err;
  }
};

// ----------------------
// Delete product
export const deleteProduct = async (productId) => {
  try {
    const res = await axiosInstance.delete(`/product/delete/${productId}`);
    return res.data;
  } catch (err) {
    console.error("Delete API error:", err);
    throw err;
  }
};
