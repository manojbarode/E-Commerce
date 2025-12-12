import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./SellerProductUpdate.css";
import { getProductById, uploadMultipleToCloudinary } from "../../../api/productApi";
import { updateProduct } from "../../../api/SellApi";
import { useContext } from "react";
import { SellerContext } from "../../../context/SellerProvider";

export default function UpdateProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [dynamicFields, setDynamicFields] = useState({});
  const [loading, setLoading] = useState(false);
  // const { productUid } = useContext(SellerContext);
  const sellerUid = localStorage.getItem("sellerUid");
  const productUid = localStorage.getItem("productUid");
  console.log("Seller Uid "+sellerUid);
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(productUid);

        if (!data) {
          toast.error("Product not found");
          return;
        }

        // Only editable fields
        setForm({
          title: data.title,
          description: data.description,
          price: data.price,
          stock: data.stock,
          images: data.imageUrls || [],
        });

        // Dynamic fields
        setDynamicFields(data.dynamicFields || {});
      } catch (err) {
        toast.error("Failed to load product");
      }
    };

    loadProduct();
  }, [productUid]);

  const handleInputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleDynamicFieldChange = (key, value) => {
    setDynamicFields((prev) => ({ ...prev, [key]: value }));
  };
  const handleRemoveImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      let imageUrls = form.images;
      if (form.images?.length && form.images.some((img) => img instanceof File)) {
        const filesToUpload = form.images.filter((img) => img instanceof File);
        const uploadedUrls = await uploadMultipleToCloudinary(filesToUpload);

        const existingUrls = form.images.filter((img) => typeof img === "string");
        imageUrls = [...existingUrls, ...uploadedUrls];
      }

      const finalData = {
        ...form,
        dynamicFields,
        imageUrls,
      };
      delete finalData.images;
      await updateProduct(productUid,sellerUid, finalData);
      toast.success("Product Updated Successfully");
      navigate("/seller/sellerproduct");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-wrapper">
      <div className="update-card">
        <h1 className="update-heading">Update Product</h1>

        <form onSubmit={handleSubmit}>
          {/* Editable basic fields */}
          {Object.entries(form)
            .filter(([key]) => key !== "images") // images handled separately
            .map(([key, value]) => (
              <div className="form-group" key={key}>
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                {typeof value === "string" && value.length > 50 ? (
                  <textarea
                    rows="3"
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                ) : typeof value === "number" ? (
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleInputChange(key, Number(e.target.value))}
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                )}
              </div>
            ))}

          {/* Dynamic Fields */}
          {Object.entries(dynamicFields).map(([key, value]) => (
            <div className="form-group" key={key}>
              <label>{key}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleDynamicFieldChange(key, e.target.value)}
              />
            </div>
          ))}

          {/* Images */}
          <div className="form-group">
            <label>Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                handleInputChange("images", [...form.images, ...[...e.target.files]])
              }
            />
            <div className="preview-box">
              {form.images &&
                form.images.map((img, i) => (
                  <div key={i} className="preview-item">
                    <img
                      src={img instanceof File ? URL.createObjectURL(img) : img}
                      alt="preview"
                    />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleRemoveImage(i)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <button className="update-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
