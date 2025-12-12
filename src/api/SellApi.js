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

export const getSellerProducts = async () => {
  try {
    const sellerUid = localStorage.getItem("sellerUid");
    if (!sellerUid) {
      throw new Error("Seller ID not found.");
    }

    const res = await axiosInstance.get("/product/seller-id", {
      headers: {
        sellerId: sellerUid, // sellerUid is sent in the headers
      },
    });
    console.log(res.data.data);
    return res.data.data;

  } catch (err) {
    console.error("API error:", err);
    return [];
  }
};


export const updateProduct = async (productUid, sellerUid, productData) => {
  try {
    const res = await axiosInstance.put(
      "/product/update",
      productData,
      {
        headers: {
          "Product-Uid": productUid,
          "Seller-Uid": sellerUid,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Update API error:", err);
    throw err;
  }
};




export const deleteProduct = async (productId) => {
  try {
    const sellerId = localStorage.getItem("sellerUid");
    const res = await axiosInstance.delete(`/product/delete/${productId}`, {
      headers: {
        sellerId,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Delete API error:", err.response?.data || err.message);
    throw err;
  }
};
