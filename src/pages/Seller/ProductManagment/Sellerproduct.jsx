import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { deleteProduct, getSellerProducts } from "../../../api/SellApi";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const sellerId = localStorage.getItem("sellerId");

  useEffect(() => {
    loadProducts();
  }, [loadProducts()]);

  const loadProducts = async () => {
    try {
      const data = await getSellerProducts(sellerId);
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    }
  };

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

      <div className="row">
        {products.length === 0 && <p className="text-center">No products found.</p>}

        {products.map((p) => (
          <div key={p.id} className="col-md-4 mb-4">
            <div className="card shadow-sm p-2">
              <img src={p.imageUrls[0]} alt={p.title} className="card-img-top"style={{ height: "200px", objectFit: "cover" }}/>
              <div className="card-body">
                <h5>{p.title}</h5>
                <p>₹ {p.price}</p>
                <p>Stock: {p.stock}</p>

                <div className="d-flex justify-content-between">
                  <button className="btn btn-warning w-50 me-2" onClick={() => navigate(`/seller/update-product/${p.id}`)}>
                    Edit
                  </button>
                  <button className="btn btn-danger w-50" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
