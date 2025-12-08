import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductUpload.css";
import { ProductAdd, uploadMultipleToCloudinary } from "../../api/productApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCategories, getSubcategories } from "../../api/categoriesApi";

export default function ProductUpload() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState({
    categoryId: "",
    subcategoryId: "",
    title: "",
    description: "",
    price: "",
    stock: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  // Handle category change
  const handleCategoryChange = async (categoryId) => {
    setForm((prev) => ({
      ...prev,
      categoryId,
      subcategoryId: "",
      images: [],
    }));
    setFields([]);
    try {
      const data = await getSubcategories(categoryId);
      setSubcategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load subcategories");
    }
  };

  // Handle subcategory change and load dynamic fields
  const handleSubcategoryChange = (subcategoryId) => {
    setForm((prev) => ({ ...prev, subcategoryId }));

    const selected = subcategories.find((s) => s.id === Number(subcategoryId));

    if (selected?.customFields && Array.isArray(selected.customFields)) {
      const dynamicFields = selected.customFields.map((f) => ({
        name: f,
        label: f,
        type: "text",
        required: true,
      }));
      setFields(dynamicFields);

      // Initialize dynamic field values
      setForm((prev) => {
        const updated = { ...prev };
        dynamicFields.forEach((f) => (updated[f.name] = ""));
        return updated;
      });
    } else {
      setFields([]);
    }
  };

  // Handle input changes
  const handleInputChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.images || form.images.length === 0) {
      toast.error("Please upload at least one image!");
      return;
    }

    try {
      setLoading(true);

      // Upload images to Cloudinary
      const uploadedUrls = await uploadMultipleToCloudinary(form.images);

      // Prepare dynamic fields map
      const dynamicFieldsMap = {};
      fields.forEach((f) => {
        dynamicFieldsMap[f.name] = form[f.name];
      });

      // Prepare final data matching backend DTO
      const finalData = {
        categoryId: Number(form.categoryId),
        subcategoryId: Number(form.subcategoryId),
        title: form.title,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrls: uploadedUrls,      // rename images -> imageUrls
        dynamicFields: dynamicFieldsMap,
      };

      // Get sellerId from localStorage
      const sellerId = localStorage.getItem("sellerId");
      if (!sellerId) {
        toast.error("Seller ID not found! Please login again.");
        return;
      }

      await ProductAdd(finalData, sellerId);

      toast.success("Product added successfully!");
      navigate("/sellerdashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product!");
    } finally {
      setLoading(false);
    }
  };

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
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
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
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* STATIC FIELDS */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input
              type="text"
              className="form-control"
              value={form.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={form.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Price</label>
            <input
              type="number"
              className="form-control"
              value={form.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Stock</label>
            <input
              type="number"
              className="form-control"
              value={form.stock}
              onChange={(e) => handleInputChange("stock", e.target.value)}
              required
            />
          </div>

          {/* DYNAMIC FIELDS */}
          {fields.length > 0 && (
            <div className="card p-3 mb-3">
              <h5 className="fw-bold">Product Details</h5>
              {fields.map((field) => (
                <div className="mb-3" key={field.name}>
                  <label className="form-label">{field.label}</label>
                  <input
                    type={field.type || "text"}
                    className="form-control"
                    value={form[field.name]}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    required={field.required}
                  />
                </div>
              ))}
            </div>
          )}

          {/* IMAGE UPLOAD */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="form-control"
              onChange={(e) => handleInputChange("images", [...e.target.files])}
              required
            />
          </div>

          <button
            className="btn btn-gradient w-100 btn-lg mt-4 fw-bold"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Submit Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
