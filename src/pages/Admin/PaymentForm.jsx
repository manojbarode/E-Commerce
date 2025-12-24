import React, { useState, useEffect } from "react";
import "./Css/PaymentForm.css";
import {
  addPaymentMethod,
  getPaymentFieldsAdmin,
  getPaymentMethodsAdmin,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../../api/paymentApi";

export default function PaymentMethodAddForm() {
  const [type, setType] = useState("");
  const [label, setLabel] = useState("");
  const [fields, setFields] = useState([]);
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMethodId, setEditingMethodId] = useState(null);

  // ---------------- Fetch Existing Methods ----------------
  const fetchMethods = async () => {
    try {
      setLoading(true);
      const data = await getPaymentMethodsAdmin();

      const prepared = await Promise.all(
        data.map(async (m) => {
          try {
            const fields = await getPaymentFieldsAdmin(m.id);
            return { ...m, fields };
          } catch (e) {
            console.error(`Fields fetch failed for method ${m.id}`, e);
            return { ...m, fields: [] };
          }
        })
      );

      setMethods(prepared);
    } catch (err) {
      console.error("Failed to fetch payment methods:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  // ---------------- Dynamic Fields for New Method ----------------
  const addField = () => {
    setFields([
      ...fields,
      { name: "", label: "", type: "text", required: false, maxLength: "" },
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

  // ---------------- Submit New Payment Method ----------------
  const handleSubmit = async () => {
    if (!type || !label) {
      alert("Type and Label are required");
      return;
    }

    try {
      if (editingMethodId) {
        await updatePaymentMethod(editingMethodId, { type, label, fields });
        alert("Payment Method Updated!");
        setEditingMethodId(null);
      } else {
        await addPaymentMethod({ type, label, fields });
        alert("Payment Method Saved!");
      }
      
      setType("");
      setLabel("");
      setFields([]);
      fetchMethods();
    } catch (err) {
      console.error("Failed to save payment method:", err);
      alert("Failed to save payment method");
    }
  };

  // ---------------- Edit Payment Method ----------------
  const handleEdit = (method) => {
    setEditingMethodId(method.id);
    setType(method.type);
    setLabel(method.label);
    setFields(method.fields || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------------- Cancel Edit ----------------
  const handleCancelEdit = () => {
    setEditingMethodId(null);
    setType("");
    setLabel("");
    setFields([]);
  };

  // ---------------- Delete Payment Method ----------------
  const handleDelete = async (methodId) => {
    if (!window.confirm("Are you sure you want to delete this payment method?")) {
      return;
    }

    try {
      await deletePaymentMethod(methodId);
      alert("Payment Method Deleted!");
      fetchMethods();
    } catch (err) {
      console.error("Failed to delete payment method:", err);
      alert("Failed to delete payment method");
    }
  };

  return (
    <div className="pm-container">
      <div className="pm-header">
        <h2>{editingMethodId ? "Edit Payment Method" : "Create Payment Method"}</h2>
        <p>Design your custom payment method with dynamic fields</p>
      </div>

      {/* Add/Edit Payment Method Form */}
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
                  placeholder="e.g. cardNumber"
                  value={field.name}
                  onChange={(e) => updateField(index, "name", e.target.value)}
                />
              </div>
              <div className="pm-input-group">
                <label>Field Label</label>
                <input
                  type="text"
                  placeholder="e.g. Card Number"
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
                  placeholder="e.g. 16"
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

        <div className="pm-button-group">
          {editingMethodId && (
            <button className="pm-delete-btn" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
          <button
            className={editingMethodId ? "pm-update-btn" : "pm-save-btn"}
            onClick={handleSubmit}
          >
            {editingMethodId ? "Update Payment Method" : "Save Payment Method"}
          </button>
        </div>
      </div>

      {/* Existing Payment Methods */}
      <h3>Existing Payment Methods</h3>
      {loading ? (
        <p>Loading...</p>
      ) : methods.length === 0 ? (
        <p>No payment methods yet.</p>
      ) : (
        methods.map((method) => (
          <div key={method.id} className="pm-card">
            <div className="pm-method-header">
              <div className="pm-method-info">
                <div className="pm-input-group">
                  <label>Type</label>
                  <input type="text" value={method.type} readOnly />
                </div>
                <div className="pm-input-group">
                  <label>Label</label>
                  <input type="text" value={method.label} readOnly />
                </div>
              </div>
              <div className="pm-method-actions">
                <button className="pm-edit-btn" onClick={() => handleEdit(method)}>
                  Edit
                </button>
                <button
                  className="pm-delete-btn"
                  onClick={() => handleDelete(method.id)}
                >
                  Delete
                </button>
              </div>
            </div>

            {method.fields.length > 0 ? (
              <>
                <h3 className="pm-section-title">Fields</h3>
                {method.fields.map((f, idx) => (
                  <div key={idx} className="pm-field-card">
                    <div className="pm-flex">
                      <div className="pm-input-group">
                        <label>Name</label>
                        <input type="text" value={f.name || ""} readOnly />
                      </div>
                      <div className="pm-input-group">
                        <label>Label</label>
                        <input type="text" value={f.label || ""} readOnly />
                      </div>
                    </div>
                    <div className="pm-flex">
                      <div className="pm-input-group">
                        <label>Type</label>
                        <input type="text" value={f.type || ""} readOnly />
                      </div>
                      <div className="pm-input-group">
                        <label>Max Length</label>
                        <input type="number" value={f.maxLength || ""} readOnly />
                      </div>
                    </div>
                    <div className="pm-checkbox-row">
                      <label>
                        <input
                          type="checkbox"
                          checked={f.required || false}
                          readOnly
                        />{" "}
                        Required
                      </label>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-muted">No fields defined</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}