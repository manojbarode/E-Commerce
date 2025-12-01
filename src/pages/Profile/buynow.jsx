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

  const price = 2499;
  const total = price * qty;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col lg:flex-row gap-6">

      <div className="bg-white p-5 rounded-2xl shadow-lg w-full lg:w-2/3">
        <h1 className="text-xl font-bold mb-4">Buy Now</h1>

        <div className="flex items-center gap-4 border p-4 rounded-xl">
          <img
            src="https://via.placeholder.com/120"
            alt="Product"
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div>
            <h2 className="text-lg font-semibold">
              Adidas Sports Running Shoes
            </h2>
            <p className="text-gray-600">Men Navy Blue</p>
            <p className="text-xl font-bold mt-2">₹{price}</p>

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
