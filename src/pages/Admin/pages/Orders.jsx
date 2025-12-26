// Orders.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Table, Badge, Button, Form, Spinner, Modal, InputGroup } from 'react-bootstrap';
import { ordersAPI } from './apiService';

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [filters, setFilters] = useState({ 
    status: '', 
    search: '',
    startDate: '',
    endDate: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getAll(currentPage, 20, filters);
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
      setTotalOrders(data.totalOrders || 0);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      alert('Order status updated successfully!');
      fetchOrders(); // Refresh data
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status.');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchOrders();
  };

  const clearFilters = () => {
    setFilters({ status: '', search: '', startDate: '', endDate: '' });
    setCurrentPage(1);
    fetchOrders();
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const orderData = await ordersAPI.getById(orderId);
      setSelectedOrder(orderData);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details.');
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const variants = {
      'delivered': 'success',
      'processing': 'warning',
      'shipped': 'info',
      'pending': 'secondary',
      'cancelled': 'danger',
      'returned': 'dark'
    };
    return <Badge bg={variants[statusLower] || 'secondary'}>{status}</Badge>;
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || 0}`;
  };

  if (loading && currentPage === 1) {
    return (
      <div className="dashboard-content">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p>Loading Orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="page-header">
        <h4>📦 Orders Management</h4>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={fetchOrders}>
            🔄 Refresh
          </Button>
          <Button variant="primary">
            📥 Export Orders
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="filter-card mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Label>Search</Form.Label>
              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Order ID, Customer name..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </InputGroup>
            </Col>
            
            <Col md={2}>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </Form.Select>
            </Col>

            <Col md={2}>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </Col>

            <Col md={2}>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </Col>

            <Col md={3} className="d-flex align-items-end gap-2">
              <Button variant="primary" onClick={applyFilters} className="w-100">
                Apply Filters
              </Button>
              <Button variant="outline-secondary" onClick={clearFilters}>
                Clear
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Stats Overview */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Total Orders</small>
              <h5 className="mb-0">{totalOrders}</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Pending</small>
              <h5 className="mb-0 text-warning">
                {orders.filter(o => o.status?.toLowerCase() === 'pending').length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Processing</small>
              <h5 className="mb-0 text-info">
                {orders.filter(o => o.status?.toLowerCase() === 'processing').length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Delivered</small>
              <h5 className="mb-0 text-success">
                {orders.filter(o => o.status?.toLowerCase() === 'delivered').length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Orders Table */}
      <Card className="table-card">
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="modern-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Products</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <Spinner animation="border" size="sm" /> Loading...
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={index}>
                      <td><strong>{order.orderId}</strong></td>
                      <td>
                        <div className="customer-info">
                          <div>{order.customerName}</div>
                          <small className="text-muted">{order.customerEmail}</small>
                        </div>
                      </td>
                      <td>{order.productCount} items</td>
                      <td><strong>{formatCurrency(order.totalAmount)}</strong></td>
                      <td>
                        <Badge bg={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          style={{ width: '150px' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="returned">Returned</option>
                        </Form.Select>
                      </td>
                      <td>
                        <div>{new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
                        <small className="text-muted">
                          {new Date(order.createdAt).toLocaleTimeString('en-IN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button 
                            variant="link" 
                            size="sm"
                            onClick={() => viewOrderDetails(order._id)}
                          >
                            👁️ View
                          </Button>
                          <Button variant="link" size="sm" className="text-primary">
                            📄 Invoice
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <Button
                variant="outline-primary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ← Previous
              </Button>
              <span className="mx-3">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>
              <Button
                variant="outline-primary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next →
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Order Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📦 Order Details - {selectedOrder?.orderId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              {/* Customer Details */}
              <Card className="mb-3">
                <Card.Body>
                  <h6 className="mb-3">👤 Customer Information</h6>
                  <Row>
                    <Col md={6}>
                      <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                      <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                      <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Shipping Address:</strong></p>
                      <address>
                        {selectedOrder.shippingAddress?.street}<br />
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}<br />
                        {selectedOrder.shippingAddress?.zipCode}
                      </address>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Products */}
              <Card className="mb-3">
                <Card.Body>
                  <h6 className="mb-3">🛍️ Products</h6>
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.products?.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.name}</td>
                          <td>{formatCurrency(item.price)}</td>
                          <td>{item.quantity}</td>
                          <td><strong>{formatCurrency(item.price * item.quantity)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              {/* Order Summary */}
              <Card>
                <Card.Body>
                  <h6 className="mb-3">💰 Order Summary</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>{formatCurrency(selectedOrder.shippingFee)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax:</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>Discount:</span>
                      <span>- {formatCurrency(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong className="text-primary">{formatCurrency(selectedOrder.totalAmount)}</strong>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            📄 Download Invoice
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Orders;