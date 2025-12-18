import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./buynow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addAddress, deleteAddress, getAddresses, updateAddress } from "../../api/addressApi";
import { useSelector } from "react-redux";

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
  const { userUid } = useSelector((state) => state.auth);
  const price = useSelector((state) => state.order.totalAmount);

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
      const res = await getAddresses(userUid);
      const data = res?.addressUid ? [res] : res?.data || res || [];
      setAddresses(data);
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
    setFormData({ ...addr });
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const addressUid = addresses[index].addressUid;
      await deleteAddress(userUid, addressUid);
      setAddresses(prev => prev.filter((_, i) => i !== index));
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
        const res = await updateAddress(userUid, addressUid, payload);
        const updated = res?.addressUid ? res : res?.data || res;

        const updatedList = [...addresses];
        updatedList[editIndex] = updated;
        setAddresses(updatedList);
        toast.success("Address updated successfully");
      } else {
        const res = await addAddress(userUid, payload);
        const created = res?.addressUid ? res : res?.data || res;

        setAddresses([...addresses, created]);
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
                {addr.defaultAddress && <small className="text-success">Default Address</small>}
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
              {["fullName", "mobile", "houseNo", "street", "city", "state", "country", "zipCode"].map((field) => (
                <div className="col-md-6" key={field}>
                  <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  {field === "state" ? (
                    <select
                      className="form-select"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    >
                      <option value="">Select State</option>
                      {indianStates.map((st) => <option key={st} value={st}>{st}</option>)}
                    </select>
                  ) : (
                    <input
                      className="form-control"
                      type={field === "mobile" ? "tel" : "text"}
                      value={formData[field]}
                      maxLength={field === "mobile" ? 10 : undefined}
                      onChange={(e) =>
                        setFormData({ ...formData, [field]: field === "mobile" ? e.target.value.replace(/[^0-9]/g, "") : e.target.value })
                      }
                      required={field === "fullName" || field === "mobile"}
                    />
                  )}
                </div>
              ))}

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
