import axiosInstance from "./axiosConfig";
import sellerAxios from "./sellerAxios";
const SellerOrdersService = {
  getSellerOrders: async (page = 0, size = 10) => {
    try {
      const response = await sellerAxios.get("/orders/seller", {
        params: { page, size },
      });

      const data = response?.data?.data;

      return {
        content: data?.content || [],
        totalPages: data?.totalPages || 0,
        totalElements: data?.totalElements || 0,
        number: data?.number || 0,
        size: data?.size || size,
      };
    } catch (error) {
      console.error("Error fetching seller orders", error);
      return { content: [], totalPages: 0, totalElements: 0, number: 0, size };
    }
  },

  formatCurrency: (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount),

  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  },

  getStatusBadgeClass: (status) => {
    switch ((status || "").toLowerCase()) {
      case "success":
      case "placed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  },
};

export default SellerOrdersService;

/**
 * Create Order API
 * Backend expects:
 * {
 *   paymentMethod: "UPI" | "CARD" | "COD" | "NET_BANKING",
 *   shippingAmount: 50.00,
 *   currency: "INR",
 *   items: [
 *     {
 *       productUid: "PROD-123",
 *       quantity: 2
 *     }
 *   ]
 * }
 * 
 * Backend automatically fills:
 * - buyerUid (from JWT token)
 * - sellerUid (from product)
 * - priceAtTime (from product)
 * - productName (from product)
 * - itemTotal (calculated)
 */
export const createOrder = async (orderData) => {
  try {
    console.log('📦 Creating order with payload:', orderData);
    
    const response = await axiosInstance.post('/orders', orderData);
    
    console.log('✅ Order created:', response.data.data);
    return response.data; // Returns ApiResponse with OrderDTO
  } catch (error) {
    console.error('❌ Error creating order:', error);
    throw error;
  }
};

/**
 * Get User Orders (Buyer)
 */
export const getUserOrders = async (page = 0, size = 100) => {
  try {
    const response = await axiosInstance.get('/orders/buyer', {
      params: { page, size }
    });
    return response.data.data; // Returns Page<OrderDTO>
  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    throw error;
  }
};

/**
 * Get Seller Orders
 */
export const getSellerOrders = async (page = 0, size = 100) => {
  try {
    const response = await axiosInstance.get('/orders/seller', {
      params: { page, size }
    });
    return response.data.data; // Returns Page<OrderDTO>
  } catch (error) {
    console.error('❌ Error fetching seller orders:', error);
    throw error;
  }
};

/**
 * Get Single Order by UID
 */
export const getOrderByUid = async (orderUid) => {
  try {
    const response = await axiosInstance.get(`/orders/buyer/${orderUid}`);
    return response.data.data; // Returns OrderDTO
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    throw error;
  }
};