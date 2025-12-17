import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaCartPlus, FaHeart, FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import "./WishCart.css";
import { useNavigate } from "react-router-dom";
import { deleteWishlistProduct, fetchWishlistApi } from "../../api/cartApi";
import { setWishlistCount, decrementWishlist } from "../../Redux/wishlistSlice";

const WishCart = () => {
  const user = useSelector((state) => state.auth?.user || JSON.parse(localStorage.getItem("user")));
  const dispatch = useDispatch();
  const userUid = user?.userUid;

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
  try {
    setLoading(true);
    const res = await fetchWishlistApi(userUid);
    const list = res || [];

    setWishlist(list);
    dispatch(setWishlistCount(list.length));
  } catch {
    toast.error("Failed to load wishlist");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
     if (!userUid) {
        toast.error("You must be logged in to view the cart");
        navigate("/");
        return;
      }
    if (userUid) fetchWishlist();
  }, [userUid]);


  const handleRemove = async (productUid) => {
  try {
    const res = await deleteWishlistProduct(userUid, productUid);
    setWishlist((prev) =>
      prev.filter((item) => item.productUid !== productUid)
    );
    dispatch(decrementWishlist()); 
    toast.success(res.data?.message || "Product removed from wishlist");
  } catch (error) {
    console.error("Remove wishlist error:", error.response || error.message || error);
    toast.error("Failed to remove item");
  }
};
  const moveToCart = (item) => {
    toast.success(`"${item.productTitle}" moved to cart`);
    // handleRemove(item.productUid);
  };

  return (
    <div className="wishcart-page-wrapper">
      <div className="wishcart-container">

        {/* HEADER */}
        <div className="wishcart-header">
          <h1 className="wishcart-title">
            My Wishlist ({wishlist.length})
          </h1>
          <p className="wishlist-subtitle">
            Items you love, waiting for checkout.
          </p>
        </div>

        {/* EMPTY STATE */}
        {!loading && wishlist.length === 0 ? (
          <div className="empty-state">
            <FaHeart size={48} className="empty-icon" />
            <h3>Your Wishlist is Empty</h3>
            <p className="text-muted">
              Save your favorite items here to purchase later.
            </p>
            <button className="btn-browse-shop">
              <FaArrowLeft /> Explore Products
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div key={item.productUid} className="wishlist-card">

                <div className="card-image-wrapper">
                <img
                  src={
                    item.images?.length > 0
                      ? item.images[0].imageUrl
                      : "/no-image.png"
                  }
                  alt={item.productTitle}
                />
              </div>


                <div className="card-details">
                  <h5 className="item-name">{item.productTitle}</h5>
                  <p className="item-price">
                    ₹{item.productPrice}
                  </p>
                </div>

                <div className="card-actions">
                  <button className="btn-action move-cart"onClick={() => moveToCart(item)}><FaCartPlus /> Move to Cart
                  </button>

                  <button className="btn-action remove-item"onClick={() => handleRemove(item.productUid)}>
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
