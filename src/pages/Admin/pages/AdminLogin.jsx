import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import "../Css/AdminLogin.css";
import { loginAdmin } from '../../../api/services/adminApi';

const AdminLogin = () => {
  const [email, setEmail] = useState(""); // renamed from username for clarity
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // Form validation
  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Please enter your email.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email.';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Please enter your password.';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

 const handleLogin = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setLoading(true);
  setErrorMsg('');

  try {
    const data = await loginAdmin({ email, password });

    if (!data.token) {
      throw new Error("Token missing");
    }

    navigate("/admin/dashboard");

  } catch (err) {
    setErrorMsg(err.response?.data?.message || err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="admin-login">
      <div className="bg-gradient-animated" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <Container fluid className="login-container">
        <Row className="justify-content-center w-100 m-0">
          <Col xs={12} sm={11} md={8} lg={6} xl={5} xxl={4}>
            <Card className="login-card shadow-lg border-0 overflow-hidden">
              <div className="card-accent" />
              <Card.Body className="p-3 p-sm-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="brand-badge mx-auto mb-3">
                    <span className="brand-dot" />
                    <span className="brand-dot" />
                    <span className="brand-dot" />
                  </div>
                  <h1 className="h4 h3-sm fw-bold mb-2">Shopsy Admin</h1>
                  <p className="text-muted mb-0 small">Secure login to your dashboard</p>
                </div>

                {errorMsg && (
                  <Alert variant="danger" className="py-2 mb-3 small" dismissible onClose={() => setErrorMsg('')}>
                    {errorMsg}
                  </Alert>
                )}

                <form onSubmit={handleLogin} noValidate>
                  <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label fw-semibold small">Email</label>
                    <input type="email" id="email" name="email" className={`form-control input-elevated ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="Enter email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
                      disabled={loading} autoComplete="username" />
                    {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="password" className="form-label fw-semibold small">Password</label>
                    <input type="password" id="password" name="password" className={`form-control input-elevated ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Enter password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }}
                      disabled={loading} autoComplete="current-password"/>
                    {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                    <small className="form-text text-muted d-block mt-1">Use your admin credentials to proceed.</small>
                  </div>

                  <Button type="submit" variant="primary" className="w-100 btn-animated" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        Logging in...
                      </>
                    ) : 'Login'}
                  </Button>

                  <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
                    <a href="#" className="link-muted small">Forgot password?</a>
                    <span className="small text-muted">v2025</span>
                  </div>
                </form>
              </Card.Body>

              <Card.Footer className="bg-transparent border-0 text-center py-3">
                <small className="text-muted">© 2025 Shopsy Admin</small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLogin;
