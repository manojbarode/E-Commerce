import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddAddress() {
  const [showForm, setShowForm] = useState(false);
  const [state, setState] = useState("");
  const [qty, setQty] = useState(1);
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
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
  ];

  const price = 2499;
  const total = price * qty;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.mobile || formData.mobile.length !== 10) newErrors.mobile = "Enter valid 10-digit number";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.locality) newErrors.locality = "Locality is required";
    if (!state) newErrors.state = "Select state";
    if (!formData.pincode || formData.pincode.length !== 6) newErrors.pincode = "Enter valid 6-digit pincode";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      navigate("/payment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white p-5 rounded-2xl shadow-lg w-full lg:w-2/3 mx-auto">
        <h1 className="text-xl font-bold mb-4">Buy Now</h1>

        <div className="flex items-center gap-4 border p-4 rounded-xl">
          <img
            src="https://via.placeholder.com/120"
            alt="Product"
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div>
            <h2 className="text-lg font-semibold">Adidas Sports Running Shoes</h2>
            <p className="text-gray-600">Men Navy Blue</p>
            <p className="text-xl font-bold mt-2">₹{price}</p>

            <span
              onClick={() => setShowForm(true)}
              style={{ cursor: "pointer" }}
              className="text-blue-700 font-semibold flex items-center gap-1 mt-3"
            >
              <Plus size={18} /> Add a new address
            </span>
          </div>
        </div>

        {/* Address Form */}
        {showForm && (
          <form className="mt-4" onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
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
                maxLength={6}
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({ ...formData, pincode: e.target.value.replace(/[^0-9]/g, "") })
                }
              />
              {errors.pincode && <small className="text-danger">{errors.pincode}</small>}
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Save Address
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
