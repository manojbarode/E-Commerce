import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddAddress() {
  const [showForm, setShowForm] = useState(false);
  const [state, setState] = useState("");
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    address: "",
    locality: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli",
    "Daman & Diu", "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.mobile.trim() || formData.mobile.length !== 10)
      newErrors.mobile = "Enter valid 10-digit mobile number";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.locality.trim()) newErrors.locality = "Locality is required";
    if (!state) newErrors.state = "State is required";
    if (!formData.pincode.trim() || formData.pincode.length !== 6)
      newErrors.pincode = "Enter valid 6-digit PIN code";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Address Saved Successfully ✔");
      setShowForm(false);
    }
  };

  return (
    <div className="container">

      {/* Header */}
        <div
    className="d-flex align-items-center py-3"
    style={{ borderBottom: "2px solid blueviolet", cursor: "pointer" }}
    onClick={() => setShowForm(!showForm)}
  >
    <Plus size={20} color="blueviolet" className="me-2" />

    <span
      className="fw-semibold"
      style={{
        fontSize: "17px",
        color: "blueviolet",
      }}
    >
      Add a new address
    </span>
  </div>

      {/* Form */}
      {showForm && (
        <form className="mt-3" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter mobile number"
              maxLength={10}
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value.replace(/[^0-9]/g, "") })
              }
            />
            {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Address (Area and Street)"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            {errors.address && <small className="text-danger">{errors.address}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Locality</label>
            <input
              type="text"
              className="form-control"
              placeholder="Locality"
              value={formData.locality}
              onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
            />
            {errors.locality && <small className="text-danger">{errors.locality}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">State</label>
            <select className="form-select" value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">Select State</option>
              {indianStates.map((st, i) => (
                <option key={i} value={st}>{st}</option>
              ))}
            </select>
            {errors.state && <small className="text-danger">{errors.state}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Pin Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="Pin code"
              maxLength={6}
              value={formData.pincode}
              onChange={(e) =>
                setFormData({ ...formData, pincode: e.target.value.replace(/[^0-9]/g, "") })
              }
            />
            {errors.pincode && <small className="text-danger">{errors.pincode}</small>}
          </div>

          <button type="submit" className="btn btn-primary w-100" onClick={()=>{navigate("/payment")}}>
            Save Address
            
          </button>
        </form>
      )}
    </div>
  );
}
