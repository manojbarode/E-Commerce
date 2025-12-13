import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductById } from "../../api/productApi";
import { useSelector } from "react-redux";
import { Carousel } from "react-bootstrap"; // React-Bootstrap Carousel
import "./ProductDetails.css";

export default function ProductDetails() {
  const productUid = useSelector((state) => state.product.productUid);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch product by UID
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await getProductById(productUid);
        setProduct(res);
      } catch (error) {
        console.error("Error loading product", error);
      }
    };
    if (productUid) loadProduct();
  }, [productUid]);

  if (!product) return <div className="text-center mt-5">Loading...</div>;

  const handleQuantityChange = (e) => {
    let val = parseInt(e.target.value);
    if (val < 1) val = 1;
    if (val > product.stock) val = product.stock;
    setQuantity(val);
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="row g-4">

        {/* Left Column - Carousel + Buttons */}
        <div className="col-md-6">
          <Link to="/" className="btn btn-dark mb-3">← Back to Home</Link>

          <div className="sticky-left mb-3">
            {/* Carousel */}
            {product.imageUrls?.length > 0 && (
              <Carousel variant="dark" interval={3000}>
                {product.imageUrls.map((img, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100 product-main-img"
                      src={img}
                      alt={`slide-${index}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            )}

            {/* Buttons under image */}
            <div className="d-flex flex-wrap gap-2 mt-3">
              <Link
                to={`/cart?product=${productUid}&qty=${quantity}`}
                className="btn btn-success flex-fill"
              >
                Add to Cart
              </Link>
              <Link
                to={`/buynow?product=${productUid}&qty=${quantity}`}
                className="btn btn-warning flex-fill"
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="col-md-6">
          <div className="details-box shadow">
            <h2 className="fw-bold">{product.title}</h2>
            <h3 className="text-primary mt-2">₹ {product.price}</h3>
            <p className="mt-3">{product.description}</p>
            <p><strong>Stock:</strong> {product.stock}</p>

            <h5 className="mt-4">Specifications</h5>
            <ul className="mt-2">
              {product.dynamicFields &&
                Object.entries(product.dynamicFields).map(([key, value], idx) => (
                  <li key={idx}><strong>{key}:</strong> {value}</li>
                ))}
            </ul>

            {/* Quantity Selector */}
            <div className="mt-4">
              <label htmlFor="quantity" className="form-label"><strong>Quantity:</strong></label>
              <input
                type="number"
                id="quantity"
                className="form-control w-25"
                value={quantity}
                min={1}
                max={product.stock}
                onChange={handleQuantityChange}
              />
              {quantity > product.stock && (
                <small className="text-danger">Only {product.stock} left in stock</small>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
