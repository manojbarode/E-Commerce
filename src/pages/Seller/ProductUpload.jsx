import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Css/ProductUpload.css";
import { ProductAdd, uploadMultipleToCloudinary } from "../../api/productApi";

export default function ProductUpload() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    subcategory: "",
    sellerId: "",
    images: [],
  });

  const [extra, setExtra] = useState({});
  const [loading, setLoading] = useState(false);
  const [localImages, setLocalImages] = useState([]);

  const categoryData = {
    Clothes: ["Men's Wear", "Women's Wear", "Kids"],
    Shoes: ["Men's Shoes", "Women's Shoes"],
    Electronics: ["Mobiles", "Laptop", "Camera"],
    "Books & Stationery": ["Fiction", "Non-Fiction", "Comics"],
    "Beauty & Personal Care": ["Skincare", "Makeup"],
    "Home & Kitchen": ["Furniture", "Cookware"],
  };

  const dynamicFields = {
    Clothes: ["size", "color", "material", "brand", "gender", "sleeve_type", "fit", "pattern"],
    Shoes: ["size", "color", "brand", "material", "gender"],
    Electronics: ["brand", "model", "weight", "dimensions", "warranty", "battery", "connectivity"],
    "Books & Stationery": ["author", "publisher", "pages", "language", "ISBN"],
    "Beauty & Personal Care": ["ingredients", "expiry_date", "skin_type", "brand"],
    "Home & Kitchen": ["material", "dimensions", "weight", "brand"],
  };

  const MAX_WIDTH = 1600;  // Maximum allowed width
  const MAX_HEIGHT = 1600; // Maximum allowed height

  const handleBaseChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleExtraChange = (e) => {
    setExtra({ ...extra, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const previews = [];
    const invalidFiles = [];

    files.forEach((file) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
          invalidFiles.push(file.name);
        } else {
          validFiles.push(file);
          previews.push(img.src);
        }

        // Update state after processing all images
        if (validFiles.length + invalidFiles.length === files.length) {
          if (invalidFiles.length > 0) {
            alert(
              `⚠ The following images exceed ${MAX_WIDTH}x${MAX_HEIGHT}px and will not be uploaded:\n${invalidFiles.join(
                "\n"
              )}`
            );
          }
          setLocalImages(previews);
          setForm({ ...form, images: validFiles });
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) {
      alert("❌ Please upload at least one valid image!");
      return;
    }
    try {
      setLoading(true);
      const uploadedUrls = await uploadMultipleToCloudinary(form.images);
      const finalData = { ...form, images: uploadedUrls, extra };
      await ProductAdd(finalData);
      alert("✅ Product added successfully!");
      setForm({
        title: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        subcategory: "",
        sellerId: "",
        images: [],
      });
      setLocalImages([]);
      setExtra({});
    } catch (error) {
      // console.error("Error adding product:", error);
      alert("❌ Failed to add product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg p-5 rounded-4 form-card">
        <h2 className="mb-4 text-center fw-bold">🛍 Add New Product</h2>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Product Title</label>
            <input
              type="text"
              name="title"
              className="form-control form-control-lg"
              onChange={handleBaseChange}
              placeholder="Enter product title"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="description"
              rows="3"
              className="form-control form-control-lg"
              onChange={handleBaseChange}
              placeholder="Write detailed description"
              required
            ></textarea>
          </div>

          {/* Price and Stock */}
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label fw-semibold">Price</label>
              <input
                type="number"
                name="price"
                className="form-control form-control-lg"
                onChange={handleBaseChange}
                placeholder="₹ 0"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Stock</label>
              <input
                type="number"
                name="stock"
                className="form-control form-control-lg"
                onChange={handleBaseChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Seller ID */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Seller ID</label>
            <input
              type="text"
              name="sellerId"
              className="form-control form-control-lg"
              onChange={handleBaseChange}
              placeholder="Enter seller ID"
              required
            />
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Category</label>
            <select
              name="category"
              className="form-select form-select-lg"
              onChange={(e) => {
                handleBaseChange(e);
                setExtra({});
              }}
              required
            >
              <option value="">Select Category</option>
              {Object.keys(categoryData).map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          {form.category && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Subcategory</label>
              <select
                name="subcategory"
                className="form-select form-select-lg"
                onChange={handleBaseChange}
                required
              >
                <option value="">Select Subcategory</option>
                {categoryData[form.category].map((sub, i) => (
                  <option key={i} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Images */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="form-control form-control-lg"
              onChange={handleImageChange}
            />
            <div className="mt-2 d-flex flex-wrap gap-2">
              {localImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="preview"
                  className="preview-img rounded"
                  width={100}
                />
              ))}
            </div>
          </div>

          {/* Dynamic Extra Fields */}
          {form.category && (
            <>
              <h5 className="mt-4 mb-3 text-primary fw-bold">
                🔧 {form.category} Specifications
              </h5>
              {dynamicFields[form.category]?.map((field, i) => (
                <div className="mb-3" key={i}>
                  <label className="form-label text-capitalize">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type="text"
                    name={field}
                    className="form-control form-control-lg"
                    placeholder={`Enter ${field.replace("_", " ")}`}
                    onChange={handleExtraChange}
                  />
                </div>
              ))}
            </>
          )}

          <button
            type="submit"
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
