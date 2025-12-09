import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { deleteProduct, getSellerProducts } from "../../../api/SellApi";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const sellerId = localStorage.getItem("sellerId");

  const loadProducts = async () => {
    try {
      const data = await getSellerProducts(sellerId);
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      loadProducts();
    } catch (err) {
      toast.error("Delete failed!");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4 text-center">My Products</h2>

      {products.length === 0 ? (
        <p className="text-center">No products found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Description</th>
                <th style={{ width: "180px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={p.imageUrls?.[0] || "https://via.placeholder.com/80"}
                      alt={p.title}
                      width="80"
                      height="80"
                      style={{ objectFit: "cover", borderRadius: "5px" }}
                    />
                  </td>

                  <td>{p.title || "-"}</td>
                  <td>₹ {p.price || 0}</td>
                  <td>{p.stock || 0}</td>
                  <td>{p.category || "-"}</td>

                  <td style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.description || "-"}
                  </td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => navigate(`/seller/update-product/${p.id}`)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
