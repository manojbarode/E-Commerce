// Sellers.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Badge, Button, Form, Spinner, Modal, InputGroup } from 'react-bootstrap';
import { sellersAPI } from './apiService';

const Sellers = () => {
  const [loading, setLoading] = useState(true);
  const [sellers, setSellers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSellers, setTotalSellers] = useState(0);
  const [filters, setFilters] = useState({ 
    search: '',
    status: '',
    verificationStatus: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  useEffect(() => {
    fetchSellers();
  }, [currentPage]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const data = await sellersAPI.getAll(currentPage, 20, filters);
      setSellers(data.sellers || []);
      setTotalPages(data.totalPages || 1);
      setTotalSellers(data.totalSellers || 0);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      alert('Failed to load sellers.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchSellers();
  };

  const clearFilters = () => {
    setFilters({ search: '', status: '', verificationStatus: '' });
    setCurrentPage(1);
    fetchSellers();
  };

  const handleApproveSeller = async (sellerId, sellerName) => {
    if (window.confirm(`Approve seller "${sellerName}"?`)) {
      try {
        await sellersAPI.approve(sellerId);
        alert('Seller approved successfully!');
        fetchSellers();
      } catch (error) {
        console.error('Error approving seller:', error);
        alert('Failed to approve seller.');
      }
    }
  };

  const handleRejectSeller = async (sellerId, sellerName) => {
    const reason = prompt(`Enter reason for rejecting "${sellerName}":`);
    if (reason) {
      try {
        await sellersAPI.reject(sellerId, reason);
        alert('Seller rejected successfully!');
        fetchSellers();
      } catch (error) {
        console.error('Error rejecting seller:', error);
        alert('Failed to reject seller.');
      }
    }
  };

  const handleStatusUpdate = async (sellerId, newStatus) => {
    try {
      await sellersAPI.updateStatus(sellerId, newStatus);
      alert('Seller status updated successfully!');
      fetchSellers();
    } catch (error) {
      console.error('Error updating seller status:', error);
      alert('Failed to update seller status.');
    }
  };

  const viewSellerDetails = async (sellerId) => {
    try {
      const sellerData = await sellersAPI.getById(sellerId);
      setSelectedSeller(sellerData);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching seller details:', error);
      alert('Failed to load seller details.');
    }
  };

  const getVerificationBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const variants = {
      'approved': 'success',
      'pending': 'warning',
      'rejected': 'danger',
      'suspended': 'secondary'
    };
    return <Badge bg={variants[statusLower] || 'secondary'}>{status}</Badge>;
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const variants = {
      'active': 'success',
      'inactive': 'secondary',
      'suspended': 'danger'
    };
    return <Badge bg={variants[statusLower] || 'secondary'}>{status}</Badge>;
  };

  if (loading && currentPage === 1) {
    return (
      <div className="dashboard-content">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p>Loading Sellers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="page-header">
        <h4>🏪 Sellers Management</h4>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={fetchSellers}>
            🔄 Refresh
          </Button>
          <Button variant="primary">
            📥 Export Sellers
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="filter-card mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Label>Search</Form.Label>
              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Shop name, owner name..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </InputGroup>
            </Col>
            
            <Col md={3}>
              <Form.Label>Verification Status</Form.Label>
              <Form.Select
                value={filters.verificationStatus}
                onChange={(e) => handleFilterChange('verificationStatus', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Col>

            <Col md={2}>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </Form.Select>
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
              <small className="text-muted">Total Sellers</small>
              <h5 className="mb-0">{totalSellers}</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Approved</small>
              <h5 className="mb-0 text-success">
                {sellers.filter(s => s.verificationStatus?.toLowerCase() === 'approved').length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Pending Approval</small>
              <h5 className="mb-0 text-warning">
                {sellers.filter(s => s.verificationStatus?.toLowerCase() === 'pending').length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Rejected</small>
              <h5 className="mb-0 text-danger">
                {sellers.filter(s => s.verificationStatus?.toLowerCase() === 'rejected').length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sellers Table */}
      <Card className="table-card">
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="modern-table">
              <thead>
                <tr>
                  <th>Shop Details</th>
                  <th>Owner</th>
                  <th>Contact</th>
                  <th>Products</th>
                  <th>Total Sales</th>
                  <th>Verification</th>
                  <th>Status</th>
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
                ) : sellers.length > 0 ? (
                  sellers.map((seller, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img 
                            src={seller.shopLogo || 'https://via.placeholder.com/40'}
                            alt={seller.shopName}
                            style={{ 
                              width: '40px', 
                              height: '40px', 
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }}
                          />
                          <div>
                            <strong>{seller.shopName}</strong>
                            <br />
                            <small className="text-muted">ID: {seller.sellerId || seller._id}</small>
                          </div>
                        </div>
                      </td>
                      <td>{seller.ownerName}</td>
                      <td>
                        <div>
                          <small>{seller.email}</small>
                          <br />
                          <small className="text-muted">{seller.phone}</small>
                        </div>
                      </td>
                      <td>{seller.totalProducts || 0} items</td>
                      <td><strong>₹{seller.totalSales?.toLocaleString('en-IN') || 0}</strong></td>
                      <td>
                        {getVerificationBadge(seller.verificationStatus)}
                        {seller.verificationStatus?.toLowerCase() === 'pending' && (
                          <div className="mt-1">
                            <Button 
                              variant="success" 
                              size="sm"
                              onClick={() => handleApproveSeller(seller._id, seller.shopName)}
                            >
                              ✓ Approve
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              className="ms-1"
                              onClick={() => handleRejectSeller(seller._id, seller.shopName)}
                            >
                              ✗ Reject
                            </Button>
                          </div>
                        )}
                      </td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={seller.status}
                          onChange={(e) => handleStatusUpdate(seller._id, e.target.value)}
                          style={{ width: '130px' }}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Button 
                          variant="link" 
                          size="sm"
                          onClick={() => viewSellerDetails(seller._id)}
                        >
                          👁️ View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      No sellers found
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

      {/* Seller Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>🏪 Seller Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSeller && (
            <div>
              <Row className="mb-4">
                <Col md={3} className="text-center">
                  <img 
                    src={selectedSeller.shopLogo || 'https://via.placeholder.com/150'}
                    alt={selectedSeller.shopName}
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      borderRadius: '12px',
                      objectFit: 'cover'
                    }}
                  />
                </Col>
                <Col md={9}>
                  <h5>{selectedSeller.shopName}</h5>
                  <p className="mb-1"><strong>Owner:</strong> {selectedSeller.ownerName}</p>
                  <p className="mb-1"><strong>Email:</strong> {selectedSeller.email}</p>
                  <p className="mb-1"><strong>Phone:</strong> {selectedSeller.phone}</p>
                  <p className="mb-1"><strong>Verification:</strong> {getVerificationBadge(selectedSeller.verificationStatus)}</p>
                  <p className="mb-1"><strong>Status:</strong> {getStatusBadge(selectedSeller.status)}</p>
                </Col>
              </Row>

              <Card className="mb-3">
                <Card.Body>
                  <h6 className="mb-3">📊 Business Statistics</h6>
                  <Row>
                    <Col md={4}>
                      <p><strong>Total Products:</strong> {selectedSeller.totalProducts || 0}</p>
                    </Col>
                    <Col md={4}>
                      <p><strong>Total Sales:</strong> ₹{selectedSeller.totalSales?.toLocaleString('en-IN') || 0}</p>
                    </Col>
                    <Col md={4}>
                      <p><strong>Total Orders:</strong> {selectedSeller.totalOrders || 0}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <p><strong>Rating:</strong> ⭐ {selectedSeller.rating || 0}/5</p>
                    </Col>
                    <Col md={4}>
                      <p><strong>Reviews:</strong> {selectedSeller.totalReviews || 0}</p>
                    </Col>
                    <Col md={4}>
                      <p><strong>Joined:</strong> {new Date(selectedSeller.createdAt).toLocaleDateString('en-IN')}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Body>
                  <h6 className="mb-3">📍 Business Address</h6>
                  <p>{selectedSeller.businessAddress?.street}</p>
                  <p>{selectedSeller.businessAddress?.city}, {selectedSeller.businessAddress?.state} - {selectedSeller.businessAddress?.zipCode}</p>
                </Card.Body>
              </Card>

              {selectedSeller.documents && (
                <Card>
                  <Card.Body>
                    <h6 className="mb-3">📄 Documents</h6>
                    <div>
                      <p><strong>GST Number:</strong> {selectedSeller.documents.gstNumber || 'N/A'}</p>
                      <p><strong>PAN Number:</strong> {selectedSeller.documents.panNumber || 'N/A'}</p>
                      <p><strong>Bank Account:</strong> {selectedSeller.documents.bankAccount || 'N/A'}</p>
                      <p><strong>IFSC Code:</strong> {selectedSeller.documents.ifscCode || 'N/A'}</p>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {selectedSeller?.verificationStatus?.toLowerCase() === 'pending' && (
            <>
              <Button 
                variant="success"
                onClick={() => {
                  handleApproveSeller(selectedSeller._id, selectedSeller.shopName);
                  setShowModal(false);
                }}
              >
                ✓ Approve Seller
              </Button>
              <Button 
                variant="danger"
                onClick={() => {
                  handleRejectSeller(selectedSeller._id, selectedSeller.shopName);
                  setShowModal(false);
                }}
              >
                ✗ Reject Seller
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sellers;