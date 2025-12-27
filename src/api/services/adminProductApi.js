import adminInstance from "./adminApi";

export const productsAPI = {
  getAll: async (page = 0, size = 20, filters = {}) => {
    return adminInstance.get("/admin/products", {
      params: { page, size, ...filters },
    });
  },

  getById: async (productId) => {
    return adminInstance.get(`/admin/products/${productId}`);
  },


  // Delete product
  delete: async (productId) => {
    return adminInstance.delete(`/admin/products/${productId}`);
  },
};
