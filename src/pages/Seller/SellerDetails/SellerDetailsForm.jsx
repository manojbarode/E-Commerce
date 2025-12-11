import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./SellerDetailsForm.css";
import { sellerDetails } from "../../../api/SellApi";

export default function SellerForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    businessName: "",
    businessType: "",
    gstNumber: "",
    panNumber: "",
    category: "",
    productCount: "",
    warehouseAddress: "",
    city: "",
    state: "",
    pincode: "",
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Use sellerUid instead of sellerId
      const sellerUid = localStorage.getItem("sellerUid");

      if (!sellerUid) {
        toast.error("Seller UID not found. Please login again.");
        return;
      }

      const response = await sellerDetails(sellerUid, form);

      toast.success(response.data?.message || "Details saved successfully!");
      navigate("/sellerdashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: "Business Details",
      fields: [
        { name: "fullName", placeholder: "Full Name", type: "text" },
        { name: "businessName", placeholder: "Business Name", type: "text" },
        { name: "businessType", placeholder: "Business Type", type: "text" },
        { name: "category", placeholder: "Category", type: "text" },
        { name: "gstNumber", placeholder: "GST Number", type: "text" },
        { name: "panNumber", placeholder: "PAN Number", type: "text" },
        { name: "productCount", placeholder: "Product Count", type: "number" },
      ],
    },
    {
      title: "Address",
      fields: [
        { name: "warehouseAddress", placeholder: "Warehouse Address", type: "text" },
        { name: "city", placeholder: "City", type: "text" },
        { name: "state", placeholder: "State", type: "text" },
        { name: "pincode", placeholder: "Pincode", type: "text" },
      ],
    },
    {
      title: "Bank Details",
      fields: [
        { name: "accountName", placeholder: "Account Holder Name", type: "text" },
        { name: "accountNumber", placeholder: "Account Number", type: "text" },
        { name: "ifscCode", placeholder: "IFSC Code", type: "text" },
        { name: "bankName", placeholder: "Bank Name", type: "text" },
      ],
    },
  ];

  return (
    <div className="seller-container">
      <div className="seller-card-premium">
        <h2 className="seller-title">Complete Your Seller Profile</h2>

        <form onSubmit={handleSubmit}>
          {sections.map((section) => (
            <div className="section-block" key={section.title}>
              <h4 className="section-title">{section.title}</h4>

              <div className="row g-3">
                {section.fields.map((field) => (
                  <div className="col-md-6" key={field.name}>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="input-premium"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button type="submit" className="btn-premium w-100" disabled={loading}>
            {loading ? "Please wait..." : "Save Details"}
          </button>
        </form>
      </div>
    </div>
  );
}
