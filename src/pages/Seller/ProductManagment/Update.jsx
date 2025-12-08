import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../../../api/productApi";
import { toast } from "react-toastify";
import { uploadMultipleToCloudinary } from "../../../api/productApi"; // aapke Cloudinary upload function

export default function UpdateProduct() {
  const { id } = useParams(); // product id from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    images: [], // can be URLs or Files
  });

  const [loading, setLoading] = useState(false);

  // Load product details on mount
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        if (data) {
          setForm({
            title: data.title,
            description: data.description,
            price: data.price,
            stock: data.stock,
            images: data.imageUrls || [],
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      }
    };
    loadProduct();
  }, [id]);

  // Handle input change
  const handleInputChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Upload new images if user selected files
      let uploadedUrls = form.images;

      // Check if first element is File, then upload
      if (form.images[0] instanceof File) {
        uploadedUrls = await uploadMultipleToCloudinary(form.images);
      }

      const finalData = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrls: uploadedUrls,
      };

      await updateProduct(id, finalData);
      toast.success("Product updated successfully!");
      navigate("/seller/products"); // back to seller product list
    } catch (err) {
      console.error(err);
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Update Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={form.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={form.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            required
          />
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            value={form.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            required
          />
        </div>

        {/* Stock */}
        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input
            type="number"
            className="form-control"
            value={form.stock}
            onChange={(e) => handleInputChange("stock", e.target.value)}
            required
          />
        </div>

        {/* Images */}
        <div className="mb-3">
          <label className="form-label">Product Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="form-control"
            onChange={(e) => handleInputChange("images", [...e.target.files])}
          />

          {/* Preview existing images if URLs */}
          {form.images && !(form.images[0] instanceof File) && (
            <div className="mt-2 d-flex flex-wrap gap-2">
              {form.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Preview"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
