import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Addseller = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    businessName: "",
    businessType: "",
    gstNumber: "",
    panNumber: "",
    warehouseAddress: "",
    city: "",
    state: "",
    pincode: "",
    bankAccountName: "",
    bankAccountNumber: "",
    ifscCode: "",
    bankName: "",
    category: "",
    productCount: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    // Full Name validation: no numbers or special characters
    if (!/^[a-zA-Z ]+$/.test(formData.fullName)) {
      newErrors.fullName = "Name can only contain letters and spaces";
    }
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mobile) newErrors.mobile = "Mobile Number is required";
    if (!formData.businessName) newErrors.businessName = "Business Name is required";
    if (!formData.businessType) newErrors.businessType = "Business Type is required";
    if (!formData.gstNumber) newErrors.gstNumber = "GST Number is required";
    if (!formData.panNumber) newErrors.panNumber = "PAN Number is required";
    if (!formData.warehouseAddress) newErrors.warehouseAddress = "Warehouse Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pincode) newErrors.pincode = "Pincode is required";
    if (!formData.bankAccountName) newErrors.bankAccountName = "Account Holder Name is required";
    if (!formData.bankAccountNumber) newErrors.bankAccountNumber = "Account Number is required";
    if (!formData.ifscCode) newErrors.ifscCode = "IFSC Code is required";
    if (!formData.bankName) newErrors.bankName = "Bank Name is required";
    if (!formData.category) newErrors.category = "Product Category is required";
    if (!formData.productCount) newErrors.productCount = "Product count is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Data:", formData);
      alert("Form Submitted Successfully!");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4 ">E-Shop Seller Registration</h2>
              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Mobile */}
                <div className="mb-3">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                  {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                </div>

                {/* Business Name */}
                <div className="mb-3">
                  <label className="form-label">Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    className={`form-control ${errors.businessName ? "is-invalid" : ""}`}
                    value={formData.businessName}
                    onChange={handleChange}
                  />
                  {errors.businessName && <div className="invalid-feedback">{errors.businessName}</div>}
                </div>

                {/* Business Type */}
                <div className="mb-3">
                  <label className="form-label">Business Type</label>
                  <select
                    name="businessType"
                    className={`form-select ${errors.businessType ? "is-invalid" : ""}`}
                    value={formData.businessType}
                    onChange={handleChange}
                  >
                    <option value="">Select Type</option>
                    <option value="Individual">Individual</option>
                    <option value="Proprietorship">Proprietorship</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Private Limited">Private Limited</option>
                    <option value="LLP">LLP</option>
                  </select>
                  {errors.businessType && <div className="invalid-feedback">{errors.businessType}</div>}
                </div>

                {/* GST Number */}
                <div className="mb-3">
                  <label className="form-label">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    className={`form-control ${errors.gstNumber ? "is-invalid" : ""}`}
                    value={formData.gstNumber}
                    onChange={handleChange}
                  />
                  {errors.gstNumber && <div className="invalid-feedback">{errors.gstNumber}</div>}
                </div>

                {/* PAN Number */}
                <div className="mb-3">
                  <label className="form-label">PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    className={`form-control ${errors.panNumber ? "is-invalid" : ""}`}
                    value={formData.panNumber}
                    onChange={handleChange}
                  />
                  {errors.panNumber && <div className="invalid-feedback">{errors.panNumber}</div>}
                </div>

                {/* Warehouse Address */}
                <div className="mb-3">
                  <label className="form-label">Warehouse Address</label>
                  <textarea
                    name="warehouseAddress"
                    className={`form-control ${errors.warehouseAddress ? "is-invalid" : ""}`}
                    value={formData.warehouseAddress}
                    onChange={handleChange}
                  ></textarea>
                  {errors.warehouseAddress && <div className="invalid-feedback">{errors.warehouseAddress}</div>}
                </div>

                {/* City */}
                <div className="mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    className={`form-control ${errors.city ? "is-invalid" : ""}`}
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                </div>

                {/* State */}
                <div className="mb-3">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    className={`form-control ${errors.state ? "is-invalid" : ""}`}
                    value={formData.state}
                    onChange={handleChange}
                  />
                  {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                </div>

                {/* Pincode */}
                <div className="mb-3">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                  {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
                </div>

                {/* Bank Account */}
                <div className="mb-3">
                  <label className="form-label">Bank Account Name</label>
                  <input
                    type="text"
                    name="bankAccountName"
                    className={`form-control ${errors.bankAccountName ? "is-invalid" : ""}`}
                    value={formData.bankAccountName}
                    onChange={handleChange}
                  />
                  {errors.bankAccountName && <div className="invalid-feedback">{errors.bankAccountName}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Bank Account Number</label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    className={`form-control ${errors.bankAccountNumber ? "is-invalid" : ""}`}
                    value={formData.bankAccountNumber}
                    onChange={handleChange}
                  />
                  {errors.bankAccountNumber && <div className="invalid-feedback">{errors.bankAccountNumber}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    className={`form-control ${errors.ifscCode ? "is-invalid" : ""}`}
                    value={formData.ifscCode}
                    onChange={handleChange}
                  />
                  {errors.ifscCode && <div className="invalid-feedback">{errors.ifscCode}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    className={`form-control ${errors.bankName ? "is-invalid" : ""}`}
                    value={formData.bankName}
                    onChange={handleChange}
                  />
                  {errors.bankName && <div className="invalid-feedback">{errors.bankName}</div>}
                </div>

                {/* Product Info */}
                <div className="mb-3">
                  <label className="form-label">Product Category</label>
                  <input
                    type="text"
                    name="category"
                    className={`form-control ${errors.category ? "is-invalid" : ""}`}
                    value={formData.category}
                    onChange={handleChange}
                  />
                  {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Approx Number of Products</label>
                  <input
                    type="number"
                    name="productCount"
                    className={`form-control ${errors.productCount ? "is-invalid" : ""}`}
                    value={formData.productCount}
                    onChange={handleChange}
                  />
                  {errors.productCount && <div className="invalid-feedback">{errors.productCount}</div>}
                </div>

                <div className="d-grid mt-3">
                  <button type="submit" className="btn btn-danger">
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addseller;
