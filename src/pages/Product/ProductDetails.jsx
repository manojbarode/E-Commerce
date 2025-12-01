import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../../api/productApi";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res);
      } catch (error) {
        console.error("Error loading product", error);
      }
    };
    loadProduct();
  }, [id]);

  if (!product) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4 mb-5">

      {/* BACK BUTTON */}
      <Link to="/" className="btn btn-dark mb-3">← Back to Home</Link>

      <div className="row g-4">

        {/* LEFT – IMAGES */}
        <div className="col-md-6">
          <div id="productCarousel" className="carousel slide shadow rounded">

            <div className="carousel-inner">
              {product.images.map((img, i) => (
                <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                  <img src={img} className="d-block w-100 product-main-img" alt={`slide-${i}`} />
                </div>
              ))}
            </div>

            {/* Arrows only if multiple images */}
            {product.images.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon"></span>
                </button>
              </>
            )}

          </div>
        </div>

        {/* RIGHT – SCROLLABLE DETAILS */}
        <div className="col-md-6">
          <div className="details-box shadow">

            <h2 className="fw-bold">{product.title}</h2>
            <p className="text-muted">{product.category} / {product.subcategory}</p>

            <h3 className="text-primary">₹ {product.price}</h3>

            <p className="mt-3">{product.description}</p>

            <p><strong>Stock:</strong> {product.stock}</p>

            <h5 className="mt-4">Specifications</h5>
            <ul className="mt-2">
              {Object.entries(product.extra).map(([key, value], idx) => (
                <li key={idx}>
                  <strong>{key.replace("_", " ")}:</strong> {value}
                </li>
              ))}
            </ul>

            {/* BUTTONS */}
            <div className="mt-4 d-flex flex-wrap gap-2">
              <button className="btn btn-success px-4">Add to Cart</button>
              <button className="btn btn-warning px-4">Buy Now</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
