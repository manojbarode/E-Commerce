import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductUpload.css";
import { ProductAdd, uploadMultipleToCloudinary } from "../../api/productApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCategories, getSubcategories } from "../../api/adminApi";

export default function ProductUpload() {
  const sellerId = Number(localStorage.getItem("sellerId"));
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [extraFields, setExtraFields] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    subcategoryId: "",
    sellerId: sellerId || "",
    images: [],
  });

  const [extra, setExtra] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  // ---------------------------------------------------
  // 📌 When Category changes → load subcategories
  // ---------------------------------------------------
  const handleCategoryChange = async (categoryId) => {
    setForm({ ...form, categoryId, subcategoryId: "" });

    try {
      const res = await getSubcategories(categoryId);
      setSubcategories(res.data);
      setExtraFields([]); // reset when category changes
    } catch {
      toast.error("Failed to load subcategories");
    }
  };

  // ---------------------------------------------------
  // 📌 When Subcategory changes → get dynamic extra fields
  // ---------------------------------------------------
  const handleSubcategoryChange = (subcategoryId) => {
    setForm({ ...form, subcategoryId });

    const selected = subcategories.find((s) => s.id === subcategoryId);

    if (selected && selected.extraFields) {
      setExtraFields(selected.extraFields);
    } else {
      setExtraFields([]);
    }
  };

  // ---------------------------------------------------
  // 📌 Submit form
  // ---------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.images.length === 0) {
      toast.error("Please upload at least one image!");
      return;
    }

    try {
      setLoading(true);

      const uploadedUrls = await uploadMultipleToCloudinary(form.images);
      const finalData = { ...form, images: uploadedUrls, extra };

      await ProductAdd(finalData);

      toast.success("Product added successfully!");
      navigate("/sellerdashboard");

    } catch {
      toast.error("Failed to add product!");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------
  // 📌 UI
  // ---------------------------------------------------
  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg p-5 rounded-4 form-card">
        <h2 className="mb-4 text-center fw-bold">🛍 Add New Product</h2>

        <form onSubmit={handleSubmit}>

          {/* CATEGORY */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Category</label>
            <select
              className="form-control form-control-lg"
              value={form.categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* SUBCATEGORY */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Subcategory</label>
            <select
              className="form-control form-control-lg"
              value={form.subcategoryId}
              onChange={(e) => handleSubcategoryChange(e.target.value)}
              required
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* DYNAMIC EXTRA FIELDS (from Backend) */}
          {extraFields.length > 0 && (
            <div className="card p-3 mb-3">
              <h5 className="fw-bold">Extra Details</h5>

              {extraFields.map((field) => (
                <div className="mb-2" key={field}>
                  <label className="form-label">{field.toUpperCase()}</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => setExtra({ ...extra, [field]: e.target.value })}
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* TITLE */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Product Title</label>
            <input
              type="text"
              className="form-control form-control-lg"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control form-control-lg"
              rows="3"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            ></textarea>
          </div>

          {/* PRICE & STOCK */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Price</label>
              <input
                type="number"
                className="form-control form-control-lg"
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Stock</label>
              <input
                type="number"
                className="form-control form-control-lg"
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="form-control"
              onChange={(e) => setForm({ ...form, images: [...e.target.files] })}
            />
          </div>

          <button className="btn btn-gradient w-100 btn-lg mt-4 fw-bold" disabled={loading}>
            {loading ? "Uploading..." : "Submit Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
