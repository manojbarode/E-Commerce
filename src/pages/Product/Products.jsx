import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Product.css";
import { ShowProduct } from "../../api/productApi";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [expandedDesc, setExpandedDesc] = useState({}); // Track expanded description per product
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ShowProduct();
        if (!response || !Array.isArray(response.data)) {
          setProducts([]);
          return;
        }
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = () => {
    if (!login) {
      toast.warning("Please login first to add items to cart!", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }
    toast.success("Added to cart!", { position: "top-center" });
  };

  const handleBuyNow = () => {
    if (!login) {
      toast.error("Login required before making a purchase!", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }
    navigate("/Profile/buynow");
  };

  const handleWishlist = (productId) => {
    if (!login) {
      toast.warning("Please login first to use wishlist!", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    setWishlist((prev) => {
      if (prev.includes(productId)) {
        toast.info("Removed from wishlist 💔", {
          position: "top-center",
          autoClose: 1200,
        });
        return prev.filter((id) => id !== productId);
      } else {
        toast.success("Added to wishlist ❤️", {
          position: "top-center",
          autoClose: 1200,
        });
        return [...prev, productId];
      }
    });
  };

  const toggleDescription = (id) => {
    setExpandedDesc((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="product-page">
      <div className="container">
        <div className="page-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
          <h2 className="page-heading mb-0">✨ Featured Products</h2>
          <p className="page-subtitle mb-0">
            Handpicked items just for you – explore, wishlist & shop in style.
          </p>
        </div>

        <div className="product-grid">
          {products.length === 0 && (
            <p className="text-center text-muted w-100">
              No products available right now.
            </p>
          )}

          {products.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const isExpanded = expandedDesc[product.id] || false;
            const showMore = product.description.length > 80;

            return (
              <div key={product.id} className="product-card">
                <button
                  type="button"
                  className={`wishlist-icon ${isWishlisted ? "active" : ""}`}
                  onClick={() => handleWishlist(product.id)}
                >
                  <span>♥</span>
                </button>

                <Link
                  to={`/product/${product.id}`}
                  className="position-relative d-block mb-2"
                >
                  <img
                    src={
                      Array.isArray(product.images) &&
                      product.images.length > 0
                        ? product.images[0]
                        : "/no-image.png"
                    }
                    alt={product.title}
                    className="product-img-full"
                  />

                  <span className="badge new-badge position-absolute top-0 start-0 m-2">
                    New
                  </span>
                </Link>

                {Array.isArray(product.images) &&
                  product.images.length > 1 && (
                    <div className="thumbnail-row">
                      {product.images.slice(0, 4).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="thumbnail"
                          className="thumbnail-img"
                          onClick={(e) =>
                            (e.target
                              .closest(".product-card")
                              .querySelector(".product-img-full").src = img)
                          }
                        />
                      ))}
                    </div>
                  )}

                <div className="card-content">
                  <div className="tag-row">
                    {product.category && (
                      <span className="tag-chip">{product.category}</span>
                    )}
                    {product.subcategory && (
                      <span className="tag-chip soft">{product.subcategory}</span>
                    )}
                  </div>

                  <h5 className="card-title">{product.title}</h5>

                  <p
                    className={`card-text ${isExpanded ? "expanded" : ""}`}
                    onClick={() => showMore && toggleDescription(product.id)}
                  >
                    {isExpanded
                      ? product.description
                      : product.description.slice(0, 80)}
                    {showMore && (
                      <span className="more-toggle">
                        {isExpanded ? " show less" : "...more"}
                      </span>
                    )}
                  </p>

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
