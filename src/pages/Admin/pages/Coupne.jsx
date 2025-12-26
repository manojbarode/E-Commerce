// ==================== COUPONS PAGE ====================
// Coupons.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Badge, Button, Form, Spinner, Modal } from 'react-bootstrap';
import { couponsAPI } from './apiService';

export const Coupons = () => {
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await couponsAPI.getAll();
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditMode(false);
    setFormData({
      code: '', description: '', discountType: 'percentage', discountValue: '',
      minPurchase: '', maxDiscount: '', startDate: '', endDate: '',
      usageLimit: '', isActive: true
    });
    setShowModal(true);
  };

  const handleEdit = (coupon) => {
    setEditMode(true);
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code || '',
      description: coupon.description || '',
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue || '',
      minPurchase: coupon.minPurchase || '',
      maxDiscount: coupon.maxDiscount || '',
      startDate: coupon.startDate ? coupon.startDate.split('T')[0] : '',
      endDate: coupon.endDate ? coupon.endDate.split('T')[0] : '',
      usageLimit: coupon.usageLimit || '',
      isActive: coupon.isActive !== undefined ? coupon.isActive : true
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await couponsAPI.update(selectedCoupon._id, formData);
        alert('Coupon updated!');
      } else {
        await couponsAPI.create(formData);
        alert('Coupon created!');
      }
      setShowModal(false);
      fetchCoupons();
    } catch (error) {
      alert('Failed to save coupon.');
    }
  };

  const handleDelete = async (couponId, code) => {
    if (window.confirm(`Delete coupon "${code}"?`)) {
      try {
        await couponsAPI.delete(couponId);
        alert('Coupon deleted!');
        fetchCoupons();
      } catch (error) {
        alert('Failed to delete coupon.');
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p>Loading Coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h4>🎟️ Coupons Management</h4>
        <Button variant="primary" onClick={handleAdd}>➕ Create New Coupon</Button>
      </div>

      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Total Coupons</small>
              <h5 className="mb-0">{coupons.length}</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Active Coupons</small>
              <h5 className="mb-0 text-success">{coupons.filter(c => c.isActive).length}</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Expired</small>
              <h5 className="mb-0 text-danger">
                {coupons.filter(c => new Date(c.endDate) < new Date()).length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Total Usage</small>
              <h5 className="mb-0">{coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)}</h5>
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
                  <th>Coupon Code</th>
                  <th>Description</th>
                  <th>Discount</th>
                  <th>Min Purchase</th>
                  <th>Usage</th>
                  <th>Valid Until</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length > 0 ? (
                  coupons.map((coupon, idx) => (
                    <tr key={idx}>
                      <td><code><strong>{coupon.code}</strong></code></td>
                      <td>{coupon.description}</td>
                      <td>
                        <Badge bg="info">
                          {coupon.discountType === 'percentage' 
                            ? `${coupon.discountValue}%` 
                            : `₹${coupon.discountValue}`}
                        </Badge>
                      </td>
                      <td>₹{coupon.minPurchase?.toLocaleString('en-IN') || 0}</td>
                      <td>{coupon.usedCount || 0} / {coupon.usageLimit || '∞'}</td>
                      <td>{new Date(coupon.endDate).toLocaleDateString('en-IN')}</td>
                      <td>
                        <Badge bg={
                          new Date(coupon.endDate) < new Date() ? 'danger' :
                          coupon.isActive ? 'success' : 'secondary'
                        }>
                          {new Date(coupon.endDate) < new Date() ? 'Expired' :
                           coupon.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button variant="link" size="sm" onClick={() => handleEdit(coupon)}>
                            ✏️ Edit
                          </Button>
                          <Button variant="link" size="sm" className="text-danger" 
                                  onClick={() => handleDelete(coupon._id, coupon.code)}>
                            🗑️ Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">No coupons found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? '✏️ Edit Coupon' : '➕ Create New Coupon'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Coupon Code *</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., SAVE20"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Get 20% off on all products"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Type *</Form.Label>
                  <Form.Select
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Value *</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder={formData.discountType === 'percentage' ? '10' : '100'}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Min Purchase (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="500"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({...formData, minPurchase: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Discount (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="1000"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Usage Limit</Form.Label>
              <Form.Control
                type="number"
                placeholder="Leave empty for unlimited"
                value={formData.usageLimit}
                onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
              />
            </Form.Group>
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
              {editMode ? 'Update' : 'Create'} Coupon
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};


// ==================== REVIEWS PAGE ====================
// Reviews.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Badge, Button, Form, Spinner, InputGroup } from 'react-bootstrap';
import { reviewsAPI } from './apiService';

export const Reviews = () => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ search: '', status: '', rating: '' });

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsAPI.getAll(currentPage, 20, filters);
      setReviews(data.reviews || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reviewId, status) => {
    try {
      await reviewsAPI.updateStatus(reviewId, status);
      alert('Review status updated!');
      fetchReviews();
    } catch (error) {
      alert('Failed to update review status.');
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Delete this review?')) {
      try {
        await reviewsAPI.delete(reviewId);
        alert('Review deleted!');
        fetchReviews();
      } catch (error) {
        alert('Failed to delete review.');
      }
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading && currentPage === 1) {
    return (
      <div className="dashboard-content">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p>Loading Reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h4>⭐ Reviews Management</h4>
        <Button variant="outline-primary" onClick={fetchReviews}>🔄 Refresh</Button>
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
                  placeholder="Product name, customer..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Label>Status</Form.Label>
              <Form.Select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label>Rating</Form.Label>
              <Form.Select value={filters.rating} onChange={(e) => setFilters({...filters, rating: e.target.value})}>
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </Form.Select>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="primary" onClick={fetchReviews} className="w-100">Apply</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Total Reviews</small>
              <h5 className="mb-0">{reviews.length}</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Pending Review</small>
              <h5 className="mb-0 text-warning">
                {reviews.filter(r => r.status === 'pending').length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Approved</small>
              <h5 className="mb-0 text-success">
                {reviews.filter(r => r.status === 'approved').length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Avg Rating</small>
              <h5 className="mb-0">
                {reviews.length > 0 
                  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                  : '0'} ⭐
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
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length > 0 ? (
                  reviews.map((review, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={review.productImage} alt="" style={{width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover'}} />
                          <strong>{review.productName}</strong>
                        </div>
                      </td>
                      <td>{review.customerName}</td>
                      <td>
                        <div>{renderStars(review.rating)}</div>
                        <small className="text-muted">{review.rating}/5</small>
                      </td>
                      <td style={{maxWidth: '300px'}}>
                        <div className="review-text">{review.comment}</div>
                      </td>
                      <td>{new Date(review.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={review.status}
                          onChange={(e) => handleStatusUpdate(review._id, e.target.value)}
                          style={{width: '130px'}}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Button variant="link" size="sm" className="text-danger" onClick={() => handleDelete(review._id)}>
                          🗑️ Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">No reviews found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <Button variant="outline-primary" disabled={currentPage === 1} 
                      onClick={() => setCurrentPage(currentPage - 1)}>
                ← Previous
              </Button>
              <span className="mx-3">Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></span>
              <Button variant="outline-primary" disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}>
                Next →
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};


// ==================== REPORTS PAGE ====================
// Reports.jsx
import React, { useState } from "react";
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { reportsAPI } from './apiService';

export const Reports = () => {
  const [reportType, setReportType] = useState('sales');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    if (!startDate || !endDate) {
      alert('Please select start and end dates');
      return;
    }
    
    try {
      setLoading(true);
      let data;
      switch(reportType) {
        case 'sales':
          data = await reportsAPI.getSalesReport(startDate, endDate);
          break;
        case 'products':
          data = await reportsAPI.getProductReport(startDate, endDate);
          break;
        case 'users':
          data = await reportsAPI.getUserReport(startDate, endDate);
          break;
        case 'revenue':
          data = await reportsAPI.getRevenueReport(startDate, endDate);
          break;
        default:
          data = await reportsAPI.getSalesReport(startDate, endDate);
      }
      setReportData(data);
    } catch (error) {
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const blob = await reportsAPI.exportReport(reportType, 'csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report.csv`;
      a.click();
    } catch (error) {
      alert('Failed to export report');
    }
  };

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h4>📈 Reports & Analytics</h4>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Label>Report Type</Form.Label>
              <Form.Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value="sales">Sales Report</option>
                <option value="products">Product Performance</option>
                <option value="users">User Activity</option>
                <option value="revenue">Revenue Report</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Col>
            <Col md={3}>
              <Form.Label>End Date</Form.Label>
              <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Col>
            <Col md={3} className="d-flex align-items-end gap-2">
              <Button variant="primary" onClick={generateReport} disabled={loading}>
                {loading ? 'Generating...' : '📊 Generate Report'}
              </Button>
              {reportData && (
                <Button variant="outline-success" onClick={exportReport}>
                  📥 Export
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {reportData && (
        <>
          <Row className="g-4 mb-4">
            <Col md={3}>
              <Card className="stat-card stat-card-1">
                <Card.Body>
                  <h6 className="text-white mb-2">Total Sales</h6>
                  <h4 className="text-white">₹{reportData.totalSales?.toLocaleString('en-IN') || 0}</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card stat-card-2">
                <Card.Body>
                  <h6 className="text-white mb-2">Total Orders</h6>
                  <h4 className="text-white">{reportData.totalOrders || 0}</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card stat-card-3">
                <Card.Body>
                  <h6 className="text-white mb-2">Avg Order Value</h6>
                  <h4 className="text-white">₹{reportData.avgOrderValue?.toLocaleString('en-IN') || 0}</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card stat-card-4">
                <Card.Body>
                  <h6 className="text-white mb-2">Growth Rate</h6>
                  <h4 className="text-white">{reportData.growthRate || 0}%</h4>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card>
            <Card.Body>
              <h5 className="mb-4">Report Chart</h5>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={reportData.chartData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#667eea" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};