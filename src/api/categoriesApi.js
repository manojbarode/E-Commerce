import axiosInstance from "./axiosConfig";
import adminInstance from "./services/adminApi";

export const getCategories = async () => {
  try {
    const res = await axiosInstance.get("/category/all");
    return res.data.data || [];
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
};

export const addCategory = async (name) => {
  try {
    const res = await adminInstance.post("/category/add", { name });
    return res.data.data;
  } catch (err) {
    console.error("Error adding category:", err);
    throw err;
  }
};

export const updateCategory = async (id, name) => {
  try {
    const res = await adminInstance.put(`/category/update/${id}`, { name });
    return res.data.data;
  } catch (err) {
    console.error("Error updating category:", err);
    throw err;
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await adminInstance.delete(`/category/delete/${id}`);
    return res.data.data;
  } catch (err) {
    console.error("Error deleting category:", err);
    throw err;
  }
};

export const getSubcategories = async (categoryId) => {
  try {
    const res = await adminInstance.get(`/category/${categoryId}/subcategories`);
    return res.data.data || [];
  } catch (err) {
    console.error(`Failed to fetch subcategories for ${categoryId}:`, err);
    return [];
  }
};


export const addSubcategory = async (categoryId, { name, customFields = [] }) => {
  const res = await adminInstance.post(`/category/${categoryId}/add-subcategory`, {
    name,
    customFields,
  });
  return res.data.data;
};

export const updateSubcategory = async (id, { name, customFields = [] }) => {
  const res = await adminInstance.put(`/category/update-subcategory/${id}`, {
    name,
    customFields,
  });
  return res.data.data;
};

// Delete subcategory
export const deleteSubcategory = async (id) => {
  const res = await adminInstance.delete(`/category/delete-subcategory/${id}`);
  return res.data.data;
};
