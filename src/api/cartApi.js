import axiosInstance from "./axiosConfig";

export const addToCartApi = async (productUid, quantity) => {
  const response = await axiosInstance.post("/cart", { productUid, quantity });
  return response.data;
};

export const fetchCartdata = async () => {
  const response = await axiosInstance.get("/cart");
  console.log("cart data"+response.data);
  return response.data?.data || null;
};

export const deleteCartItem = async (productUid) => {
  console.log("deleteCartItem called with:", productUid);
  try {
    const res = await axiosInstance.delete("/cart", {
      headers: { productUid }
    });
    console.log("Delete response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Delete cart error:", err.response || err);
    throw err;
  }
};




export const fetchWishlistApi = async () => {
  const response = await axiosInstance.get("/wishlist");
  return response.data.data;
};


export const addWishlist = async (productUid) => {
  return axiosInstance.post("/wishlist",null,
    {
      headers: {
        productUid: productUid
      }
    }
  );
};


export const deleteWishlistProduct = async (productUid) => {
  return axiosInstance.delete(`/wishlist`, {
    headers: { productUid },
  });
};
