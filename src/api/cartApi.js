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

<<<<<<< HEAD
export const deleteCartItem = async (productUid) => {
  return axiosInstance.delete(`/cart`, {
    headers: { 'productUid': productUid }
  });
=======
export const deleteCartItem = async (userUid, productUid) => {
  console.log("deleteCartItem called with:", { userUid, productUid });
  try{
    const res = axiosInstance.delete(`/cart/remove/${productUid}`, {
      headers: { userUid }
    });
    console.log("Delete response:", res.data);
    return res.data;
  }
  catch(err) {
    console.error("Fetch cart error:", err);
    throw err;
  }
>>>>>>> 6baef87127ecba4452a9fffc7c14379d7d310060
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
