import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetails.css";
import { getProductById } from "../../api/productApi";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5 mb-5">
      <Link to="/" className="btn btn-secondary mb-3">← Back to Home</Link>
      <div className="row">
        <div className="col-md-6">
          <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {product.images.map((img, i) => (
                <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                  <img src={img} className="d-block w-100 rounded" alt={`Slide ${i}`} />
                </div>
              ))}
            </div>
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
        <div className="col-md-6">
          <h2>{product.title}</h2>
          <p className="text-muted">{product.category} / {product.subcategory}</p>
          <h4 className="text-primary">₹ {product.price}</h4>
          <p className="mt-3">{product.description}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <h5 className="mt-4">Specifications</h5>
          <ul>
            {Object.entries(product.extra).map(([key, value], idx) => (
              <li key={idx}><strong>{key.replace("_"," ")}:</strong> {value}</li>
            ))}
          </ul>
          <button className="btn btn-success mt-3 me-2">Add to Cart</button>
          <button className="btn btn-warning mt-3">Buy Now</button>
        </div>
      </div>
    </div>
  );
}
