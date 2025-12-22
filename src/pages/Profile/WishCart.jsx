import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaCartPlus, FaHeart, FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./WishCart.css";
import { useNavigate } from "react-router-dom";
import {fetchWishlistApi,deleteWishlistProduct, addToCartApi} from "../../api/cartApi";
import {setWishlistCount,decrementWishlist} from "../../Redux/wishlistSlice";

const WishCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn} = useSelector((state) => state.auth);
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const list = await fetchWishlistApi();
      setWishlist(list || []);
      dispatch(setWishlistCount(list?.length || 0));
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Please login to view your wishlist");
        navigate("/");
      } else {
        toast.error("Failed to load wishlist");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productUid) => {
    try {
      await deleteWishlistProduct(productUid);
      setWishlist(prev =>
        prev.filter(item => item.productUid !== productUid)
      );
      dispatch(decrementWishlist());
      toast.success("Product removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const moveToCart = async(item) => {
    toast.success(`"${item.productTitle}" moved to cart`);
    if (!isLoggedIn) return toast.warning("Please login first");
      try {
        const res = await addToCartApi(item.productUid, 1);
        toast.success(res.message || "Product added to cart");
      } 
      catch (err) {
        toast.error(err.response?.data?.message ||err.response?.data?.error ||"Failed to add product");
      }
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
            <button
              className="btn-browse-shop"
              onClick={() => navigate("/")}
            >
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
                  <p className="item-price">₹{item.productPrice}</p>
                </div>

                <div className="card-actions">
                  <button
                    className="btn-action move-cart"
                    onClick={() => moveToCart(item)}
                  >
                    <FaCartPlus /> Move to Cart
                  </button>

                  <button
                    className="btn-action remove-item"
                    onClick={() => handleRemove(item.productUid)}
                  >
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
