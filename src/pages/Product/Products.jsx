import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Product.css";
import { ShowProductPaginated } from "../../api/productApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { addToCartApi, addWishlist } from "../../api/cartApi";
import { FaCartPlus, FaShoppingBag, FaHeart } from "react-icons/fa";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const loaderRef = useRef(null);

  const fetchProducts = async (currentPage) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await ShowProductPaginated(currentPage, 10);
      const responseData = response.data || response;

      if (!Array.isArray(responseData.products)) {
        toast.error("Invalid product data");
        return;
      }

      const cleaned = responseData.products.map((p) => ({
        ...p,
        imageUrls: Array.from(new Set(p.imageUrls || [])),
      }));

      setProducts((prev) => [...prev, ...cleaned]);

      if (currentPage + 1 >= responseData.totalPages) {
        setHasMore(false);
      }
    } catch (err) {
      toast.error("Failed to load products");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => {
            const next = prev + 1;
            fetchProducts(next);
            return next;
          });
        }
      },
      { threshold: 0.5 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => loaderRef.current && observer.unobserve(loaderRef.current);
  }, [loading, hasMore]);

  /* ---------------- CART ---------------- */

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) return toast.warning("Please login first");
    try {
      const res = await addToCartApi(product.productUid, 1);
      toast.success(res.message || "Product added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    }
  };


 const handleBuyNow = (product) => {
  if (!isLoggedIn) {
    toast.warning("Please login first");
    return;
  }

  navigate("/checkout", {
    state: {
      items: [
        {
          productUid: product.productUid,
          name: product.title,
          image: product.imageUrls?.[0] || "/no-image.png",
          quantity: 1,
          price: product.price,
        },
      ],
      source: "BUY_NOW",
    },
  });
};

  const handleWishlist = async (productUid) => {
    if (!isLoggedIn) return toast.warning("Please login first");
    try {
      await addWishlist(productUid);
      setWishlist((prev) => [...prev, productUid]);
      toast.success("Added to wishlist");
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="product-page">
      <div className="container">
        <h2 className="page-heading mb-4">Featured Products</h2>

        <div className="product-grid">
          {products.map((product) => (
            <div key={product.productUid} className="product-card">

              <button
                className={`wishlist-icon ${wishlist.includes(product.productUid) ? "active" : ""}`}
                onClick={() => handleWishlist(product.productUid)}
              >
                <FaHeart />
              </button>

              <Link to={`/products/${product.productUid}`}>
                <img src={product.imageUrls?.[0] || "/no-image.png"}alt={product.title} className="product-img-full"
                  onError={(e) => (e.target.src = "/no-image.png")}/>
              </Link>

              <div className="card-content">
                <h5>{product.title}</h5>
                <span className="price">₹ {product.price}</span>
              </div>

              <div className="card-actions">
                <button className="btn glass-btn w-100 mb-2" onClick={() => handleAddToCart(product)}>
                  <FaCartPlus /> Add to Cart
                </button>

                <button className="btn glass-btn-secondary w-100" onClick={() => handleBuyNow(product)}>
                  <FaShoppingBag /> Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {loading && <p className="text-center mt-3">Loading...</p>}
        <div ref={loaderRef} style={{ height: 20 }} />
      </div>
    </div>
  );
}
