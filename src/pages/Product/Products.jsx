import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Css/Product.css";
import { ShowProduct } from "../../api/productApi";

export default function Product() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const products = await ShowProduct();
      setProducts(products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };
  fetchProducts();
}, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 fw-bold text-center">Featured Products</h2>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={product.images[0]}
                className="card-img-top"
                alt={product.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text text-truncate">{product.description}</p>
                <p className="fw-bold mt-auto">₹ {product.price}</p>
                <Link
                  to={`/product/${product.id}`}
                  className="btn btn-primary mt-2 w-100"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
