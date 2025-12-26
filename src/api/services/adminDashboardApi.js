// apiService.js
// ============ API BASE URL - Change this to your backend URL ============
const API_BASE_URL = 'https://your-api-domain.com/api';

// ============ API HELPER FUNCTION ============
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`, // Add your auth token
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

// ============ DASHBOARD APIs ============
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    return await apiCall('/admin/dashboard/stats');
  },

  // Get sales data for charts
  getSalesData: async (period = 'monthly') => {
    return await apiCall(`/admin/dashboard/sales?period=${period}`);
  },

  // Get recent orders
  getRecentOrders: async (limit = 10) => {
    return await apiCall(`/admin/orders/recent?limit=${limit}`);
  },

  // Get category distribution
  getCategoryDistribution: async () => {
    return await apiCall('/admin/dashboard/category-distribution');
  }
};

// ============ ORDERS APIs ============
export const ordersAPI = {
  // Get all orders with pagination and filters
  getAll: async (page = 1, limit = 20, filters = {}) => {
    const queryParams = new URLSearchParams({ page, limit, ...filters });
    return await apiCall(`/admin/orders?${queryParams}`);
  },

  // Get single order by ID
  getById: async (orderId) => {
    return await apiCall(`/admin/orders/${orderId}`);
  },

  // Update order status
  updateStatus: async (orderId, status) => {
    return await apiCall(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Delete order
  delete: async (orderId) => {
    return await apiCall(`/admin/orders/${orderId}`, {
      method: 'DELETE'
    });
  },

  // Get order analytics
  getAnalytics: async () => {
    return await apiCall('/admin/orders/analytics');
  }
};

// ============ PRODUCTS APIs ============
export const productsAPI = {
  // Get all products with pagination and filters
  getAll: async (page = 1, limit = 20, filters = {}) => {
    const queryParams = new URLSearchParams({ page, limit, ...filters });
    return await apiCall(`/admin/products?${queryParams}`);
  },

  // Get single product by ID
  getById: async (productId) => {
    return await apiCall(`/admin/products/${productId}`);
  },

  // Create new product
  create: async (productData) => {
    return await apiCall('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  // Update product
  update: async (productId, productData) => {
    return await apiCall(`/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  // Delete product
  delete: async (productId) => {
    return await apiCall(`/admin/products/${productId}`, {
      method: 'DELETE'
    });
  },

  // Bulk update products
  bulkUpdate: async (productIds, updateData) => {
    return await apiCall('/admin/products/bulk-update', {
      method: 'PUT',
      body: JSON.stringify({ productIds, updateData })
    });
  },

  // Upload product image
  uploadImage: async (productId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return await fetch(`${API_BASE_URL}/admin/products/${productId}/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: formData
    }).then(res => res.json());
  }
};

// ============ CATEGORIES APIs ============
export const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    return await apiCall('/admin/categories');
  },

  // Get single category by ID
  getById: async (categoryId) => {
    return await apiCall(`/admin/categories/${categoryId}`);
  },

  // Create new category
  create: async (categoryData) => {
    return await apiCall('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  },

  // Update category
  update: async (categoryId, categoryData) => {
    return await apiCall(`/admin/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  },

  // Delete category
  delete: async (categoryId) => {
    return await apiCall(`/admin/categories/${categoryId}`, {
      method: 'DELETE'
    });
  }
};

// ============ SUB-CATEGORIES APIs ============
export const subCategoriesAPI = {
  // Get all sub-categories (optionally filter by category)
  getAll: async (categoryId = null) => {
    const url = categoryId 
      ? `/admin/subcategories?categoryId=${categoryId}`
      : '/admin/subcategories';
    return await apiCall(url);
  },

  // Get single sub-category by ID
  getById: async (subCategoryId) => {
    return await apiCall(`/admin/subcategories/${subCategoryId}`);
  },

  // Create new sub-category
  create: async (subCategoryData) => {
    return await apiCall('/admin/subcategories', {
      method: 'POST',
      body: JSON.stringify(subCategoryData)
    });
  },

  // Update sub-category
  update: async (subCategoryId, subCategoryData) => {
    return await apiCall(`/admin/subcategories/${subCategoryId}`, {
      method: 'PUT',
      body: JSON.stringify(subCategoryData)
    });
  },

  // Delete sub-category
  delete: async (subCategoryId) => {
    return await apiCall(`/admin/subcategories/${subCategoryId}`, {
      method: 'DELETE'
    });
  }
};

// ============ USERS APIs ============


// ============ SELLERS APIs ============
export const sellersAPI = {
  // Get all sellers with pagination and filters
  getAll: async (page = 1, limit = 20, filters = {}) => {
    const queryParams = new URLSearchParams({ page, limit, ...filters });
    return await apiCall(`/admin/sellers?${queryParams}`);
  },

  // Get single seller by ID
  getById: async (sellerId) => {
    return await apiCall(`/admin/sellers/${sellerId}`);
  },

  // Approve seller
  approve: async (sellerId) => {
    return await apiCall(`/admin/sellers/${sellerId}/approve`, {
      method: 'PUT'
    });
  },

  // Reject seller
  reject: async (sellerId, reason) => {
    return await apiCall(`/admin/sellers/${sellerId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
  },

  // Update seller status
  updateStatus: async (sellerId, status) => {
    return await apiCall(`/admin/sellers/${sellerId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Get seller analytics
  getAnalytics: async () => {
    return await apiCall('/admin/sellers/analytics');
  }
};

// ============ PAYMENTS APIs ============
export const paymentsAPI = {
  // Get all payments with pagination and filters
  getAll: async (page = 1, limit = 20, filters = {}) => {
    const queryParams = new URLSearchParams({ page, limit, ...filters });
    return await apiCall(`/admin/payments?${queryParams}`);
  },

  // Get single payment by ID
  getById: async (paymentId) => {
    return await apiCall(`/admin/payments/${paymentId}`);
  },

  // Refund payment
  refund: async (paymentId, amount, reason) => {
    return await apiCall(`/admin/payments/${paymentId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason })
    });
  },

  // Get payment analytics
  getAnalytics: async () => {
    return await apiCall('/admin/payments/analytics');
  }
};

// ============ SHIPPING APIs ============
export const shippingAPI = {
  // Get all shipping methods
  getMethods: async () => {
    return await apiCall('/admin/shipping/methods');
  },

  // Create new shipping method
  createMethod: async (methodData) => {
    return await apiCall('/admin/shipping/methods', {
      method: 'POST',
      body: JSON.stringify(methodData)
    });
  },

  // Update shipping method
  updateMethod: async (methodId, methodData) => {
    return await apiCall(`/admin/shipping/methods/${methodId}`, {
      method: 'PUT',
      body: JSON.stringify(methodData)
    });
  },

  // Delete shipping method
  deleteMethod: async (methodId) => {
    return await apiCall(`/admin/shipping/methods/${methodId}`, {
      method: 'DELETE'
    });
  },

  // Get shipping zones
  getZones: async () => {
    return await apiCall('/admin/shipping/zones');
  },

  // Create shipping zone
  createZone: async (zoneData) => {
    return await apiCall('/admin/shipping/zones', {
      method: 'POST',
      body: JSON.stringify(zoneData)
    });
  }
};

// ============ COUPONS APIs ============
export const couponsAPI = {
  // Get all coupons
  getAll: async () => {
    return await apiCall('/admin/coupons');
  },

  // Get single coupon by ID
  getById: async (couponId) => {
    return await apiCall(`/admin/coupons/${couponId}`);
  },

  // Create new coupon
  create: async (couponData) => {
    return await apiCall('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData)
    });
  },

  // Update coupon
  update: async (couponId, couponData) => {
    return await apiCall(`/admin/coupons/${couponId}`, {
      method: 'PUT',
      body: JSON.stringify(couponData)
    });
  },

  // Delete coupon
  delete: async (couponId) => {
    return await apiCall(`/admin/coupons/${couponId}`, {
      method: 'DELETE'
    });
  },

  // Get coupon usage statistics
  getUsageStats: async (couponId) => {
    return await apiCall(`/admin/coupons/${couponId}/usage-stats`);
  }
};

// ============ REVIEWS APIs ============
export const reviewsAPI = {
  // Get all reviews with pagination
  getAll: async (page = 1, limit = 20, filters = {}) => {
    const queryParams = new URLSearchParams({ page, limit, ...filters });
    return await apiCall(`/admin/reviews?${queryParams}`);
  },

  // Get single review by ID
  getById: async (reviewId) => {
    return await apiCall(`/admin/reviews/${reviewId}`);
  },

  // Update review status (approved/rejected)
  updateStatus: async (reviewId, status) => {
    return await apiCall(`/admin/reviews/${reviewId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Delete review
  delete: async (reviewId) => {
    return await apiCall(`/admin/reviews/${reviewId}`, {
      method: 'DELETE'
    });
  },

  // Reply to review
  reply: async (reviewId, replyText) => {
    return await apiCall(`/admin/reviews/${reviewId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ reply: replyText })
    });
  }
};

// ============ REPORTS APIs ============
export const reportsAPI = {
  // Get sales report
  getSalesReport: async (startDate, endDate, groupBy = 'day') => {
    const queryParams = new URLSearchParams({ startDate, endDate, groupBy });
    return await apiCall(`/admin/reports/sales?${queryParams}`);
  },

  // Get product performance report
  getProductReport: async (startDate, endDate) => {
    const queryParams = new URLSearchParams({ startDate, endDate });
    return await apiCall(`/admin/reports/products?${queryParams}`);
  },

  // Get user activity report
  getUserReport: async (startDate, endDate) => {
    const queryParams = new URLSearchParams({ startDate, endDate });
    return await apiCall(`/admin/reports/users?${queryParams}`);
  },

  // Get revenue report
  getRevenueReport: async (startDate, endDate) => {
    const queryParams = new URLSearchParams({ startDate, endDate });
    return await apiCall(`/admin/reports/revenue?${queryParams}`);
  },

  // Get inventory report
  getInventoryReport: async () => {
    return await apiCall('/admin/reports/inventory');
  },

  // Export report as CSV/Excel
  exportReport: async (reportType, format = 'csv') => {
    const response = await fetch(`${API_BASE_URL}/admin/reports/${reportType}/export?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
    return await response.blob();
  }
};

// ============ SETTINGS APIs ============
export const settingsAPI = {
  // Get all settings
  getAll: async () => {
    return await apiCall('/admin/settings');
  },

  // Update settings
  update: async (settingsData) => {
    return await apiCall('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    });
  },

  // Get notification settings
  getNotifications: async () => {
    return await apiCall('/admin/settings/notifications');
  },

  // Update notification settings
  updateNotifications: async (notificationData) => {
    return await apiCall('/admin/settings/notifications', {
      method: 'PUT',
      body: JSON.stringify(notificationData)
    });
  }
};

// Export all APIs
export default {
  dashboard: dashboardAPI,
  orders: ordersAPI,
  products: productsAPI,
  categories: categoriesAPI,
  subCategories: subCategoriesAPI,
  sellers: sellersAPI,
  payments: paymentsAPI,
  shipping: shippingAPI,
  coupons: couponsAPI,
  reviews: reviewsAPI,
  reports: reportsAPI,
  settings: settingsAPI
};