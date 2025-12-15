import axiosInstance from "./axiosConfig";

export const signupUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/user/signup", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/user/login", credentials);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const productFetchedByUser = async(UserUid)=>{
  try{
      const response = await axiosInstance.get(`/user/userUid/${UserUid}`);
      return response.data;
  }
  catch(error){
    throw error.response?.data || error.message;
  }
};