// src/components/CategoryManagement.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCategories, addCategory, deleteCategory, updateCategory } from "../../api/categoriesApi";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add a new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return toast.error("Category name required!");
    try {
      await addCategory(newCategory.trim());
      toast.success("Category added!");
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
      toast.error(err.response?.data?.message || "Failed to add category");
    }
  };

  // Delete a category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;
    try {
      await deleteCategory(id);
      toast.info("Category deleted");
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  // Start editing a category
  const startEditing = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  // Save updated category
  const saveEdit = async (id) => {
    if (!editingName.trim()) return toast.error("Category name required!");
    try {
      await updateCategory(id, editingName.trim());
      toast.success("Category updated!");
      setEditingId(null);
      setEditingName("");
      fetchCategories();
    } catch (err) {
      console.error("Error updating category:", err);
      toast.error(err.response?.data?.message || "Failed to update category");
    }
  };

  return (
    <div className="card shadow-sm p-3 h-100 admin-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0 text-primary">Categories</h4>
        <button className="btn btn-sm btn-outline-light" onClick={fetchCategories}>
          ⟳
        </button>
      </div>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control admin-input"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button className="btn btn-primary admin-btn" onClick={handleAddCategory}>
          Add
        </button>
      </div>

      {loading ? (
        <p className="text-muted small mb-0">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-muted small mb-0">No categories yet. Add your first one!</p>
      ) : (
        <ul className="list-group list-group-flush admin-list">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="list-group-item d-flex justify-content-between align-items-center admin-list-item"
            >
              {editingId === cat.id ? (
                <>
                  <input
                    type="text"
                    className="form-control me-2"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => saveEdit(cat.id)}
                  >
                    Save
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={cancelEditing}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{cat.name}</span>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => startEditing(cat.id, cat.name)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(cat.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
