import axiosInstance from "./axiosConfig";

export const addToCartApi = async (productUid, quantity, userUid) => {
  const response = await axiosInstance.post(`/cart/add`,{
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
    return response.data || { items: [] };
  } catch (err) {
    console.error("Fetch cart error:", err);
    throw err;
  }
};

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
};

export const fetchWishlistApi = async (userUid)=>{
  try
  {
    const response = await axiosInstance.get(`/wishlist`, {
        headers: { userUid },
      });
      return response.data.data;
  }
  catch(err){
    throw err;
  }
};

export const addwishlist = async (userUid, productUid) => {
  try {
    return await axiosInstance.post(
      `/wishlist`,
      null,
      {
        headers: {
          userUid: userUid,
          productUid: productUid
        }
      }
    );
  } catch (err) {
    console.error("Add wishlist error:", err);
    throw err;
  }
};

export const deleteWishlistProduct =async (userUid,productUid)=>{
  try {
      return await axiosInstance.delete(`/wishlist`, {
        headers: { userUid, productUid },
      });
  } catch (err) {
    console.error("no delete:", err);
    throw err;
  }

};
