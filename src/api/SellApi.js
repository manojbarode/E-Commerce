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




export const getSellerStats = async (sellerUid) => {
  const res = await axiosInstance.get(`/seller/${sellerUid}/stats`);
  return res.data.data;
}


export const getMonthlySales = async (sellerUid) => {
  const res = await axiosInstance.get(`/seller/${sellerUid}/sales`);
  return res.data.data;   // 👈 unwrap
};

export const getCategoryStats = async (sellerUid) => {
  const res = await axiosInstance.get(`/seller/${sellerUid}/category-stats`);
  return res.data.data;
};


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
