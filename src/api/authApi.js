import axiosInstance from "./axiosConfig";

export const signupUser = async (userData) => {
  const res = await axiosInstance.post("/user/signup", userData);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await axiosInstance.post("/user/login", credentials);
  console.log(res.data.data);
  sessionStorage.setItem("token", res.data.data.token);
  return res.data.data;
};

export const fetchUserProfile = async () => {
  const response = await axiosInstance.get("/user/profile/me");
  return response.data.data;
};

export const profileImageUpload = async (imageUrl) => {
  const res = await axiosInstance.post(
    "/user/profile",
    { image: imageUrl } 
  );
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await axiosInstance.put("/user/profile", data);
  return res.data.data;
};

export const productFetchedByUser = async () => {
  const res = await axiosInstance.get(`/orders/buyer`);
  return res.data.data.content;
};
