import React, { useState } from "react";
import { FaTrashAlt, FaCartPlus, FaHeart, FaArrowLeft } from "react-icons/fa";
import "./WishCart.css";

const WishCart = () => {
  // Example wishlist items with better images/data
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: "Sleek Minimalist Backpack",
      price: 149.99,
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1550009153-f76150d603e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      name: "Bose QuietComfort Earbuds II",
      price: 249.00,
      category: "Audio",
      image: "https://images.unsplash.com/photo-1628178652458-751d02c525f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      name: "Classic Espresso Machine",
      price: 499.99,
      category: "Home Goods",
      image: "https://images.unsplash.com/photo-1534065609653-e910e53a25d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ]);

  const handleRemove = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const moveToCart = (item) => {
    // In a real application, you would make an API call here.
    alert(`Moved "${item.name}" to cart!`);
    
    // Remove from wishlist state
    setWishlist((prev) => prev.filter((i) => i.id !== item.id));
  };

  return (
    <div className="wishcart-page-wrapper">
      <div className="wishcart-container">
        
        {/* Header */}
        <div className="wishcart-header">
            <h1 className="wishcart-title">My Wishlist ({wishlist.length})</h1>
            <p className="wishlist-subtitle">Items you love, waiting for checkout.</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <FaHeart size={48} className="empty-icon"/>
            <h3>Your Wishlist is Empty</h3>
            <p className="text-muted">Save your favorite items here to purchase later.</p>
            <button className="btn-browse-shop"><FaArrowLeft /> Explore Products</button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-card">
                
                <div className="card-image-wrapper">
                    <img src={item.image} alt={item.name} />
                </div>
                
                <div className="card-details">
                    <span className="item-category">{item.category}</span>
                    <h5 className="item-name">{item.name}</h5>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
                
                <div className="card-actions">
                  <button className="btn-action move-cart" onClick={() => moveToCart(item)}>
                    <FaCartPlus /> Move to Cart
                  </button>
                  <button className="btn-action remove-item" onClick={() => handleRemove(item.id)}>
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishCart;