import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./buynow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addAddress, deleteAddress, getAddresses, updateAddress } from "../../api/addressApi";

export default function AddressBook() {
  const [addresses, setAddresses] = useState([]);
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
  const navigate = useNavigate();

  const indianStates = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa",
    "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
    "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal"
  ];

  useEffect(() => {
     const userId = localStorage.getItem("customerId");
  if (userId) {
    fetchAddresses();
  }
  }, []);

 const fetchAddresses = async () => {
  try {
    const userId = localStorage.getItem("customerId");
    if (!userId) {
      toast.error("User not logged in!");
      return;
    }
    const response = await getAddresses(Number(userId));
    setAddresses(response);
    console.log(response);
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch addresses");
  }
};

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

  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const id = addresses[index].id;
      await deleteAddress(id);

      setAddresses(addresses.filter((_, i) => i !== index));
      if (selectedIndex === index) setSelectedIndex(null);

      toast.success("Address deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const userId = localStorage.getItem("customerId");
    if (!userId) {
      toast.error("User not logged in!");
      return;
    }

    const payload = { ...formData, userId: Number(userId) };

    if (editIndex !== null) {
      const id = addresses[editIndex].id;
      const updatedAddress = await updateAddress(id, payload);

      const updatedList = [...addresses];
      updatedList[editIndex] = updatedAddress;
      setAddresses(updatedList);

      toast.success("Address updated successfully");
    } else {
      const savedAddress = await addAddress(payload);
      setAddresses([...addresses, savedAddress]);
      toast.success("Address saved successfully");
    }

    setShowForm(false);
    setFormData({
      fullName: "", mobile: "", address: "", locality: "", landmark: "", state: "", pincode: ""
    });

  } catch (err) {
    toast.error("Failed to save/update address");
  }
};



  const handleContinue = () => {
    if (selectedIndex === null) {
      toast.error("Please select an address!");
      return;
    }
    navigate("/payment");
  };

  return (
    <div className="container py-4">
      <div className="card shadow p-4">
        <h4 className="fw-bold mb-3">Choose Delivery Address</h4>

        {addresses.map((addr, idx) => (
          <div
            key={idx}
            className={`card p-3 mb-3 border ${selectedIndex === idx ? "border-primary" : "border-secondary"}`}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div onClick={() => setSelectedIndex(idx)} style={{ cursor: "pointer" }}>
                <strong>{addr.fullName}</strong> — {addr.mobile}
                <p className="text-muted mb-0">
                  {addr.address}, {addr.locality}, {addr.state} — {addr.pincode}
                </p>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(idx)}>
                  <Pencil size={16} /> Edit
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(idx)}>
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
              {/* Form fields same as before */}
              {/* FULL NAME */}
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  className="form-control"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
                {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
              </div>

              {/* MOBILE */}
              <div className="col-md-6">
                <label className="form-label">Mobile</label>
                <input
                  className="form-control"
                  value={formData.mobile}
                  maxLength={10}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value.replace(/[^0-9]/g, "") })
                  }
                />
                {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
              </div>

              {/* ADDRESS */}
              <div className="col-md-12">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                {errors.address && <small className="text-danger">{errors.address}</small>}
              </div>

              {/* LOCALITY */}
              <div className="col-md-6">
                <label className="form-label">Locality</label>
                <input
                  className="form-control"
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                />
                {errors.locality && <small className="text-danger">{errors.locality}</small>}
              </div>

              {/* LANDMARK */}
              <div className="col-md-6">
                <label className="form-label">Landmark</label>
                <input
                  className="form-control"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                />
              </div>

              {/* STATE */}
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
                {errors.state && <small className="text-danger">{errors.state}</small>}
              </div>

              {/* PINCODE */}
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
              <button type="submit" className="btn btn-primary w-50">
                {editIndex !== null ? "Update" : "Save"}
              </button>
              <button type="button" className="btn btn-secondary w-50" onClick={() => setShowForm(false)}>
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
