import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", image: null, bio: "" });
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({ label: "Home", fullAddress: "", city: "", state: "", pincode: "", isDefault: false });
  const [userStats, setUserStats] = useState({ totalOrders: 0, cartItems: 0, wishlistItems: 0, addresses: 0 });

  const API_BASE = "http://localhost:8081/api"; // Replace with your backend URL

  // Fetch profile, addresses, cart, wishlist, total orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Profile
        const profileRes = await axios.get(`${API_BASE}/users/profile`);
        setProfile(profileRes.data);

        // 2. Fetch Addresses
        const addressRes = await axios.get(`${API_BASE}/users/addresses`);
        setAddresses(addressRes.data);

        // 3. Fetch Cart & Wishlist & Orders counts
        const statsRes = await axios.get(`${API_BASE}/users/stats`);
        setUserStats(statsRes.data);

        setLoading(false);
      } catch (err) {
        // console.error(err);
        toast.error("Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update profile
  const handleProfileSubmit = async () => {
    const { name, email, phone } = profile;
    if (!name || !email || phone.length !== 10) {
      toast.error("Invalid profile details");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`${API_BASE}/users/profile`, profile);
      toast.success("Profile updated successfully");
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
      setLoading(false);
    }
  };

  // Image update
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5_000_000) {
      toast.error("Image size must be under 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${API_BASE}/users/profile/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfile(prev => ({ ...prev, image: res.data.image }));
      toast.success("Profile picture updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    }
  };

  // Address modal handlers
  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({ label: "Home", fullAddress: "", city: "", state: "", pincode: "", isDefault: false });
    setShowAddressModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm(address);
    setShowAddressModal(true);
  };

  const handleSaveAddress = async () => {
    const { fullAddress, city, pincode } = addressForm;
    if (!fullAddress || !city || pincode.length !== 6) {
      toast.error("Invalid address details");
      return;
    }

    try {
      if (editingAddress) {
        // Update address
        const res = await axios.put(`${API_BASE}/users/addresses/${editingAddress.id}`, addressForm);
        setAddresses(prev => prev.map(a => (a.id === editingAddress.id ? res.data : a)));
        toast.success("Address updated");
      } else {
        // Add new address
        const res = await axios.post(`${API_BASE}/users/addresses`, addressForm);
        setAddresses(prev => [...prev, res.data]);
        toast.success("Address added");
      }
      setShowAddressModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await axios.delete(`${API_BASE}/users/addresses/${id}`);
      setAddresses(prev => prev.filter(a => a.id !== id));
      toast.success("Address deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await axios.put(`${API_BASE}/users/addresses/${id}/default`);
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
      toast.success("Default address updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to set default address");
    }
  };

  const quickLinks = [
    { icon: "🛒", title: "My Cart", count: userStats.cartItems, path: "/cart" },
    { icon: "📦", title: "My Orders", count: userStats.totalOrders, path: "/profile/userOrders" },
    { icon: "❤️", title: "Wishlist", count: userStats.wishlistItems, path: "/wishlist" },
    { icon: "📍", title: "Addresses", count: addresses.length, action: () => setActiveTab("addresses") }
  ];

  return (
    <div className="profile-container">
      <div className="container py-5">
        {/* Header */}
        <div className="profile-header text-center mb-5">
          <h1 className="profile-main-title">
            <span className="title-icon">👤</span> My Profile
          </h1>
          <p className="profile-subtitle">Manage your account and preferences</p>
        </div>

        {/* Quick Links */}
        <div className="row g-3 mb-4">
          {quickLinks.map((link, index) => (
            <div key={index} className="col-6 col-md-3">
              <div 
                className="quick-link-card"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => link.action ? link.action() : navigate(link.path)}
              >
                <div className="quick-link-icon">{link.icon}</div>
                <h3 className="quick-link-count">{link.count}</h3>
                <p className="quick-link-title">{link.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="profile-sidebar">
              <div className="sidebar-nav">
                <button className={`nav-item ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
                  <span className="nav-icon">👤</span> Profile Info
                </button>
                <button className={`nav-item ${activeTab === "addresses" ? "active" : ""}`} onClick={() => setActiveTab("addresses")}>
                  <span className="nav-icon">📍</span> Addresses
                </button>
                <button className={`nav-item ${activeTab === "security" ? "active" : ""}`} onClick={() => setActiveTab("security")}>
                  <span className="nav-icon">🔒</span> Security
                </button>
                <button className="nav-item" onClick={() => navigate("/profile/userOrders")}>
                  <span className="nav-icon">📦</span> My Orders
                </button>
                <button className="nav-item" onClick={() => navigate("/cart")}>
                  <span className="nav-icon">🛒</span> Shopping Cart
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="content-card">
                <div className="card-header-custom">
                  <div>
                    <h3 className="card-title-custom">Personal Information</h3>
                    <p className="card-subtitle-custom">Update your profile details</p>
                  </div>
                </div>
                <div className="card-body-custom">
                  {/* Profile Image */}
                  <div className="profile-image-section">
                    <label htmlFor="imageUpload" className="image-upload-label">
                      <div className="profile-image-wrapper">
                        {profile.image ? (
                          <img src={profile.image} alt="Profile" className="profile-image" />
                        ) : (
                          <div className="profile-image-placeholder">
                            <span className="placeholder-icon">📷</span>
                            <span className="placeholder-text">Upload Photo</span>
                          </div>
                        )}
                        <div className="image-overlay"><span>Change</span></div>
                      </div>
                      <input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} className="d-none"/>
                    </label>
                  </div>

                  {/* Form Fields */}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label-custom">Full Name *</label>
                      <div className="input-group-custom">
                        <span className="input-icon">👤</span>
                        <input type="text" className="form-control-custom" value={profile.name} onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}/>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-custom">Phone Number *</label>
                      <div className="input-group-custom">
                        <span className="input-icon">📱</span>
                        <input type="text" className="form-control-custom" value={profile.phone} maxLength={10} onChange={e => setProfile(prev => ({ ...prev, phone: e.target.value.replace(/\D/g,'') }))}/>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label-custom">Email Address *</label>
                      <div className="input-group-custom">
                        <span className="input-icon">📧</span>
                        <input type="email" className="form-control-custom" value={profile.email} onChange={e => setProfile(prev => ({ ...prev, email: e.target.value }))}/>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label-custom">Bio (Optional)</label>
                      <textarea className="form-control-custom" value={profile.bio} onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))} rows={3} style={{ resize:'none', paddingLeft:'1rem' }}/>
                    </div>
                  </div>

                  <button onClick={handleProfileSubmit} className="btn-save-profile" disabled={loading}>
                    {loading ? <>Saving...</> : <>💾 Save Changes</>}
                  </button>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="content-card">
                <div className="card-header-custom">
                  <div>
                    <h3 className="card-title-custom">Saved Addresses</h3>
                    <p className="card-subtitle-custom">Manage your delivery addresses</p>
                  </div>
                  <button className="btn-add-address" onClick={handleAddAddress}>+ Add New Address</button>
                </div>
                <div className="card-body-custom">
                  {addresses.length === 0 ? (
                    <div className="empty-addresses">
                      <div className="empty-icon">📍</div>
                      <h4>No addresses saved</h4>
                      <p>Add your first delivery address</p>
                      <button className="btn-add-first" onClick={handleAddAddress}>Add Address</button>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {addresses.map((addr, index) => (
                        <div key={addr.id} className="col-md-6">
                          <div className="address-card">
                            <div className="address-header">
                              <span className="address-label">{addr.label}</span>
                              {addr.isDefault && <span className="default-badge">Default</span>}
                            </div>
                            <p className="address-text">{addr.fullAddress}</p>
                            <p className="address-text">{addr.city}, {addr.state} - {addr.pincode}</p>
                            <div className="address-actions">
                              <button className="btn-address-action edit" onClick={() => handleEditAddress(addr)}>✏️ Edit</button>
                              <button className="btn-address-action delete" onClick={() => handleDeleteAddress(addr.id)}>🗑️ Delete</button>
                              {!addr.isDefault && <button className="btn-address-action default" onClick={() => handleSetDefaultAddress(addr.id)}>⭐ Set Default</button>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="content-card">
                <div className="card-header-custom">
                  <div>
                    <h3 className="card-title-custom">Security Settings</h3>
                    <p className="card-subtitle-custom">Manage your password and security</p>
                  </div>
                </div>
                <div className="card-body-custom">
                  <div className="security-section">
                    <div className="security-item">
                      <div><h5>Change Password</h5><p>Update your password regularly for better security</p></div>
                      <button className="btn-security">Change</button>
                    </div>
                    <div className="security-item">
                      <div><h5>Two-Factor Authentication</h5><p>Add an extra layer of security to your account</p></div>
                      <button className="btn-security">Enable</button>
                    </div>
                    <div className="security-item">
                      <div><h5>Login Activity</h5><p>View your recent login history</p></div>
                      <button className="btn-security">View</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="modal-content-custom" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h4>{editingAddress ? "Edit Address" : "Add New Address"}</h4>
              <button className="btn-close-modal" onClick={() => setShowAddressModal(false)}>✕</button>
            </div>
            <div className="modal-body-custom">
              <div className="mb-3">
                <label className="form-label-custom">Address Label</label>
                <select className="form-control-custom" value={addressForm.label} onChange={e => setAddressForm(prev => ({ ...prev, label: e.target.value }))}>
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label-custom">Full Address *</label>
                <textarea className="form-control-custom" value={addressForm.fullAddress} onChange={e => setAddressForm(prev => ({ ...prev, fullAddress: e.target.value }))} rows={2}/>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label-custom">City *</label>
                  <input className="form-control-custom" value={addressForm.city} onChange={e => setAddressForm(prev => ({ ...prev, city: e.target.value }))}/>
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">State *</label>
                  <input className="form-control-custom" value={addressForm.state} onChange={e => setAddressForm(prev => ({ ...prev, state: e.target.value }))}/>
                </div>
                <div className="col-12">
                  <label className="form-label-custom">Pincode *</label>
                  <input className="form-control-custom" value={addressForm.pincode} maxLength={6} onChange={e => setAddressForm(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g,'') }))}/>
                </div>
              </div>
              <div className="form-check mt-3">
                <input type="checkbox" className="form-check-input" checked={addressForm.isDefault} onChange={e => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}/>
                <label className="form-check-label">Set as default address</label>
              </div>
            </div>
            <div className="modal-footer-custom">
              <button className="btn-modal-cancel" onClick={() => setShowAddressModal(false)}>Cancel</button>
              <button className="btn-modal-save" onClick={handleSaveAddress}>{editingAddress ? "Update" : "Save"} Address</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
