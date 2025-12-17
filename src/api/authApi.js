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

export const productFetchedByUser = async (buyerUid) => {
  try {
    const response = await axiosInstance.get(`/orders/user/${buyerUid}`);
    return response.data.data.content;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const profileImageUpload = async (imageUrl, userUid) => {
  try {
    const response = await axiosInstance.post(
      `/user/profile/${userUid}`,
      { image: imageUrl },
      {
        headers: {
          "userUid": userUid,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Profile image upload error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const fetchProfileFromApi = async (userUid) => {
  try {
    const response = await axiosInstance.get(`/user/profile`, {
      headers: { "userUid": userUid },
    });
    return response;
  } catch (error) {
    console.error("Fetch profile error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
export const updateProfile = async (userUid, data) => {
  try {
    const response = await axiosInstance.put(
      `/user/profile/${userUid}`,
      data,
      { headers: { "userUid": userUid } }
    );
    return response;
  } catch (error) {
    console.error("Update profile error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};


