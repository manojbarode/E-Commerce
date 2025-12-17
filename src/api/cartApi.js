import axiosInstance from "./axiosConfig";

export const addToCartApi = async (productUid, quantity, userUid) => {
  const response = await axiosInstance.post(
    `/cart/add`,
    {
      productUid,
      quantity,
    },
    {
      headers: {
        userUid: userUid,
      },
    }
  );

  return response.data;
};


export const fetchCartdata = async (userUid) => {
  try {
    const response = await axiosInstance.get("/cart/my-cart", {
      headers: { userUid: userUid }
    });
    return response.data;
  } catch (err) {
    console.error("Fetch cart error:", err);
    throw err;
  }
};
