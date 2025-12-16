import React, { useState } from "react";
import { FaTrashAlt, FaPlus, FaMinus, FaHeart, FaArrowLeft } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Sony WH-1000XM5 Wireless",
      category: "Electronics",
      price: 299.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      name: "Apple Watch Series 9",
      category: "Wearables",
      price: 399.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      name: "Nike Air Max 270",
      category: "Fashion",
      price: 150.00,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ]);

  const [wishlist, setWishlist] = useState([]);

  const handleQuantity = (id, type) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: type === "inc" ? item.quantity + 1 : Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleWishlist = (id) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 15.00;
  const total = subtotal + shipping;

  return (
    <div className="cart-wrapper">
      <div className="cart-container">
        
        {/* Header */}
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <span className="cart-count">{cartItems.length} items</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <button className="btn-continue">Start Shopping</button>
          </div>
        ) : (
          <div className="cart-content">
            
            {/* Left Side: Items */}
            <div className="cart-items-section">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item-card">
                  <div className="item-img-container">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="item-details">
                    <div className="item-info">
                      <span className="item-category">{item.category}</span>
                      <h4 className="item-name">{item.name}</h4>
                    </div>

                    <div className="item-controls">
                      <div className="quantity-wrapper">
                        <button onClick={() => handleQuantity(item.id, "dec")}><FaMinus size={10} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantity(item.id, "inc")}><FaPlus size={10} /></button>
                      </div>
                      <div className="price-tag">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="item-actions">
                    <button 
                      className={`action-btn wishlist-btn ${wishlist.includes(item.id) ? 'active' : ''}`}
                      onClick={() => toggleWishlist(item.id)}
                    >
                      <FaHeart />
                    </button>
                    <button className="action-btn remove-btn" onClick={() => handleRemove(item.id)}>
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="continue-shopping">
                <FaArrowLeft /> <span>Continue Shopping</span>
              </div>
            </div>

            {/* Right Side: Summary */}
            <div className="cart-summary-section">
              <div className="summary-card">
                <h3>Order Summary</h3>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping Estimate</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax Estimate</span>
                  <span>$0.00</span>
                </div>
                
                <div className="divider"></div>
                
                <div className="summary-row total-row">
                  <span>Order Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <button className="btn-checkout">Checkout Now</button>
                
                <div className="secure-badge">
                  <small>🔒 Secure Checkout</small>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;