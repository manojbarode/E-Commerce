import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddressBook() {

  const [addresses, setAddresses] = useState(() => {
    const stored = localStorage.getItem("addresses");
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    address: "",
    locality: "",
    landmark: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
  ];

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

  const handleAddNew = () => {
    setEditIndex(null);
    setFormData({
      fullName: "",
      mobile: "",
      address: "",
      locality: "",
      landmark: "",
      state: "",
      pincode: "",
    });
    setErrors({});
    setShowForm(true);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(addresses[index]);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      const updated = addresses.filter((_, i) => i !== index);
      setAddresses(updated);
      if (selectedIndex === index) setSelectedIndex(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.mobile || formData.mobile.length !== 10)
      newErrors.mobile = "Enter valid 10-digit number";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.locality) newErrors.locality = "Locality is required";
    if (!formData.state) newErrors.state = "Select state";
    if (!formData.pincode || formData.pincode.length !== 6)
      newErrors.pincode = "Enter valid 6-digit pincode";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (editIndex !== null) {
        const updated = [...addresses];
        updated[editIndex] = formData;
        setAddresses(updated);
      } else {
        setAddresses([...addresses, formData]);
      }

      setShowForm(false);
      setSelectedIndex(editIndex !== null ? editIndex : addresses.length);
      setEditIndex(null);
    }
  };

  const handleContinue = () => {
    if (selectedIndex == null) {
      alert("Please select an address.");
      return;
    }
    alert("Proceeding to payment with selected address!");
    console.log("Selected Address:", addresses[selectedIndex]);
  };

  return (
    <div className="container py-4">
      <style>{`
        @media (max-width: 768px) {
          .mobile-address-card {
            display: flex;
            flex-direction: column;
          }
          
          .mobile-address-info {
            width: 100%;
            margin-bottom: 12px;
          }
          
          .mobile-btn-container {
            display: flex;
            gap: 8px;
            width: 100%;
          }
          
          .mobile-btn-container button {
            flex: 1;
          }
          
          .mobile-radio-hide {
            display: none;
          }
        }
        
        @media (min-width: 769px) {
          .desktop-layout {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
      `}</style>

      <div className="card shadow p-4">
        <h4 className="fw-bold mb-3">Choose Delivery Address</h4>

        {addresses.length > 0 && (
          <div className="mb-4">
            {addresses.map((addr, idx) => (
              <div
                key={idx}
                className={`card p-3 mb-3 border ${
                  selectedIndex === idx ? "border-primary shadow-sm" : "border-secondary"
                }`}
              >
                <div className="desktop-layout mobile-address-card">
                  {/* Address Info */}
                  <div 
                    onClick={() => setSelectedIndex(idx)} 
                    className="flex-grow-1 mobile-address-info"
                    style={{ cursor: "pointer" }}
                  >
                    <strong>{addr.fullName}</strong> — {addr.mobile}
                    <p className="text-muted mb-0">
                      {addr.address}, {addr.locality}, {addr.state} — {addr.pincode}
                    </p>
                  </div>

                  {/* Radio Button - Hidden on Mobile */}
                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={selectedIndex === idx}
                    onChange={() => setSelectedIndex(idx)}
                    className="me-2 mobile-radio-hide"
                  />

                  {/* Edit and Delete Buttons */}
                  <div className="mobile-btn-container d-flex gap-2">
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(idx)}
                    >
                      <Pencil size={16} className="me-1" />
                      <span className="d-none d-md-inline">Edit</span>
                    </button>

                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(idx)}
                    >
                      <Trash2 size={16} className="me-1" />
                      <span className="d-none d-md-inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showForm && (
          <button
            className="btn btn-outline-primary w-100 fw-semibold mb-3 d-flex justify-content-center align-items-center gap-2"
            onClick={handleAddNew}
          >
            <Plus size={18} /> Add New Address
          </button>
        )}

        {showForm && (
          <div className="border p-3 rounded bg-light">
            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  className="form-control"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
                {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Mobile Number</label>
                <input
                  className="form-control"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value.replace(/[^0-9]/g, "") })
                  }
                />
                {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
              </div>

              <div className="col-md-12">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                {errors.address && <small className="text-danger">{errors.address}</small>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Landmark</label>
                <input
                  className="form-control"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                />
                {errors.landmark && <small className="text-danger">{errors.landmark}</small>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Locality</label>
                <input
                  className="form-control"
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                />
                {errors.locality && <small className="text-danger">{errors.locality}</small>}
              </div>

              <div className="col-md-6">
                <label className="form-label">State</label>
                <select
                  className="form-select"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                >
                  <option value="">Select State</option>
                  {indianStates.map((st, i) => (
                    <option key={i} value={st}>{st}</option>
                  ))}
                </select>
                {errors.state && <small className="text-danger">{errors.state}</small>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Pincode</label>
                <input
                  className="form-control"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value.replace(/[^0-9]/g, "") })
                  }
                />
                {errors.pincode && <small className="text-danger">{errors.pincode}</small>}
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button onClick={handleSubmit} className="btn btn-primary w-50">
                {editIndex !== null ? "Update" : "Save"}
              </button>
              <button className="btn btn-secondary w-50" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {addresses.length > 0 && !showForm && (
          <button
            className="btn btn-success w-100 mt-4"
            onClick={handleContinue}
          >
            Continue to Payment
          </button>
        )}
      </div>
    </div>
  );
}