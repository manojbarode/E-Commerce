// ==================== PAYMENTS PAGE ====================
// Payments.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Badge, Button, Form, Spinner, InputGroup } from 'react-bootstrap';
import { paymentsAPI } from './apiService';

export const Payments = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ search: '', status: '', method: '' });

  useEffect(() => {
    fetchPayments();
  }, [currentPage]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentsAPI.getAll(currentPage, 20, filters);
      setPayments(data.payments || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (paymentId, amount) => {
    const reason = prompt('Enter refund reason:');
    if (reason) {
      try {
        await paymentsAPI.refund(paymentId, amount, reason);
        alert('Refund processed successfully!');
        fetchPayments();
      } catch (error) {
        alert('Failed to process refund.');
      }
    }
  };

  if (loading && currentPage === 1) {
    return (
      <div className="dashboard-content">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p>Loading Payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h4>💳 Payments Management</h4>
        <Button variant="outline-primary" onClick={fetchPayments}>🔄 Refresh</Button>
      </div>

      <Card className="filter-card mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Label>Search</Form.Label>
              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Transaction ID, Order ID..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Label>Status</Form.Label>
              <Form.Select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label>Payment Method</Form.Label>
              <Form.Select value={filters.method} onChange={(e) => setFilters({...filters, method: e.target.value})}>
                <option value="">All Methods</option>
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
                <option value="wallet">Wallet</option>
                <option value="cod">Cash on Delivery</option>
              </Form.Select>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="primary" onClick={fetchPayments} className="w-100">Apply</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Total Transactions</small>
              <h5 className="mb-0">{payments.length}</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Completed</small>
              <h5 className="mb-0 text-success">
                {payments.filter(p => p.status === 'completed').length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Pending</small>
              <h5 className="mb-0 text-warning">
                {payments.filter(p => p.status === 'pending').length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Failed</small>
              <h5 className="mb-0 text-danger">
                {payments.filter(p => p.status === 'failed').length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="table-card">
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="modern-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((payment, idx) => (
                    <tr key={idx}>
                      <td><code>{payment.transactionId}</code></td>
                      <td><strong>{payment.orderId}</strong></td>
                      <td>{payment.customerName}</td>
                      <td><strong>₹{payment.amount?.toLocaleString('en-IN')}</strong></td>
                      <td>
                        <Badge bg="info">{payment.paymentMethod}</Badge>
                      </td>
                      <td>
                        <Badge bg={
                          payment.status === 'completed' ? 'success' :
                          payment.status === 'pending' ? 'warning' :
                          payment.status === 'failed' ? 'danger' : 'secondary'
                        }>
                          {payment.status}
                        </Badge>
                      </td>
                      <td>{new Date(payment.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        {payment.status === 'completed' && (
                          <Button 
                            variant="link" 
                            size="sm" 
                            onClick={() => handleRefund(payment._id, payment.amount)}
                          >
                            💸 Refund
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">No payments found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};


// ==================== SHIPPING PAGE ====================
// Shipping.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Badge, Button, Form, Spinner, Modal } from 'react-bootstrap';
import { shippingAPI } from './apiService';

export const Shipping = () => {
  const [loading, setLoading] = useState(true);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    estimatedDays: '',
    isActive: true
  });

  useEffect(() => {
    fetchShippingMethods();
  }, []);

  const fetchShippingMethods = async () => {
    try {
      setLoading(true);
      const data = await shippingAPI.getMethods();
      setShippingMethods(data || []);
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMethod = () => {
    setEditMode(false);
    setFormData({ name: '', description: '', price: '', estimatedDays: '', isActive: true });
    setShowModal(true);
  };

  const handleEditMethod = (method) => {
    setEditMode(true);
    setSelectedMethod(method);
    setFormData({
      name: method.name || '',
      description: method.description || '',
      price: method.price || '',
      estimatedDays: method.estimatedDays || '',
      isActive: method.isActive !== undefined ? method.isActive : true
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await shippingAPI.updateMethod(selectedMethod._id, formData);
        alert('Shipping method updated!');
      } else {
        await shippingAPI.createMethod(formData);
        alert('Shipping method created!');
      }
      setShowModal(false);
      fetchShippingMethods();
    } catch (error) {
      alert('Failed to save shipping method.');
    }
  };

  const handleDelete = async (methodId, methodName) => {
    if (window.confirm(`Delete shipping method "${methodName}"?`)) {
      try {
        await shippingAPI.deleteMethod(methodId);
        alert('Shipping method deleted!');
        fetchShippingMethods();
      } catch (error) {
        alert('Failed to delete shipping method.');
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p>Loading Shipping Methods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h4>🚚 Shipping Management</h4>
        <Button variant="primary" onClick={handleAddMethod}>➕ Add Shipping Method</Button>
      </div>

      <Row className="g-4 mb-4">
        {shippingMethods.map((method, idx) => (
          <Col md={4} key={idx}>
            <Card className="shipping-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5>{method.name}</h5>
                  <Badge bg={method.isActive ? 'success' : 'secondary'}>
                    {method.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-muted mb-2">{method.description}</p>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <small className="text-muted">Price</small>
                    <h6 className="mb-0">₹{method.price?.toLocaleString('en-IN')}</h6>
                  </div>
                  <div>
                    <small className="text-muted">Delivery</small>
                    <h6 className="mb-0">{method.estimatedDays} days</h6>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm" onClick={() => handleEditMethod(method)}>
                    ✏️ Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(method._id, method.name)}>
                    🗑️ Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? '✏️ Edit Method' : '➕ Add Shipping Method'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Method Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estimated Days *</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.estimatedDays}
                    onChange={(e) => setFormData({...formData, estimatedDays: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Active"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">
              {editMode ? 'Update' : 'Add'} Method
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};