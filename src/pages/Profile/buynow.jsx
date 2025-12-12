import React, { useState, useEffect, useContext } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./buynow.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../../api/addressApi";

export default function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    houseNo: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    defaultAddress: false,
  });

  
  const navigate = useNavigate();
  const userUid = localStorage.getItem("userUid");
  const { productUid, price } = useParams();
  const indianStates = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa",
    "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
    "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal"
  ];

  useEffect(() => {
    if (userUid) fetchAddresses();
  }, [userUid]);

  const fetchAddresses = async () => {
    try {
      if (!userUid) return toast.error("User not logged in!");
      const response = await getAddresses(userUid);
      setAddresses(response || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch addresses");
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      mobile: "",
      houseNo: "",
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      defaultAddress: false,
    });
    setEditIndex(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    const addr = addresses[index];
    setFormData({
      fullName: addr.fullName || "",
      mobile: addr.mobile || "",
      houseNo: addr.houseNo || "",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      country: addr.country || "",
      zipCode: addr.zipCode || "",
      defaultAddress: addr.defaultAddress || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const addressUid = addresses[index].addressUid;
      await deleteAddress(userUid, addressUid);
      setAddresses(addresses.filter((_, i) => i !== index));
      if (selectedIndex === index) setSelectedIndex(null);
      toast.success("Address deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.mobile) {
      toast.error("Full Name and Mobile are required");
      return;
    }

    try {
      const payload = { ...formData };

      if (editIndex !== null) {
        const addressUid = addresses[editIndex].addressUid;
        const updatedAddress = await updateAddress(userUid, addressUid, payload);
        const updatedList = [...addresses];
        updatedList[editIndex] = updatedAddress;
        setAddresses(updatedList);
        toast.success("Address updated successfully");
      } else {
        const savedAddress = await addAddress(userUid, payload);
        setAddresses([...addresses, savedAddress]);
        toast.success("Address added successfully");
      }

      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save/update address");
    }
  };

  const handleContinue = () => {
    if (selectedIndex === null) {
      toast.error("Please select an address!");
      return;
    }
    const selectedAddress = addresses[selectedIndex];
    
    navigate("/payment");
  };

  return (
    <div className="container py-4">
      <div className="card shadow p-4">
        <h4 className="fw-bold mb-3">Choose Delivery Address</h4>

        {addresses.map((addr, idx) => (
          <div
            key={addr.addressUid}
            className={`card p-3 mb-3 border ${selectedIndex === idx ? "border-primary" : "border-secondary"}`}
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedIndex(idx)}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{addr.fullName}</strong> — {addr.mobile}
                <p className="text-muted mb-0">
                  {addr.houseNo}, {addr.street}, {addr.city}, {addr.state}, {addr.country} — {addr.zipCode}
                </p>
                {addr.defaultAddress && (
                  <small className="text-success">Default Address</small>
                )}
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={(e) => { e.stopPropagation(); handleEdit(idx); }}
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={(e) => { e.stopPropagation(); handleDelete(idx); }}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {!showForm && (
          <button className="btn btn-outline-primary w-100 mb-3" onClick={handleAddNew}>
            <Plus size={18} /> Add New Address
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="border p-3 rounded bg-light">
            <div className="row g-2">
              {/* Full Name */}
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  className="form-control"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              {/* Mobile */}
              <div className="col-md-6">
                <label className="form-label">Mobile</label>
                <input
                  className="form-control"
                  type="tel"
                  value={formData.mobile}
                  maxLength={10}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/[^0-9]/g, "") })}
                  required
                />
              </div>

              {/* House No */}
              <div className="col-md-6">
                <label className="form-label">House No</label>
                <input
                  className="form-control"
                  value={formData.houseNo}
                  onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                />
              </div>

              {/* Street */}
              <div className="col-md-6">
                <label className="form-label">Street</label>
                <input
                  className="form-control"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                />
              </div>

              {/* City */}
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input
                  className="form-control"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              {/* State */}
              <div className="col-md-6">
                <label className="form-label">State</label>
                <select
                  className="form-select"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                >
                  <option value="">Select State</option>
                  {indianStates.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Country */}
              <div className="col-md-6">
                <label className="form-label">Country</label>
                <input
                  className="form-control"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>

              {/* Zip Code */}
              <div className="col-md-6">
                <label className="form-label">Zip Code</label>
                <input
                  className="form-control"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value.replace(/[^0-9]/g, "") })}
                />
              </div>

              {/* Default Address */}
              <div className="col-md-12 form-check mt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={formData.defaultAddress}
                  onChange={(e) => setFormData({ ...formData, defaultAddress: e.target.checked })}
                  id="defaultAddress"
                />
                <label className="form-check-label" htmlFor="defaultAddress">
                  Set as default address
                </label>
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary w-50">
                {editIndex !== null ? "Update" : "Save"}
              </button>
              <button type="button" className="btn btn-secondary w-50" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {addresses.length > 0 && !showForm && (
          <button className="btn btn-success w-100 mt-4" onClick={handleContinue}>
            Continue to Payment
          </button>
        )}
      </div>
    </div>
  );
}
