import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.css";
import {FaUser,FaMapMarkerAlt,FaShieldAlt,FaShoppingCart,FaBoxOpen,FaHeart,FaPlus,FaCamera} from "react-icons/fa";
import {addAddress,deleteAddress,getAddresses,updateAddress} from "../../api/addressApi";
import { uploadToCloudinary } from "../../api/productApi";
import { fetchProfileFromApi, fetchUserProfile, profileImageUpload, updateProfile } from "../../api/authApi";

const emptyProfile = { name: "", email: "", phone: "", image: "" };
const emptyAddress = {label: "Home",fullName: "",mobile: "",houseNo: "",street: "",city: "",
  state: "",country: "",zipCode: "",defaultAddress: false};

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [profile, setProfile] = useState(emptyProfile);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [userStats] = useState({cartItems: 0,totalOrders: 0,wishlistItems: 0});
  

  
 const { token, user,userUid} = useSelector((state) => state.auth);

const fetchProfileData = async () => {
  if (!token) return;
  try {
    const data = await fetchUserProfile(token);
    setProfile(data);
  } catch (err) {
    toast.error("Failed to fetch profile");
  }
};


useEffect(() => {
  if (userUid) {
    fetchProfileData();
  }
}, [userUid, token]);

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data || []);
    } catch {
      toast.error("Failed to load addresses");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

const handleImageUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.error("Please select an image file");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image size should be less than 5MB");
    return;
  }

  try {
    setImageLoading(true);

    // Single file upload
    const imageUrl = await uploadToCloudinary(file);

    const res = await profileImageUpload(imageUrl);
    setProfile((prev) => ({ ...prev, image: res.data.data.image }));
    toast.success("Profile image updated successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to upload image");
  } finally {
    setImageLoading(false);
  }
};

  const handleProfileSubmit = async () => {
    console.log(profile.name);
    console.log(profile.email);
    console.log(profile.phone);
  if (!profile.name || !profile.email || (profile.phone?.length || 0) !== 10) {
  toast.error("Invalid profile details");
  return;
}
  try {
    setLoading(true);
    const res = await updateProfile(profile);
    setProfile(res.data.data);
    toast.success("Profile updated successfully");
  } catch (error) {
    console.error(error);
    toast.error("Profile update failed");
  } finally {
    setLoading(false);
  }
};

  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressForm(emptyAddress);
    setShowAddressModal(true);
  };
  
  const openEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressForm({ ...addr });
    setShowAddressModal(true);
  };

  const handleOpenAddresses = () => {
    setActiveTab("addresses");
    if (addresses.length === 0) {
      fetchAddresses();
    }
  };

  const saveAddress = async () => {
    try {
      if (editingAddress) {
        const res = await updateAddress(editingAddress.addressUid,addressForm);

        const updated = res?.addressUid ? res : res?.data || res;

        setAddresses(prev =>
          prev.map(a =>
            a.addressUid === updated.addressUid ? updated : a
          )
        );

        toast.success("Address updated");
      } else {
        const res = await addAddress(addressForm);
        const created = res?.addressUid ? res : res?.data || res;

        setAddresses(prev => [...prev, created]);
        toast.success("Address added");
      }

      setShowAddressModal(false);
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Address save failed");
    }
  };

  const removeAddress = async (uid) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await deleteAddress(uid);
      setAddresses(prev => prev.filter(a => a.addressUid !== uid));
      toast.success("Address deleted");
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Delete failed");
    }
  };
  

  const quickLinks = [
    { title: "Cart", icon: <FaShoppingCart />, count: userStats.cartItems, path: "/profile/cart" },
    { title: "Orders", icon: <FaBoxOpen />, count: userStats.totalOrders, path: "/profile/userOrders" },
    { title: "Wishlist", icon: <FaHeart />, count: userStats.wishlistItems, path: "/profile/wishcart" },
    { title: "Addresses", icon: <FaMapMarkerAlt />, count: addresses.length, action:handleOpenAddresses }
  ];

  return (
    <div className="profile-container">
      <div className="container py-5">

        {/* HEADER */}
        <div className="text-center mb-4">
          <h1 className="profile-main-title">My Profile</h1>
          <p className="profile-subtitle">Manage your account</p>
        </div>

        {/* QUICK LINKS */}
        <div className="row g-3 mb-4">
          {quickLinks.map((item, i) => (
            <div key={i} className="col-6 col-md-3">
              <div className="quick-link-card"onClick={() =>item.action ? item.action() : navigate(item.path)}>
                <div className="fs-4 mb-1">{item.icon}</div>
                <h3>{item.count}</h3>
                <p>{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="row">

          {/* SIDEBAR */}
          <div className="col-lg-3 mb-3">
            <div className="profile-sidebar">
              <button className={`nav-item ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
                <FaUser /> Profile
              </button>
              <button
                className={`nav-item ${activeTab === "addresses" ? "active" : ""}`}
                onClick={handleOpenAddresses}
              >
                <FaMapMarkerAlt /> Addresses
              </button>

              <button className={`nav-item ${activeTab === "security" ? "active" : ""}`} onClick={() => setActiveTab("security")}>
                <FaShieldAlt /> Security
              </button>

              <button className="nav-item" onClick={() => navigate("/profile/cart")}>
                <FaShoppingCart /> Cart
              </button>

              <button className="nav-item" onClick={() => navigate("/profile/userOrders")}>
                <FaBoxOpen /> Orders
              </button>

              <button className="nav-item" onClick={() => navigate("/profile/wishcart")}>
                <FaHeart /> Wishlist
              </button>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="col-lg-9">

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="content-card">
                <div className="card-header-custom">
                  <h4>Personal Information</h4>
                </div>
                <div className="card-body-custom">
                  {/* Profile Image Upload */}
                  <div className="text-center mb-4">
                    <div className="profile-image-wrapper mx-auto position-relative" onClick={handleImageClick}>
                      {imageLoading ? (
                        <div className="profile-image-placeholder">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : profile.image ? (
                        <img src={profile.image} alt="Profile" />
                      ) : (
                        <div className="profile-image-placeholder">
                          <FaUser size={40} />
                        </div>
                      )}
                      <div className="profile-image-overlay">
                        <FaCamera size={24} />
                      </div>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*"onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <p className="text-muted mt-2 small">Click to upload profile picture</p>
                  </div>

                  <input className="form-control-custom mb-3" placeholder="Full Name"value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                  <input className="form-control-custom mb-3" placeholder="Email" value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })} readOnly
                  />
                  <input className="form-control-custom" placeholder="Phone" maxLength={10} value={profile.phone || ""}
                    onChange={(e) =>setProfile({ ...profile, phone: e.target.value.replace(/\D/g, "") })}
                  />
                  <button className="btn-save-profile w-100 mt-4" disabled={loading}
                    onClick={handleProfileSubmit}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div className="content-card">
                <div className="card-header-custom d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Saved Addresses</h4>
                  <button className="btn-add-address" onClick={openAddAddress}>
                    <FaPlus /> Add Address
                  </button>
                </div>

                <div className="card-body-custom">
                  <div className="row g-3">
                    {addresses.map((addr) => (
                      <div key={addr.addressUid} className="col-md-6">
                        <div className="address-card">
                          <strong>{addr.label}</strong>
                          <p>{addr.fullName}</p>
                          <p>{addr.mobile}</p>
                          <p>{addr.houseNo}, {addr.city}</p>
                          <div className="d-flex gap-2">
                            <button className="btn-address-action edit" onClick={() => openEditAddress(addr)}>Edit</button>
                            <button className="btn-address-action delete" onClick={() => removeAddress(addr.addressUid)}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div className="content-card">
                <div className="card-header-custom">
                  <h4>Security Settings</h4>
                </div>
                <div className="card-body-custom">
                  <div className="security-item d-flex justify-content-between mb-3">
                    <div>
                      <h6>Change Password</h6>
                      <small className="text-muted">Update your password</small>
                    </div>
                    <button className="btn-security">Change</button>
                  </div>

                  <div className="security-item d-flex justify-content-between">
                    <div>
                      <h6>Two Factor Authentication</h6>
                      <small className="text-muted">Extra security layer</small>
                    </div>
                    <button className="btn-security">Enable</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ================= ADDRESS MODAL ================= */}
      {showAddressModal && (
        <div className="modal-overlay d-flex align-items-center justify-content-center" 
          onClick={() => setShowAddressModal(false)}
        >
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom d-flex justify-content-between">
              <h4>{editingAddress ? "Edit Address" : "Add New Address"}</h4>
              <button className="btn-close-modal" onClick={() => setShowAddressModal(false)}>✕</button>
            </div>

            <div className="modal-body-custom">
              {Object.keys(emptyAddress).map((key) =>
                key !== "defaultAddress" ? (
                  <input key={key} className="form-control-custom mb-2" placeholder={key} value={addressForm[key]}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, [key]: e.target.value })
                    }
                  />
                ) : null
              )}
            </div>

            <div className="modal-footer-custom d-flex justify-content-end gap-2">
              <button className="btn-modal-cancel" onClick={() => setShowAddressModal(false)}>
                Cancel
              </button>
              <button className="btn-modal-save" onClick={saveAddress}>
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;