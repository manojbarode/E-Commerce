import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Product.css";
import { ShowProduct } from "../../api/productApi";

export default function Product() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await ShowProduct();
        setProducts(products);
      } catch (err) {
        console.error(err);
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
            <div className="card h-100 shadow-sm product-card">
              <div className="image-container">
                <img src={product.images[0]} className="card-img-top product-img" alt={product.title} />
                <span className="badge bg-danger new-badge">New</span>
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text text-truncate" title={product.description}>{product.description}</p>
                <p className="fw-bold mt-auto">₹ {product.price}</p>
                <Link to={`/product/${product.id}`} className="btn btn-primary mt-2 w-100 mb-2">View Details</Link>
                <button className="btn btn-success w-100 mb-2">Add to Cart</button>
                <button className="btn btn-warning w-100">Buy Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
