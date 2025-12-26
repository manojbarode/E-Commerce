import React, { useState } from "react";
import { Card, Button, Form, Spinner, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "../Css/forget.css";

const AdminForget = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    emailOrMobile: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!formData.emailOrMobile) {
      toast.error("Email or Mobile number is required");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("OTP sent successfully");
      setStep(2);
      setLoading(false);
    }, 1000);
  };

  const verifyOtp = async () => {
    if (!formData.otp) {
      toast.error("OTP is required");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("OTP verified");
      setStep(3);
      setLoading(false);
    }, 1000);
  };

  const resetPassword = async () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields required");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Password reset successfully");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="forget-password-container">
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <Card className="forget-card">
        <div className="card-glow"></div>
        <Card.Body className="p-5">
          {/* Progress Bar */}
          <div className="progress-container mb-4">
            <div className="progress-step-wrapper">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-circle">1</div>
                <span className="step-label">Verify</span>
              </div>
              <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-circle">2</div>
                <span className="step-label">OTP</span>
              </div>
              <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <span className="step-label">Reset</span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-4">
            <div className="lock-icon-wrapper">
              <div className="lock-icon">
                {step === 1 && "🔐"}
                {step === 2 && "✉️"}
                {step === 3 && "🔑"}
              </div>
            </div>
            <h3 className="title-gradient fw-bold mt-3 mb-2">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Create New Password"}
            </h3>
            <p className="subtitle">
              {step === 1 && "Don't worry, we'll help you reset it"}
              {step === 2 && "Enter the code we sent to your device"}
              {step === 3 && "Choose a strong password for your account"}
            </p>
          </div>

          {/* STEP 1 - Email/Mobile Input */}
          {step === 1 && (
            <div className="step-content">
              <Form.Group className="mb-4">
                <Form.Label className="form-label-custom">
                  📧 Email / Mobile Number
                </Form.Label>
                <div className="input-wrapper">
                  <Form.Control
                    type="text"
                    name="emailOrMobile"
                    placeholder="Enter your email or mobile number"
                    value={formData.emailOrMobile}
                    onChange={handleChange}
                    className="input-custom"
                  />
                </div>
              </Form.Group>

              <Button
                className="btn-custom btn-primary-gradient w-100"
                onClick={sendOtp}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </Button>
            </div>
          )}

          {/* STEP 2 - OTP Verification */}
          {step === 2 && (
            <div className="step-content">
              <Form.Group className="mb-4">
                <Form.Label className="form-label-custom">
                  🔢 Enter OTP Code
                </Form.Label>
                <div className="input-wrapper">
                  <Form.Control
                    type="text"
                    name="otp"
                    placeholder="• • • • • •"
                    value={formData.otp}
                    onChange={handleChange}
                    maxLength={6}
                    className="input-custom text-center otp-input"
                  />
                </div>
                <div className="text-center mt-2">
                  <small className="resend-text">
                    Didn't receive code? <span className="resend-link">Resend</span>
                  </small>
                </div>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button
                  className="btn-custom btn-secondary-gradient"
                  onClick={() => setStep(1)}
                  style={{ flex: '0 0 100px' }}
                >
                  ← Back
                </Button>
                <Button
                  className="btn-custom btn-success-gradient flex-grow-1"
                  onClick={verifyOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <span>Verify OTP</span>
                      <span className="btn-arrow">→</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 - Reset Password */}
          {step === 3 && (
            <div className="step-content">
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  🔒 New Password
                </Form.Label>
                <InputGroup className="input-group-custom">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter your new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="input-custom"
                  />
                  <Button
                    className="eye-button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="form-label-custom">
                  ✅ Confirm Password
                </Form.Label>
                <InputGroup className="input-group-custom">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter your new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-custom"
                  />
                  <Button
                    className="eye-button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </Button>
                </InputGroup>
              </Form.Group>

              <div className="password-strength mb-3">
                <small className="text-muted">Password must contain:</small>
                <ul className="strength-list">
                  <li className={formData.newPassword.length >= 8 ? 'valid' : ''}>
                    {formData.newPassword.length >= 8 ? '✓' : '○'} At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.newPassword) ? 'valid' : ''}>
                    {/[A-Z]/.test(formData.newPassword) ? '✓' : '○'} One uppercase letter
                  </li>
                  <li className={/[0-9]/.test(formData.newPassword) ? 'valid' : ''}>
                    {/[0-9]/.test(formData.newPassword) ? '✓' : '○'} One number
                  </li>
                </ul>
              </div>

              <div className="d-flex gap-2">
                <Button
                  className="btn-custom btn-secondary-gradient"
                  onClick={() => setStep(2)}
                  style={{ flex: '0 0 100px' }}
                >
                  ← Back
                </Button>
                <Button
                  className="btn-custom btn-dark-gradient flex-grow-1"
                  onClick={resetPassword}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <span className="btn-arrow">✓</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-4">
           <small className="footer-text">
                Remember your password?{" "}
                 <Link to="/admin/login" className="login-link">Back to Login</Link>
                </small>
          </div>
        </Card.Body>
      </Card>

      {/* Styles
      <style>
        {`
          .forget-password-container {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
            overflow: hidden;
            padding: 20px;
          }

          .floating-shapes {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }

          .shape {
            position: absolute;
            border-radius: 50%;
            opacity: 0.1;
            animation: float 20s infinite ease-in-out;
          }

          .shape-1 {
            width: 300px;
            height: 300px;
            background: white;
            top: -50px;
            left: -50px;
            animation-delay: 0s;
          }

          .shape-2 {
            width: 200px;
            height: 200px;
            background: white;
            bottom: -50px;
            right: -50px;
            animation-delay: 5s;
          }

          .shape-3 {
            width: 150px;
            height: 150px;
            background: white;
            top: 50%;
            right: 10%;
            animation-delay: 10s;
          }

          .shape-4 {
            width: 250px;
            height: 250px;
            background: white;
            bottom: 20%;
            left: 10%;
            animation-delay: 15s;
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-30px) rotate(180deg);
            }
          }

          .forget-card {
            width: 100%;
            max-width: 480px;
            border-radius: 24px;
            border: none;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
            position: relative;
            z-index: 1;
            animation: slideUp 0.6s ease-out;
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .card-glow {
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 24px;
            z-index: -1;
            opacity: 0.5;
            filter: blur(10px);
          }

          .progress-container {
            padding: 0 20px;
          }

          .progress-step-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .progress-step {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
          }

          .step-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #e9ecef;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: #6c757d;
            transition: all 0.3s ease;
          }

          .progress-step.active .step-circle {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transform: scale(1.1);
          }

          .step-label {
            font-size: 11px;
            color: #6c757d;
            font-weight: 500;
          }

          .progress-step.active .step-label {
            color: #667eea;
            font-weight: 600;
          }

          .progress-line {
            flex: 1;
            height: 3px;
            background: #e9ecef;
            margin: 0 10px;
            margin-bottom: 25px;
            transition: all 0.5s ease;
          }

          .progress-line.active {
            background: linear-gradient(90deg, #667eea, #764ba2);
          }

          .lock-icon-wrapper {
            display: inline-block;
            animation: bounce 2s infinite;
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .lock-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            margin: 0 auto;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
          }

          .title-gradient {
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 28px;
          }

          .subtitle {
            color: #6c757d;
            font-size: 14px;
            margin-bottom: 0;
          }

          .step-content {
            animation: fadeIn 0.4s ease-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .form-label-custom {
            font-weight: 600;
            color: #2d3748;
            font-size: 14px;
            margin-bottom: 8px;
          }

          .input-wrapper {
            position: relative;
          }

          .input-custom {
            border: 2px solid #e9ecef;
            border-radius: 12px;
            padding: 12px 16px;
            font-size: 15px;
            transition: all 0.3s ease;
            background: #f8f9fa;
          }

          .input-custom:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
            background: white;
          }

          .otp-input {
            font-size: 24px;
            letter-spacing: 8px;
            font-weight: 600;
          }

          .input-group-custom {
            border: 2px solid #e9ecef;
            border-radius: 12px;
            overflow: hidden;
            background: #f8f9fa;
            transition: all 0.3s ease;
          }

          .input-group-custom:focus-within {
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
            background: white;
          }

          .input-group-custom .input-custom {
            border: none;
            background: transparent;
          }

          .input-group-custom .input-custom:focus {
            box-shadow: none;
          }

          .eye-button {
            border: none;
            background: transparent;
            padding: 0 16px;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .eye-button:hover {
            transform: scale(1.1);
          }

          .btn-custom {
            padding: 14px 24px;
            border-radius: 12px;
            border: none;
            font-weight: 600;
            font-size: 15px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            position: relative;
            overflow: hidden;
          }

          .btn-custom::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
          }

          .btn-custom:hover::before {
            width: 300px;
            height: 300px;
          }

          .btn-custom span {
            position: relative;
            z-index: 1;
          }

          .btn-primary-gradient {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
          }

          .btn-primary-gradient:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
          }

          .btn-success-gradient {
            background: linear-gradient(135deg, #56ab2f, #a8e063);
            color: white;
          }

          .btn-success-gradient:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(86, 171, 47, 0.4);
          }

          .btn-dark-gradient {
            background: linear-gradient(135deg, #434343, #000000);
            color: white;
          }

          .btn-dark-gradient:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
          }

          .btn-secondary-gradient {
            background: linear-gradient(135deg, #e0e0e0, #bdbdbd);
            color: #2d3748;
          }

          .btn-secondary-gradient:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }

          .btn-arrow {
            font-size: 18px;
            transition: transform 0.3s ease;
          }

          .btn-custom:hover .btn-arrow {
            transform: translateX(4px);
          }

          .resend-text {
            color: #6c757d;
          }

          .resend-link {
            color: #667eea;
            font-weight: 600;
            cursor: pointer;
            text-decoration: underline;
          }

          .resend-link:hover {
            color: #764ba2;
          }

          .password-strength {
            background: #f8f9fa;
            padding: 12px 16px;
            border-radius: 12px;
            border: 2px solid #e9ecef;
          }

          .strength-list {
            list-style: none;
            padding: 0;
            margin: 8px 0 0 0;
          }

          .strength-list li {
            font-size: 13px;
            color: #6c757d;
            margin: 4px 0;
            transition: all 0.3s ease;
          }

          .strength-list li.valid {
            color: #56ab2f;
            font-weight: 600;
          }

          .footer-text {
            color: #6c757d;
          }

          .login-link {
            color: #667eea;
            font-weight: 600;
            text-decoration: none;
          }

          .login-link:hover {
            color: #764ba2;
            text-decoration: underline;
          }

          @media (max-width: 576px) {
            .forget-card {
              margin: 10px;
            }

            .card-body {
              padding: 2rem !important;
            }

            .title-gradient {
              font-size: 24px;
            }

            .lock-icon {
              width: 60px;
              height: 60px;
              font-size: 30px;
            }
          }
        `}
      </style> */}
    </div>
  );
};

export default AdminForget;