import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrder } from "../../api/orderApi";
import { clearCart } from "../../Redux/cartSlice";
import "./Checkout.css";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector(state => state.cart.items || []);
  const items = location.state?.items? location.state.items: cartItems.map(item => ({
        productUid: item.productUid,
        quantity: item.quantity,
      }));

  const subtotal = useMemo(() => {
    if (location.state?.items) return 0;
    return cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0
    );
  }, [cartItems, location.state]);

  const shippingAmount = items.length > 0 ? 15 : 0;

  const handlePlaceOrder = async () => {
    if (!items.length) {
      toast.error("No items to checkout");
      return;
    }

    try {
      const payload = {
        paymentMethod: "ONLINE",
        currency: "INR",
        shippingAmount,
        items,
      };
      const res = await createOrder(payload);
      dispatch(clearCart());
      const orderUid = res.data?.orderUid;
      console.log("orderUid checkout " +orderUid);
      navigate("/payment", { state: {orderUid } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">

            <div className="checkout-card">
              <div className="checkout-header">
                <h4>Secure Checkout</h4>
                <span className="checkout-subtitle">
                  Review your order before payment
                </span>
              </div>

              <div className="checkout-body">
                <h6 className="section-title">Order Summary</h6>

                <div className="summary-row">
                  <span>Items</span>
                  <strong>{items.length}</strong>
                </div>

                {subtotal > 0 ? (
                  <>
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>₹{shippingAmount.toFixed(2)}</span>
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-row total">
                      <span>Total</span>
                      <span>₹{(subtotal + shippingAmount).toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted small mt-2">
                    Total will be calculated securely after payment
                  </p>
                )}

                <div className="secure-note">
                  <i className="bi bi-shield-lock-fill" /> Secure payment with SSL encryption
                </div>

                <button
                  className="btn btn-primary btn-lg checkout-btn"
                  onClick={handlePlaceOrder}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
