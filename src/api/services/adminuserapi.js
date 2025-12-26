import adminInstance from "./adminApi";

export const usersAPI = {
  getAll: async (page = 1, size = 20, filters = {}) => {
    const params = new URLSearchParams({page,size,...filters,});

    const res = await adminInstance.get(`/admin/users?${params}`);
    return res.data.data;
  },

  getByUid: async (userUid) => {
    const res = await adminInstance.get(`/admin/users/${userUid}`);
    return res.data.data;
  },

 updateStatus: async (userUid, status) => {
  console.log('=== UPDATE STATUS DEBUG ===');
  console.log('userUid:', userUid);
  console.log('status:', status);
  console.log('Base URL:', adminInstance.defaults.baseURL);
  console.log('Full URL will be:', `${adminInstance.defaults.baseURL}/admin/users/${userUid}/status?status=${status}`);
  
  try {
    const res = await adminInstance.patch(
      `/admin/users/${userUid}/status`,
      null,
      { params: { status } }
    );
    console.log('✅ Success:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      params: error.config?.params,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
},
  delete: async (userUid) => {
    await adminInstance.delete(`/admin/users/${userUid}`);
  },
   getAnalytics: async () => {
    const res = await adminInstance.get(`/admin/users/analytics`);
    return res.data.data;
  },
};
