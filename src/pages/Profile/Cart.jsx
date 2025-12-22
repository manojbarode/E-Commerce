import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaPlus, FaMinus, FaHeart, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Cart.css";
import { deleteCartItem, fetchCartdata } from "../../api/cartApi";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, updateQuantity, setCartItems, clearCart } from "../../Redux/cartSlice";
import { toast } from "react-toastify";
import { logoutUser } from "../../Redux/authSlice";

const Cart = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items || []);  
  const user = useSelector((state) => state.auth?.user || JSON.parse(localStorage.getItem("user")));
  const userUid = user?.userUid;
  

  useEffect(() => {
    if (!userUid) {
    toast.error("You must be logged in to view the cart");
    navigate("/");
    return;
  }
   const fetchCart = async () => {
  try {
    if (!userUid) return;

    const response = await fetchCartdata(userUid);

    // Ensure correct structure
    const items = response?.data?.data?.items || response?.data?.items || [];
    if (!Array.isArray(items)) {
      console.warn("Unexpected cart data structure:", response);
      dispatch(setCartItems([]));
    } else {
      dispatch(setCartItems(items));
    }

  } catch (error) {
    // toast.error("Failed to load cart");
  } finally {
    setLoading(false);
  }
};


    fetchCart();
  }, [userUid, dispatch]);

  const handleQuantity = (productUid, type) => {
    const item = cartItems.find((item) => item.productUid === productUid);
    if (!item) return;

    const newQty = type === "inc" 
      ? item.quantity + 1 
      : Math.max(item.quantity - 1, 1);

    dispatch(updateQuantity({ id: productUid, quantity: newQty }));
  };

  const handleRemove = async (productUid) => {
  try {
    if (!userUid) {
      toast.error("Please login first");
      navigate("/");
      return;
    }

    const res = await deleteCartItem(userUid, productUid);
    // console.log("Delete response:", res);
    dispatch(removeItem(productUid));
    toast.success("Item removed from cart");
  } catch (error) {
    console.error("Failed to remove item:", error);
    toast.error("Failed to remove item");
  }
};

  const toggleWishlist = (productUid) => {
    setWishlist((prev) =>
      prev.includes(productUid)
        ? prev.filter((i) => i !== productUid)
        : [...prev, productUid]
    );
    
    const isAdded = !wishlist.includes(productUid);
    toast.success(isAdded ? "Added to wishlist" : "Removed from wishlist");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.priceAtTime || item.price || 0) * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="cart-wrapper">
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-wrapper">
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <span className="cart-count">{cartItems.length} items</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <button 
              className="btn-continue-shopping"
              onClick={handleContinueShopping}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            {/* LEFT - Cart Items */}
            <div className="cart-items-section">
              {cartItems.map((item) => (
                <div key={item.productUid} className="cart-item-card">
                  <div className="item-img-container">
                    <img
                      src={item.imageUrls?.[0] || item.imageUrl || "/no-image.png"}
                      alt={item.productName || "Product"}
                      onError={(e) => {
                        e.target.src = "/no-image.png";
                      }}
                    />
                  </div>

                  <div className="item-details">
                    <h4 className="item-name">{item.productName || "Unknown Product"}</h4>
                    <p className="item-price-single">
                      ₹{(item.priceAtTime || item.price || 0).toFixed(2)} each
                    </p>

                    <div className="item-controls">
                      <div className="quantity-wrapper">
                        <button
                          className="qty-btn"
                          onClick={() => handleQuantity(item.productUid, "dec")}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus size={10} />
                        </button>

                        <span className="qty-display">{item.quantity}</span>

                        <button
                          className="qty-btn"
                          onClick={() => handleQuantity(item.productUid, "inc")}
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>

                      <div className="price-tag">
                        ₹{((item.priceAtTime || item.price || 0) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="item-actions">
                    <button
                      className={`action-btn wishlist-btn ${
                        wishlist.includes(item.productUid) ? "active" : ""
                      }`}
                      onClick={() => toggleWishlist(item.productUid)}
                      title="Add to wishlist"
                    >
                      <FaHeart />
                    </button>

                    <button
                      className="action-btn remove-btn"
                      onClick={() => handleRemove(item.productUid)}
                      title="Remove from cart"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}

              <div className="continue-shopping" onClick={handleContinueShopping}>
                <FaArrowLeft /> <span>Continue Shopping</span>
              </div>
            </div>

            {/* RIGHT - Order Summary */}
            <div className="cart-summary-section">
              <div className="summary-card">
                <h3>Order Summary</h3>

                <div className="summary-row">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping > 0 ? `₹${shipping.toFixed(2)}` : "FREE"}</span>
                </div>

                <div className="divider"></div>

                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <button 
                  className="btn-checkout"
                  onClick={handleCheckout}
                >
                  Checkout Now
                </button>

                <p className="secure-checkout-text">
                  🔒 Secure Checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;