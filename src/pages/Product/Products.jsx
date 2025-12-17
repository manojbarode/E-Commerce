import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Product.css";
import { ShowProduct } from "../../api/productApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, setProductUid } from "../../Redux/productSlice";
import { setAmount, setQuantity, setSellerUid } from "../../Redux/orderSlice";
import { addToCartApi, addwishlist } from "../../api/cartApi";
import { FaCartPlus, FaShoppingBag, FaHeart } from "react-icons/fa";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn, userUid } = useSelector((state) => state.auth);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ShowProduct();
        if (!Array.isArray(response)) {
          setProducts([]);
          return;
        }

        const cleaned = response.map((p) => ({
          ...p,
          imageUrls: Array.from(new Set(p.imageUrls || [])),
        }));

        setProducts(cleaned);
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Failed to fetch products");
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);


  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isLoggedIn) return;

      try {
        const response = await fetchWishlist(userUid);
        const productUids = response.data.map((item) => item.productUid);
        setWishlist(productUids);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };

    fetchWishlist();
  }, [isLoggedIn, userUid]);

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      toast.warning("Please login first");
      return;
    }

    try {
      const res = await addToCartApi(product.productUid, 1, userUid);

      if (res.status === 200 || res.status === 201) {
        toast.success(res.message || "Product added to cart");
      } else {
        toast.error(res.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("Something went wrong");
    }
  };

  const handleBuyNow = (product) => {
    if (!isLoggedIn) {
      toast.warning("Please login first");
      return;
    }

    dispatch(setProductUid(product.productUid));
    dispatch(setSellerUid(product.sellerUid));
    dispatch(setAmount(Number(product.price)));
    dispatch(setQuantity(1));
    dispatch(addProduct(product));

    navigate("/buynow");
  };

  const handleWishlist = async (productUid) => {
    if (!isLoggedIn) {
      toast.warning("Please login first");
      return;
    }

    try {
      const response = await addwishlist(userUid, productUid);

      setWishlist((prev) =>
        prev.includes(productUid)
          ? prev.filter((id) => id !== productUid)
          : [...prev, productUid]
      );

      toast.success(response.data.message);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update wishlist"
      );
    }
  };

  const imageClick = (product) => {
    dispatch(setProductUid(product.productUid));
    dispatch(addProduct(product));
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
              product.imageUrls?.[0] || "/no-image.png";

            return (
              <div key={productUid} className="product-card">
                {/* WISHLIST ICON */}
                <button type="button" className={`wishlist-icon ${wishlist.includes(productUid) ? "active" : ""}`}
                  onClick={() => handleWishlist(productUid)}>
                  <FaHeart />
                </button>

                {/* IMAGE */}
                <Link
                  to={`/productDetails`}
                  className="position-relative d-block mb-2"
                >
                  <img src={mainImage} alt={product.title} className="product-img-full"onClick={() => imageClick(product)}/>
                  <span className="badge new-badge position-absolute top-0 start-0 m-2">
                    New
                  </span>
                </Link>

                {/* CONTENT */}
                <div className="card-content">
                  <h5 className="card-title">{product.title}</h5>
                  <div className="price-row">
                    <span className="price">₹ {product.price}</span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="card-actions">
                  <button className="btn glass-btn w-100 mb-2" onClick={() => handleAddToCart(product)}>
                    <FaCartPlus /> Move to Cart
                  </button>

                  <button className="btn glass-btn-secondary w-100" onClick={() => handleBuyNow(product)}>
                    <FaShoppingBag /> Buy Now
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
