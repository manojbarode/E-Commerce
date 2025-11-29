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
          <div key={product.id} className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm">

              <Link to={`/product/${product.id}`} className="position-relative">
                <img
                  src={product.images[0]}
                  className="card-img-top product-img-full rounded-2"
                  alt={product.title}
                />
                <span className="badge bg-danger position-absolute top-0 start-0 m-2">New</span>
              </Link>

              <div className="card-body d-flex flex-column">
                
                {/* TRUNCATED TITLE */}
                <h5 className="card-title text-truncate" title={product.title}>
                  {product.title}
                </h5>

                {/* TRUNCATED DESCRIPTION */}
                <p className="card-text text-truncate" title={product.description}>
                  {product.description}
                </p>

                <p className="fw-bold mt-auto">₹ {product.price}</p>

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
