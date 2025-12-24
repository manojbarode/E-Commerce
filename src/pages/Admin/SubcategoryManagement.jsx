// src/components/SubcategoryManagement.jsx
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { addSubcategory, deleteSubcategory, updateSubcategory } from "../../api/categoriesApi";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories1 } from "../../Redux/categoriesSlice";

export default function SubcategoryManagement() {
  const dispatch = useDispatch();
  const { data: categoriesRedux, status } = useSelector(state => state.categories);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState({ name: "", customFields: [""] });
  const [editingSubcategory, setEditingSubcategory] = useState({ id: null, name: "", customFields: [""] });

  // Fetch categories once on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories1());
    }
  }, [dispatch, status]);

  // Compute subcategories for the selected category
  const subcategories = useMemo(() => {
    if (status !== "succeeded" || !selectedCategory) return [];
    const cat = categoriesRedux.find(c => c.id === Number(selectedCategory));
    return cat?.subcategories || [];
  }, [categoriesRedux, selectedCategory, status]);

  // ---------------- Add Subcategory ----------------
  const handleAddSubcategory = async () => {
    const cleanedFields = newSubcategory.customFields.map(f => f.trim()).filter(f => f);
    if (!newSubcategory.name.trim()) return toast.error("Subcategory name required!");
    if (!selectedCategory) return toast.error("Select a category first!");

    try {
      setLoadingSubs(true);
      await addSubcategory(selectedCategory, {
        name: newSubcategory.name.trim(),
        customFields: cleanedFields,
      });
      toast.success("Subcategory added!");
      setNewSubcategory({ name: "", customFields: [""] });
      dispatch(fetchCategories1()); // refresh categories in Redux
    } catch (err) {
      console.error("Add subcategory error:", err);
      toast.error(err.response?.data?.message || "Failed to add subcategory");
    } finally {
      setLoadingSubs(false);
    }
  };

  // ---------------- Edit Subcategory ----------------
  const startEditing = (sub) => {
    setEditingSubcategory({
      id: sub.id,
      name: sub.name || "",
      customFields: Array.isArray(sub.customFields) && sub.customFields.length > 0 ? sub.customFields : [""],
    });
  };

  const cancelEditing = () => {
    setEditingSubcategory({ id: null, name: "", customFields: [""] });
  };

  const saveEdit = async () => {
    const cleanedFields = editingSubcategory.customFields.map(f => f.trim()).filter(f => f);
    const trimmedName = editingSubcategory.name.trim();
    if (!trimmedName) return toast.error("Subcategory name required!");

    try {
      setLoadingSubs(true);
      await updateSubcategory(editingSubcategory.id, { name: trimmedName, customFields: cleanedFields });
      toast.success("Subcategory updated!");
      cancelEditing();
      dispatch(fetchCategories1());
    } catch (err) {
      console.error("Update subcategory error:", err);
      toast.error(err.response?.data?.message || "Failed to update subcategory");
    } finally {
      setLoadingSubs(false);
    }
  };

  // ---------------- Delete Subcategory ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subcategory?")) return;
    try {
      setLoadingSubs(true);
      await deleteSubcategory(id);
      toast.info("Deleted!");
      dispatch(fetchCategories1());
    } catch (err) {
      console.error("Delete subcategory error:", err);
      toast.error(err.response?.data?.message || "Failed to delete subcategory");
    } finally {
      setLoadingSubs(false);
    }
  };

  // ---------------- Dynamic Fields ----------------
  const addField = (isEditing = false) => {
    if (isEditing) {
      setEditingSubcategory(prev => ({ ...prev, customFields: [...prev.customFields, ""] }));
    } else {
      setNewSubcategory(prev => ({ ...prev, customFields: [...prev.customFields, ""] }));
    }
  };

  const removeField = (index, isEditing = false) => {
    if (isEditing) {
      setEditingSubcategory(prev => ({ ...prev, customFields: prev.customFields.filter((_, i) => i !== index) }));
    } else {
      setNewSubcategory(prev => ({ ...prev, customFields: prev.customFields.filter((_, i) => i !== index) }));
    }
  };

  const handleFieldChange = (index, value, isEditing = false) => {
    if (isEditing) {
      const updated = [...editingSubcategory.customFields];
      updated[index] = value;
      setEditingSubcategory(prev => ({ ...prev, customFields: updated }));
    } else {
      const updated = [...newSubcategory.customFields];
      updated[index] = value;
      setNewSubcategory(prev => ({ ...prev, customFields: updated }));
    }
  };

  // ---------------- JSX ----------------
  return (
    <div className="card shadow-sm p-3 h-100 admin-card">
      <h4 className="fw-bold mb-3 text-primary">Manage Subcategories</h4>

      {/* Select Category */}
      <div className="mb-3">
        <label className="form-label fw-semibold text-light">Select Category</label>
        <select
          className="form-select admin-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">-- Choose category --</option>
          {categoriesRedux.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Add Subcategory */}
      {selectedCategory && (
        <div className="mb-3">
          <input
            type="text"
            className="form-control admin-input mb-2"
            placeholder="New Subcategory"
            value={newSubcategory.name}
            onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
          />

          {newSubcategory.customFields.map((field, idx) => (
            <div className="input-group mb-2" key={idx}>
              <input
                type="text"
                className="form-control admin-input"
                value={field}
                placeholder="Field name"
                onChange={(e) => handleFieldChange(idx, e.target.value)}
              />
              <button className="btn btn-danger" onClick={() => removeField(idx)}>
                ✕
              </button>
            </div>
          ))}

          <button className="btn btn-secondary btn-sm mt-1 admin-btn-outline" onClick={() => addField()}>
            + Add Field
          </button>
          <button className="btn btn-primary w-100 admin-btn mt-2" onClick={handleAddSubcategory}>
            Add Subcategory
          </button>
        </div>
      )}

      {/* Subcategory List */}
      {loadingSubs && <p className="text-muted small mb-2">Processing...</p>}
      {subcategories.length === 0 && selectedCategory && !loadingSubs && (
        <p className="text-muted small">No subcategories for this category.</p>
      )}

      <ul className="list-group list-group-flush admin-list">
        {subcategories.map(sub => (
          <li key={sub.id} className="list-group-item admin-list-item">
            {editingSubcategory.id === sub.id ? (
              <div className="w-100">
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editingSubcategory.name}
                  onChange={(e) => setEditingSubcategory({ ...editingSubcategory, name: e.target.value })}
                />
                {editingSubcategory.customFields.map((field, idx) => (
                  <div className="input-group mb-2" key={idx}>
                    <input
                      type="text"
                      className="form-control"
                      value={field}
                      onChange={(e) => handleFieldChange(idx, e.target.value, true)}
                    />
                    <button className="btn btn-danger" onClick={() => removeField(idx, true)}>✕</button>
                  </div>
                ))}
                <button className="btn btn-secondary btn-sm mb-2" onClick={() => addField(true)}>+ Add Field</button>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-success" onClick={saveEdit}>Save</button>
                  <button className="btn btn-sm btn-secondary" onClick={cancelEditing}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-center w-100">
                <div>
                  <span className="fw-semibold">{sub.name}</span>
                  {sub.customFields && sub.customFields.length > 0 && (
                    <div className="small text-muted">
                      Fields: {sub.customFields.join(", ")}
                    </div>
                  )}
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-info" onClick={() => startEditing(sub)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(sub.id)}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
