import React, { useState } from "react";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { FaEnvelope } from "react-icons/fa";

const LoginIssue = () => {
  const [email, setEmail] = useState(""); 
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleSubmit = () => {
    if (!email) return alert("⚠️ Please enter your email");
    if (otp.some((digit) => digit === "")) return alert("⚠️ Enter complete OTP");
    alert(`✅ Email: ${email}\nOTP: ${otp.join("")}`);
  };

  return (
    <div className="login-bg">
      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={7}>
            <div
              className="p-5"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(15px)",
                borderRadius: 25,
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              }}
            >
              <h2 className="text-center fw-bold mb-4" style={{ color: "#fff" }}>
                🔒 Login Verification
              </h2>

              {/* Email Input */}
              <InputGroup className="mb-4" style={{ borderRadius: 12, overflow: "hidden" }}>
                <InputGroup.Text
                  style={{
                    background: "rgba(255,255,255,0.3)",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  <FaEnvelope />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    borderRadius: 0,
                    border: "none",
                    height: 50,
                    background: "rgba(255,255,255,0.2)",
                    color: "#fff",
                    fontWeight: 500,
                  }}
                />
              </InputGroup>

              {/* OTP Inputs */}
              <div className="d-flex mb-4 justify-content-center" style={{ gap: "10px" }}>
                {otp.map((digit, index) => (
                  <Form.Control
                    key={index}
                    id={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    maxLength={1}
                    className="text-center"
                    style={{
                      width: "45px",
                      height: "50px",
                      fontSize: "20px",
                      borderRadius: "12px",
                      border: "2px solid rgba(255,255,255,0.5)",
                      background: "rgba(255,255,255,0.2)",
                      color: "#fff",
                      fontWeight: 600,
                      transition: "all 0.3s",
                    }}
                  />
                ))}
              </div>

              <Button
                onClick={handleSubmit}
                className="w-100 fw-bold"
                style={{
                  background: "rgba(255,255,255,0.25)",
                  border: "none",
                  borderRadius: 12,
                  height: 50,
                  fontSize: "16px",
                  color: "#fff",
                  fontWeight: 600,
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  transition: "all 0.3s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.35)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
                }}
              >
                Verify
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .login-bg {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px 0;
          background-image: url('loginissue.avif');
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }

        input:focus {
          border-color: #fff !important;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.2) !important;
          outline: none !important;
        }
        input::placeholder {
          color: rgba(255,255,255,0.7) !important;
        }

        /* OTP responsive adjustments */
        @media (max-width: 768px) {
          .d-flex.mb-4.justify-content-center {
            gap: 8px !important;
          }
          input.text-center {
            width: 40px !important;
            height: 45px !important;
            font-size: 18px !important;
          }
        }

        @media (max-width: 480px) {
          .d-flex.mb-4.justify-content-center {
            gap: 6px !important;
          }
          input.text-center {
            width: 35px !important;
            height: 40px !important;
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginIssue;
