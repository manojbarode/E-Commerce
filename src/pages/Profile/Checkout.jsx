import React, { useMemo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrder } from "../../api/orderApi";
import { clearCart } from "../../Redux/cartSlice";
import { getAddresses, addAddress, updateAddress, deleteAddress } from "../../api/addressApi";
import { Plus, Pencil, Trash2 } from "lucide-react";
import "./Checkout.css";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = useSelector((state) => state.cart.items || []);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "", mobile: "", houseNo: "", street: "", city: "", state: "", country: "", zipCode: "", defaultAddress: false,
  });

  const items = location.state?.items
    ? location.state.items
    : cartItems.map((item) => ({
        productUid: item.productUid,
        name: item.productName,
        image: item.imageUrls?.[0] || item.imageUrl,
        quantity: item.quantity,
        price: item.priceAtTime || item.price,
      }));

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const shippingAmount = items.length > 0 ? 15 : 0;

  const indianStates = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa",
    "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
    "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal"
  ];

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await getAddresses();
        const data = res ||[];
        setAddresses(data);
        const defaultIdx = data.findIndex(a => a.defaultAddress);
        setSelectedAddressIndex(defaultIdx >= 0 ? defaultIdx : (data.length ? 0 : null));
      } catch (err) {
        toast.error("Failed to fetch addresses");
      }
    };
    fetchAddresses();
  }, []);

  // Redirect if no items
  useEffect(() => {
    if (!items.length) {
      toast.error("No items to checkout");
      navigate("/cart");
    }
  }, [items, navigate]);

  const resetForm = () => {
    setFormData({
      fullName: "", mobile: "", houseNo: "", street: "", city: "", state: "", country: "", zipCode: "", defaultAddress: false,
    });
    setEditIndex(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (idx) => {
    setEditIndex(idx);
    setFormData({ ...addresses[idx] });
    setShowForm(true);
  };

  const handleDelete = async (idx) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(addresses[idx].addressUid);
      setAddresses(prev => prev.filter((_, i) => i !== idx));
      if (selectedAddressIndex === idx) setSelectedAddressIndex(null);
      toast.success("Address deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.mobile) return toast.error("Full Name and Mobile are required");

    try {
      if (editIndex !== null) {
        const res = await updateAddress(addresses[editIndex].addressUid, formData);
        const updated = res?.data || res;
        const updatedList = [...addresses];
        updatedList[editIndex] = updated;
        setAddresses(updatedList);
        toast.success("Address updated successfully");
      } else {
        const res = await addAddress(formData);
        const created = res?.data || res;
        setAddresses([...addresses, created]);
        toast.success("Address added successfully");
      }
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save/update address");
    }
  };

  const handlePlaceOrder = async () => {
    if (!items.length) return;
    if (selectedAddressIndex === null) return toast.error("Please select a delivery address");

    try {
      const selectedAddress = addresses[selectedAddressIndex];
      const payload = {
        paymentMethod: "ONLINE",
        currency: "INR",
        shippingAmount,
        items: items.map(({ productUid, quantity, price }) => ({ productUid, quantity, price })),
        addressUid: selectedAddress.addressUid,
      };

      const res = await createOrder(payload);
      dispatch(clearCart());
      navigate("/payment", { state: { orderUid: res.data?.orderUid } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="checkout-card">
              <div className="checkout-header">
                <h4>Secure Checkout</h4>
                <span className="checkout-subtitle">Review your order before payment</span>
              </div>

              <div className="checkout-body">
                <h6 className="section-title">Products</h6>
                {items.map((item) => (
                  <div className="checkout-item" key={item.productUid}>
                    <img src={item.image || "/no-image.png"} alt={item.name} className="checkout-item-img" onError={e => e.target.src="/no-image.png"} />
                    <div className="checkout-item-info">
                      <h6>{item.name || "Product"}</h6>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="checkout-item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}

                <hr />

                <h6 className="section-title">Delivery Address</h6>
                {addresses.map((addr, idx) => (
                  <div key={addr.addressUid} className={`address-card ${selectedAddressIndex===idx?"selected":""}`}>
                    <div onClick={() => setSelectedAddressIndex(idx)} style={{cursor:"pointer"}}>
                      <strong>{addr.fullName}</strong> — {addr.mobile}
                      <p className="text-muted mb-0">{addr.houseNo}, {addr.street}, {addr.city}, {addr.state}, {addr.country} — {addr.zipCode}</p>
                      {addr.defaultAddress && <small className="text-success">Default</small>}
                    </div>
                    <div className="d-flex gap-2 mt-1">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(idx)}><Pencil size={16}/> Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(idx)}><Trash2 size={16}/> Delete</button>
                    </div>
                  </div>
                ))}

                {!showForm && (
                  <button className="btn btn-outline-primary w-100 my-2" onClick={handleAddNew}><Plus size={18}/> Add New Address</button>
                )}

                {showForm && (
                  <form className="border p-3 rounded bg-light" onSubmit={handleSubmit}>
                    <div className="row g-2">
                      {["fullName","mobile","houseNo","street","city","state","country","zipCode"].map(field => (
                        <div className="col-md-6" key={field}>
                          <label className="form-label">{field.charAt(0).toUpperCase()+field.slice(1)}</label>
                          {field==="state"?(
                            <select className="form-select" value={formData.state} onChange={e => setFormData({...formData,state:e.target.value})}>
                              <option value="">Select State</option>
                              {indianStates.map(st => <option key={st} value={st}>{st}</option>)}
                            </select>
                          ):(
                            <input type={field==="mobile"?"tel":"text"} className="form-control" value={formData[field]} required={field==="fullName"||field==="mobile"} onChange={e=>setFormData({...formData,[field]:field==="mobile"?e.target.value.replace(/[^0-9]/g,""):e.target.value})}/>
                          )}
                        </div>
                      ))}
                      <div className="col-md-12 form-check mt-2">
                        <input type="checkbox" className="form-check-input" checked={formData.defaultAddress} onChange={e=>setFormData({...formData,defaultAddress:e.target.checked})} id="defaultAddress"/>
                        <label className="form-check-label" htmlFor="defaultAddress">Set as default address</label>
                      </div>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <button type="submit" className="btn btn-primary w-50">{editIndex!==null?"Update":"Save"}</button>
                      <button type="button" className="btn btn-secondary w-50" onClick={resetForm}>Cancel</button>
                    </div>
                  </form>
                )}

                <hr />

                <div className="summary-row">
                  <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span><span>₹{shippingAmount.toFixed(2)}</span>
                </div>
                <div className="summary-divider"/>
                <div className="summary-row total">
                  <span>Total</span><span>₹{(subtotal+shippingAmount).toFixed(2)}</span>
                </div>

                <div className="secure-note">🔒 Secure payment with SSL encryption</div>

                <button className="btn btn-primary btn-lg checkout-btn" onClick={handlePlaceOrder} disabled={!items.length || selectedAddressIndex===null}>
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
