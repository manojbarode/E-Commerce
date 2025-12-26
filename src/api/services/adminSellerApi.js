import adminInstance from "./adminApi";

export const sellersAPI = {
 
  getAll: async (page = 1, limit = 20, filters = {}) => {
    const params = { page, limit,...filters,};

    const res = await adminInstance.get("/admin/sellers", { params });
    return res.data;
  },

  getById: async (sellerId) => {
    if (!sellerId) throw new Error("Seller ID is required");

    const res = await adminInstance.get(`/admin/sellers/${sellerId}`);
    return res.data;
  },

  approve: async (sellerId) => {
    if (!sellerId) throw new Error("Seller ID is required");

    const res = await adminInstance.put(
      `/admin/sellers/${sellerId}/approve`
    );
    return res.data;
  },

  reject: async (sellerId, reason) => {
    if (!sellerId) throw new Error("Seller ID is required");
    if (!reason) throw new Error("Rejection reason is required");

    const res = await adminInstance.put(
      `/admin/sellers/${sellerId}/reject`,
      { reason }
    );
    return res.data;
  },
  updateStatus: async (sellerId, status) => {
    if (!sellerId) throw new Error("Seller ID is required");
    if (!status) throw new Error("Status is required");

    const res = await adminInstance.put(
      `/admin/sellers/${sellerId}/status`,
      { status }
    );
    return res.data;
  },

  getAnalytics: async () => {
    const res = await adminInstance.get("/admin/sellers/analytics");
    return res.data;
  },
};

export default sellersAPI;
