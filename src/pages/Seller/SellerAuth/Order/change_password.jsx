import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("⚠️ Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    alert("✅ Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      
      

      {/* ===== MAIN CONTENT ===== */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 20 }}>
              <div className="card-body p-4 p-md-5">

                {/* Current Password */}
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-2" style={{ color: "#2d3436" }}>
                    Current Password
                  </label>
                  <div className="position-relative">
                    <FaLock style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#667eea", zIndex: 1 }} />
                    <input
                      type={showCurrent ? "text" : "password"}
                      className="form-control"
                      placeholder="Enter your current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={{ paddingLeft: 45, paddingRight: 45, height: 50, borderRadius: 12, border: "2px solid #e9ecef", fontSize: "15px" }}
                    />
                    <div
                      onClick={() => setShowCurrent(!showCurrent)}
                      style={{ position: "absolute", right: 15, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#667eea" }}
                    >
                      {showCurrent ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                </div>

                {/* New Password */}
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-2" style={{ color: "#2d3436" }}>
                    New Password
                  </label>
                  <div className="position-relative">
                    <FaLock style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#667eea", zIndex: 1 }} />
                    <input
                      type={showNew ? "text" : "password"}
                      className="form-control"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ paddingLeft: 45, paddingRight: 45, height: 50, borderRadius: 12, border: "2px solid #e9ecef", fontSize: "15px" }}
                    />
                    <div
                      onClick={() => setShowNew(!showNew)}
                      style={{ position: "absolute", right: 15, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#667eea" }}
                    >
                      {showNew ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                  <small className="text-muted mt-2 d-block">
                    Use 8+ characters with mix of letters, numbers & symbols
                  </small>
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-2" style={{ color: "#2d3436" }}>
                    Confirm New Password
                  </label>
                  <div className="position-relative">
                    <FaLock style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#667eea", zIndex: 1 }} />
                    <input
                      type={showConfirm ? "text" : "password"}
                      className="form-control"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ paddingLeft: 45, paddingRight: 45, height: 50, borderRadius: 12, border: "2px solid #e9ecef", fontSize: "15px" }}
                    />
                    <div
                      onClick={() => setShowConfirm(!showConfirm)}
                      style={{ position: "absolute", right: 15, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#667eea" }}
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleChangePassword}
                  className="btn btn-lg w-100 text-white fw-bold"
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    borderRadius: 12,
                    height: 55,
                    fontSize: "16px",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                  }}
                >
                  Update Password
                </button>

                {/* Security Tips */}
                <div className="mt-4 p-3" style={{ background: "#f8f9fa", borderRadius: 12, border: "1px solid #e9ecef" }}>
                  <div className="d-flex align-items-start">
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#667eea", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 12 }}>
                      <FaShieldAlt color="#fff" size={18} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-2" style={{ color: "#2d3436" }}>Security Tips</h6>
                      <ul className="mb-0 ps-3" style={{ fontSize: "13px", color: "#636e72" }}>
                        <li className="mb-1">Never share your password with anyone</li>
                        <li className="mb-1">Use a unique password for this account</li>
                        <li>Change your password regularly</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STYLES ===== */}
      <style>{`
        input:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          outline: none !important;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5) !important;
          transition: all 0.3s ease;
        }
        button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default ChangePassword;
