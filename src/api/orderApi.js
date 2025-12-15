import axiosInstance from "./axiosConfig";

export const createOrder = async (orderData, paymentPublicRef) => {
  const url = paymentPublicRef
    ? `/orders?paymentPublicRef=${paymentPublicRef}`
    : `/orders`;

  return axiosInstance.post(url, orderData);
};

const SellerOrdersService = {

  getSellerOrders: async (sellerUid, page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get(`orders/seller/${sellerUid}`, {
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

  formatCurrency: (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount),

  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  },

  getStatusBadgeClass: (status) => {
    switch ((status || "").toLowerCase()) {
      case "success":
      case "placed": return "success";
      case "pending": return "warning";
      case "cancelled": return "danger";
      default: return "secondary";
    }
  },
};

export default SellerOrdersService;
