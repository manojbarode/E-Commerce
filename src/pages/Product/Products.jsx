import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Product.css";
import { ShowProduct } from "../../api/productApi";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ShowProduct();
        if (!Array.isArray(response)) return setProducts([]);

        // Clean duplicate images
        const cleaned = response.map((p) => ({
          ...p,
          imageUrls: Array.from(new Set(p.imageUrls || [])),
        }));

        setProducts(cleaned);
        const defaults = {};
        cleaned.forEach((p) => {
          defaults[p.productUid] = p.imageUrls?.[0] || "/no-image.png";
        });

        setSelectedImages(defaults);

      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = () => {
    if (!login) {
      return toast.warning("Please login first to add items to cart!");
    }
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!login) {
      return toast.error("Login required before making a purchase!");
    }
    navigate("/Profile/buynow");
  };

  const handleWishlist = (productUid) => {
    if (!login) {
      return toast.warning("Please login first to use wishlist!");
    }

    setWishlist((prev) => {
      if (prev.includes(productUid)) {
        toast.info("Removed from wishlist");
        return prev.filter((id) => id !== productUid);
      } else {
        toast.success("Added to wishlist");
        return [...prev, productUid];
      }
    });
  };

  const handleThumbnailClick = (productUid, imgUrl) => {
    setSelectedImages((prev) => ({
      ...prev,
      [productUid]: imgUrl,
    }));
  };
  return (
    <div className="product-page">
      <div className="container">

        <div className="page-header d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <h2 className="page-heading">Featured Products</h2>
          <p className="page-subtitle">Explore top deals and best picks</p>
        </div>

        <div className="product-grid">

          {products.length === 0 && (
            <p className="text-center text-muted w-100">
              No products available right now.
            </p>
          )}

          {products.map((product) => {
            const productUid = product.productUid;

            const mainImage =
              selectedImages[productUid] ||
              product.imageUrls?.[0] ||
              "/no-image.png";

            const thumbnails =
              product.imageUrls?.filter((img) => img !== mainImage) || [];

            return (
              <div key={productUid} className="product-card">

                <button
                  type="button"
                  className={`wishlist-icon ${
                    wishlist.includes(productUid) ? "active" : ""
                  }`}
                  onClick={() => handleWishlist(productUid)}
                >
                  ♥
                </button>

                <Link
                  to={`/product/${productUid}`}
                  className="position-relative d-block mb-2"
                >
                  <img
                    src={mainImage}
                    alt={product.title}
                    className="product-img-full"
                  />
                  <span className="badge new-badge position-absolute top-0 start-0 m-2">
                    New
                  </span>
                </Link>

                {thumbnails.length > 0 && (
                  <div className="thumbnail-row no-scrollbar">
                    {thumbnails.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        className="thumbnail-img"
                        onClick={() => handleThumbnailClick(productUid, img)}
                      />
                    ))}
                  </div>
                )}

                <div className="card-content">
                  <h5 className="card-title">{product.title}</h5>
                  <div className="price-row">
                    <span className="price">₹ {product.price}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className="btn glass-btn w-100 mb-2"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>

                  <button
                    className="btn glass-btn-secondary w-100"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
