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