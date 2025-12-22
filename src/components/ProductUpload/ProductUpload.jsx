import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductUpload.css";
import { ProductAdd, uploadMultipleToCloudinary } from "../../api/productApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCategories, getSubcategories } from "../../api/categoriesApi";
import { useSelector } from "react-redux";

export default function ProductUpload() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState({categoryId: "",subcategoryId: "",title: "",description: "",price: "",stock: "",
    images: [],previews: [],});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = useSelector((state) => state.seller.token) || localStorage.getItem("sellerToken");
  console.log("Seller token:", localStorage.getItem("sellerToken"));
  useEffect(()=>{
    if (!token){
    toast.warning("Login required to access seller dashboard");
    navigate("/seller");
      return;
  }
  })
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    loadCategories()
  }, []);

  const handleCategoryChange = useCallback(
    async (categoryId) => {
      if (categoryId === form.categoryId) return;

      setForm((prev) => ({...prev,categoryId,subcategoryId: "",images: [],previews: [],}));
      setFields([]);
      setSubcategories([]);

      try {
        const data = await getSubcategories(categoryId);
        setSubcategories(data);
      } catch (err) {
        toast.error("Failed to load subcategories");
      }
    },
    [form.categoryId]
  );
  const handleSubcategoryChange = (subcategoryId) => {
    setForm((prev) => ({ ...prev, subcategoryId }));

    const selected = subcategories.find(
      (s) => s.id === Number(subcategoryId)
    );

    if (selected?.customFields && Array.isArray(selected.customFields)) {
      const dynamicFields = selected.customFields.map((f) => ({name: f,label: f,type: "text",required: true,}));
      setFields(dynamicFields);
      setForm((prev) => {
        const updated = { ...prev };
        dynamicFields.forEach((df) => (updated[df.name] = ""));
        return updated;
      });
    } else {
      setFields([]);
    }
  };

  const handleInputChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (files) => {
    const newFiles = Array.from(files);
    if (newFiles.length > 0) {
      alert(
        "Images will be automatically resized to 1024×1024 like Amazon/Flipkart!"
      );
    }
    setForm((prev) => ({...prev,images: [...prev.images, ...newFiles],
      previews: [...prev.previews,...newFiles.map((file) => URL.createObjectURL(file)),],}));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.images.length === 0) {
    toast.error("Please upload at least one image!");
    return;
  }

  try {
    setLoading(true);

    const uploadedUrls = await uploadMultipleToCloudinary(form.images);
    const dynamicFieldsMap = {};
    fields.forEach((f) => {
      dynamicFieldsMap[f.name] = form[f.name];
    });
    const dataToSend = {categoryId: Number(form.categoryId),subcategoryId: Number(form.subcategoryId),
      title: form.title,description: form.description,price: Number(form.price),stock: Number(form.stock),
      imageUrls: uploadedUrls,dynamicFields: dynamicFieldsMap,};

    await ProductAdd(dataToSend);
    toast.success("Product added successfully!");
    navigate("/seller/dashboard");
  } catch (err) {
    toast.error("Failed to add product!");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg p-5 rounded-4 form-card">
        <h2 className="text-center fw-bold mb-4">🛍 Add New Product</h2>
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
            <select className="form-control form-control-lg" value={form.subcategoryId}
              onChange={(e) => handleSubcategoryChange(e.target.value)} required>
              <option value="">Select Subcategory</option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* TITLE */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input type="text" className="form-control" value={form.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea className="form-control" rows="3" value={form.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
            ></textarea>
          </div>

          {/* PRICE */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Price</label>
            <input type="number" className="form-control" value={form.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              required
            />
          </div>

          {/* STOCK */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Stock</label>
            <input type="number" className="form-control" value={form.stock}
              onChange={(e) => handleInputChange("stock", e.target.value)}
              required
            />
          </div>

          {/* DYNAMIC FIELDS */}
          {fields.length > 0 && (
            <div className="card p-3 mb-3">
              <h5 className="fw-bold">Product Details</h5>
              {fields.map((f) => (
                <div key={f.name} className="mb-3">
                  <label className="form-label">{f.label}</label>
                  <input type="text" className="form-control" value={form[f.name]} onChange={(e) =>
                      handleInputChange(f.name, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {/* IMAGE UPLOAD */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Product Images</label>
            <input type="file" multiple accept="image/*" className="form-control"
              onChange={(e) => handleImageChange(e.target.files)}
              required
            />
          </div>

          {/* IMAGE PREVIEW */}
          {form.previews.length > 0 && (
            <div className="preview-container mt-3">
              <h6 className="fw-bold">Image Preview</h6>
              <div className="d-flex gap-3 flex-wrap">
                {form.previews.map((src, i) => (
                  <img key={i} src={src} alt="preview"className="img-preview-box"/>
                ))}
              </div>
            </div>
          )}

          <button className="btn btn-gradient w-100 btn-lg fw-bold mt-3" disabled={loading}>
            {loading ? "Uploading..." : "Submit Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
