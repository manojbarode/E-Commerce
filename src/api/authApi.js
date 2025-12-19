import axiosInstance from "./axiosConfig";

/* ================= AUTH ================= */

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

export const fetchUserProfile = async (token) => {
  const response = await axiosInstance.get("/user/profile/me", {
  headers: { Authorization: `Bearer ${token}` }
  });
  console.log(response.data.data);
  return response.data.data;
};

export const profileImageUpload = async (imageUrl) => {
  const res = await axiosInstance.post(
    "/user/profile",
    { image: imageUrl } 
  );
  return res.data;
};


// ✅ JWT-based update (no userUid header)
export const updateProfile = async (data) => {
  const res = await axiosInstance.put("/user/profile", data);
  return res.data;
};

/* ================= ORDERS ================= */

export const productFetchedByUser = async (buyerUid) => {
  const res = await axiosInstance.get(`/orders/user/${buyerUid}`);
  return res.data.data.content;
};
