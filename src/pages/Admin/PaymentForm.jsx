import React, { useState } from "react";
import { addPaymentMethod } from "../../api/paymentApi";
import "./Css/PaymentForm.css";

export default function PaymentMethodAddForm() {
  const [type, setType] = useState("");
  const [label, setLabel] = useState("");
  const [fields, setFields] = useState([]);

  const addField = () => {
    setFields([
      ...fields,
      { name: "", label: "", type: "text", required: false, maxLength: "" }
    ]);
  };

  const updateField = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!type || !label) {
      alert("Type and Label are required");
      return;
    }

    await addPaymentMethod({ type, label, fields });
    alert("Payment Method Saved!");
    setType("");
    setLabel("");
    setFields([]);
  };

  return (
    <div className="pm-container">

      <div className="pm-header">
        <h2>Create Payment Method</h2>
        <p>Design your custom payment method with dynamic fields</p>
      </div>

      <div className="pm-card">

        <div className="pm-input-group">
          <label>Payment Method Type</label>
          <input
            type="text"
            placeholder="e.g. card, upi, paypal"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>

        <div className="pm-input-group">
          <label>Payment Method Label</label>
          <input
            type="text"
            placeholder="e.g. Credit Card, Google Pay"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <h3 className="pm-section-title">Dynamic Fields</h3>

        {fields.map((field, index) => (
          <div key={index} className="pm-field-card">

            <div className="pm-flex">
              <div className="pm-input-group">
                <label>Field Name</label>
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => updateField(index, "name", e.target.value)}
                />
              </div>

              <div className="pm-input-group">
                <label>Field Label</label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(index, "label", e.target.value)}
                />
              </div>
            </div>

            <div className="pm-flex">
              <div className="pm-input-group">
                <label>Type</label>
                <select
                  value={field.type}
                  onChange={(e) => updateField(index, "type", e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="email">Email</option>
                  <option value="password">Password</option>
                </select>
              </div>

              <div className="pm-input-group">
                <label>Max Length</label>
                <input
                  type="number"
                  value={field.maxLength}
                  onChange={(e) => updateField(index, "maxLength", e.target.value)}
                />
              </div>
            </div>

            <div className="pm-checkbox-row">
              <label>
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) =>
                    updateField(index, "required", e.target.checked)
                  }
                />
                Required
              </label>

              <button className="pm-remove-btn" onClick={() => removeField(index)}>
                Remove
              </button>
            </div>

          </div>
        ))}

        <button className="pm-add-field-btn" onClick={addField}>
          + Add Field
        </button>

        <button className="pm-save-btn" onClick={handleSubmit}>
          Save Payment Method
        </button>

      </div>
    </div>
  );
}
