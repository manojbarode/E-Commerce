// src/components/CategoryManagement.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { addCategory, deleteCategory, updateCategory } from "../../api/categoriesApi";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories1 } from "../../Redux/categoriesSlice";

export default function CategoryManagement() {
  const dispatch = useDispatch();
  const categoriesRedux = useSelector((state) => state.categories.data); // Redux se categories
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- Add a new category ----------------
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return toast.error("Category name required!");
    try {
      setLoading(true);
      await addCategory(newCategory.trim());
      toast.success("Category added!");
      setNewCategory("");
      // Redux store update
      dispatch(fetchCategories1());
    } catch (err) {
      console.error("Error adding category:", err);
      toast.error(err.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Delete a category ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;
    try {
      setLoading(true);
      await deleteCategory(id);
      toast.info("Category deleted");
      dispatch(fetchCategories1());
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error(err.response?.data?.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Start editing ----------------
  const startEditing = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  // ---------------- Save updated category ----------------
  const saveEdit = async (id) => {
    if (!editingName.trim()) return toast.error("Category name required!");
    try {
      setLoading(true);
      await updateCategory(id, editingName.trim());
      toast.success("Category updated!");
      setEditingId(null);
      setEditingName("");
      dispatch(fetchCategories1());
    } catch (err) {
      console.error("Error updating category:", err);
      toast.error(err.response?.data?.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm p-3 h-100 admin-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0 text-primary">Categories</h4>
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => dispatch(fetchCategories1())}
        >
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
        <p className="text-muted small mb-0">Processing...</p>
      ) : Object.keys(categoriesRedux).length === 0 ? (
        <p className="text-muted small mb-0">No categories yet. Add your first one!</p>
      ) : (
        <ul className="list-group list-group-flush admin-list">
          {Object.entries(categoriesRedux).map(([name, subcats]) => {
            const id = name; // assuming name unique; replace with proper ID if exists
            return (
              <li
                key={id}
                className="list-group-item d-flex justify-content-between align-items-center admin-list-item"
              >
                {editingId === id ? (
                  <>
                    <input
                      type="text"
                      className="form-control me-2"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                    />
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => saveEdit(id)}
                    >
                      Save
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={cancelEditing}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span>{name}</span>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => startEditing(id, name)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
