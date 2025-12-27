// Enhanced Sellers.jsx - Real-Time Updates
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {Row,Col,Card,Table,Badge,Button,Form,Spinner,Modal,InputGroup,} from "react-bootstrap";
import sellersAPI from "../../../api/services/adminSellerApi";
import "../Css/AdminSeller.css";
import { toast } from "react-toastify";

const PAGE_SIZE = 20;

const Sellers = () => {
  const [loading, setLoading] = useState(false);
  const [allSellers, setAllSellers] = useState([]); // Store all sellers
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBusinesses, setSelectedBusinesses] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    verificationStatus: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  // Fetch all sellers once
  const fetchSellers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await sellersAPI.getAll(0, 1000, {});
      const pageData = res.data;
      setAllSellers(pageData.content || []);
      toast.success("Sellers loaded successfully!");
    } catch (err) {
      console.error("Fetch sellers failed:", err);
      toast.error("Failed to load sellers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  // Client-side filtering
  const filteredSellers = useMemo(() => {
    return allSellers.filter(seller => {
      // Search filter
      const searchMatch = !filters.search || 
        [seller.shopName, seller.ownerName, seller.email, seller.phone]
          .some(field => field?.toLowerCase().includes(filters.search.toLowerCase()));
      
      // Verification status filter
      const verificationMatch = !filters.verificationStatus || 
        seller.verificationStatus?.toLowerCase() === filters.verificationStatus.toLowerCase();
      
      // Status filter (active/inactive)
      const statusMatch = !filters.status || 
        (filters.status === 'active' ? seller.active : !seller.active);
      
      return searchMatch && verificationMatch && statusMatch;
    });
  }, [allSellers, filters]);

  // Calculate stats from ALL sellers (not filtered)
  const stats = useMemo(() => {
    return {
      total: allSellers.length,
      approved: allSellers.filter(s => s.verificationStatus?.toLowerCase() === "approved").length,
      pending: allSellers.filter(s => s.verificationStatus?.toLowerCase() === "pending").length,
      rejected: allSellers.filter(s => s.verificationStatus?.toLowerCase() === "rejected").length,
    };
  }, [allSellers]);

  // Pagination
  const totalPages = Math.ceil(filteredSellers.length / PAGE_SIZE);
  const paginatedSellers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredSellers.slice(start, start + PAGE_SIZE);
  }, [filteredSellers, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", status: "", verificationStatus: "" });
  };

  // Real-time update helper function
  const updateSellerInState = (sellerUid, updates) => {
    setAllSellers(prevSellers => 
      prevSellers.map(seller => 
        seller.sellerUid === sellerUid 
          ? { ...seller, ...updates }
          : seller
      )
    );
    
    // Update modal if it's the selected seller
    if (selectedSeller?.sellerUid === sellerUid) {
      setSelectedSeller(prev => ({ ...prev, ...updates }));
    }
  };

  const approveSeller = async (seller) => {
    if (!window.confirm(`Approve seller "${seller.shopName}"?`)) return;
    try {
      await sellersAPI.approve(seller.sellerUid);
      
      // Real-time update: Change verification status to approved
      updateSellerInState(seller.sellerUid, { 
        verificationStatus: "APPROVED",
        active: true 
      });
      
      toast.success(`Seller "${seller.shopName}" approved successfully!`);
    } catch (err) {
      console.error("Approve failed:", err);
      toast.error(err.response?.data?.message || "Failed to approve seller");
    }
  };

  const rejectSeller = async (seller) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await sellersAPI.reject(seller.sellerUid, reason);
      
      // Real-time update: Change verification status to rejected
      updateSellerInState(seller.sellerUid, { 
        verificationStatus: "REJECTED",
        rejectionReason: reason,
        active: false
      });
      
      toast.success(`Seller "${seller.shopName}" rejected`);
    } catch (err) {
      console.error("Reject failed:", err);
      toast.error(err.response?.data?.message || "Failed to reject seller");
    }
  };

  const updateStatus = async (sellerUid, status) => {
    try {
      await sellersAPI.updateStatus(sellerUid, status);
      
      // Real-time update: Change active status
      updateSellerInState(sellerUid, { 
        active: status === 'active' 
      });
      
      toast.success("Status updated successfully!");
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
      
      // Revert on error - refetch to get correct state
      fetchSellers();
    }
  };

  const viewDetails = async (sellerUid) => {
  try {
    setSelectedSeller(null); // Clear previous data
    setSelectedBusinesses([]); // Clear previous businesses
    
    const res = await sellersAPI.getById(sellerUid);
    console.log("API Response:", res); // Debug log
    
    // Handle different response structures
    const businesses = res.data?.data || res.data || res || [];
    
    console.log("Parsed Businesses:", businesses); // Debug log
    
    setSelectedBusinesses(Array.isArray(businesses) ? businesses : [businesses]);
    
    // Find the seller from allSellers state
    const seller = allSellers.find(s => s.sellerUid === sellerUid);
    setSelectedSeller(seller);
    
    setShowModal(true);
  } catch (err) {
    console.error("Fetch details failed:", err);
    toast.error("Failed to load seller details");
  }
};


  const getVerificationBadge = (status) => {
    const variants = {
      approved: "success",
      pending: "warning",
      rejected: "danger",
    };
    return variants[status?.toLowerCase()] || "secondary";
  };

  const getStatusBadge = (status) => {
    return status ? "success" : "secondary";
  };

  if (loading && allSellers.length === 0) {
    return (
      <div className="dashboard-content">
        <div className="loading-container">
          <Spinner animation="border" className="loading-spinner" />
          <p className="loading-text">Loading Sellers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap">
        <h4>Sellers Management</h4>
        <div className="header-actions">
          <Button variant="outline-primary" onClick={fetchSellers} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "🔄 Refresh"}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card stat-total">
          <div className="stat-icon">🏪</div>
          <div className="stat-info">
            <small className="stat-label">Total Sellers</small>
            <h3 className="stat-value">{stats.total}</h3>
          </div>
        </div>
        <div className="stat-card stat-approved">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <small className="stat-label">Approved</small>
            <h3 className="stat-value">{stats.approved}</h3>
          </div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <small className="stat-label">Pending</small>
            <h3 className="stat-value">{stats.pending}</h3>
          </div>
        </div>
        <div className="stat-card stat-rejected">
          <div className="stat-icon">✕</div>
          <div className="stat-info">
            <small className="stat-label">Rejected</small>
            <h3 className="stat-value">{stats.rejected}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="filter-card mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col xs={12} md={4}>
              <Form.Label>Search</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="Shop / Owner / Email / Phone"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </InputGroup>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Form.Label>Verification</Form.Label>
              <Form.Select
                value={filters.verificationStatus}
                onChange={(e) => handleFilterChange("verificationStatus", e.target.value)}
              >
                <option value="">All Verification</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Col>

            <Col xs={12} md={2} className="d-flex gap-2 align-items-end">
              <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                Clear All
              </Button>
            </Col>
          </Row>
          
          {/* Results count */}
          <div className="mt-3">
            <small className="text-muted">
              Showing <strong>{paginatedSellers.length}</strong> of <strong>{filteredSellers.length}</strong> sellers
            </small>
          </div>
        </Card.Body>
      </Card>

      {/* Table */}
      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="sellers-table">
              <thead>
                <tr>
                  <th>Shop</th>
                  <th>Owner</th>
                  <th>Contact</th>
                  <th>Verification</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <Spinner size="sm" /> Loading...
                    </td>
                  </tr>
                ) : paginatedSellers.length ? (
                  paginatedSellers.map((s) => (
                    <tr key={s.sellerUid}>
                      <td>
                        <div className="seller-info">
                          <img
                            src={s.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.shopName)}&background=667eea&color=fff`}
                            alt={s.shopName}
                            className="seller-logo"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.shopName)}&background=667eea&color=fff`;
                            }}
                          />
                          <div className="seller-details">
                            <strong className="seller-name">{s.shopName}</strong>
                            <small className="seller-id">{s.sellerUid?.substring(0, 8)}</small>
                          </div>
                        </div>
                      </td>
                      <td>{s.ownerName}</td>
                      <td>
                        <div>{s.email}</div>
                        <small className="text-muted">{s.phone}</small>
                      </td>
                      <td>
                        <Badge bg={getVerificationBadge(s.verificationStatus)}>
                          {s.verificationStatus || "N/A"}
                        </Badge>
                      </td>
                      <td>
                        <Form.Select 
                          size="sm" 
                          className="status-select-inline"
                          value={s.active ? "active" : "inactive"}
                          onChange={(e) => updateStatus(s.sellerUid, e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </Form.Select>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn-view" onClick={() => viewDetails(s.sellerUid)}
                            title="View Details"
                          >
                            👁️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      <div className="empty-state">
                        <div className="empty-state-icon">🏪</div>
                        <p className="empty-state-text">
                          {filters.search || filters.status || filters.verificationStatus
                            ? "No sellers match your filters"
                            : "No sellers found"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <Button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                ← Previous
              </Button>
              <span className="pagination-info">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>
              <Button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next →
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

{/* Premium Details Modal */}
<Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
  <Modal.Header closeButton>
    <Modal.Title>
      <span>🏪</span> Seller Details
    </Modal.Title>
  </Modal.Header>
  
      <Modal.Body>
  {selectedSeller ? (
    <>
      {/* Premium Profile Section */}
      <div className="seller-profile-section">
        <div className="seller-profile-content">
          <div className="seller-avatar-wrapper">
            <img
              src={selectedSeller.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedSeller.shopName)}&background=667eea&color=fff&size=200`}
              alt={selectedSeller.shopName}
              className="seller-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedSeller.shopName)}&background=667eea&color=fff&size=200`;
              }}
            />
          </div>
          <div className="seller-profile-info">
            <h3>{selectedSeller.shopName}</h3>
            <div className="seller-profile-badges">
              <span className="badge-premium">
                <span>{selectedSeller.active ? '✓' : '✕'}</span>
                {selectedSeller.active ? 'Active' : 'Inactive'}
              </span>
              <span className="badge-premium">
                <span>
                  {selectedSeller.verificationStatus === 'APPROVED' ? '✓' : 
                   selectedSeller.verificationStatus === 'PENDING' ? '⏳' : '✕'}
                </span>
                {selectedSeller.verificationStatus || 'N/A'}
              </span>
              {selectedSeller.createdAt && (
                <span className="badge-premium">
                  <span>📅</span>
                  Joined {new Date(selectedSeller.createdAt).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'short' 
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Alert */}
      {selectedSeller.rejectionReason && (
        <div className="rejection-alert">
          <h6>❌ Rejection Reason</h6>
          <p>{selectedSeller.rejectionReason}</p>
        </div>
      )}

      {/* Primary Contact Card */}
      <div className="seller-info-grid">
        <div className="info-card contact-card">
          <div className="info-card-header">
            <div className="info-card-icon">👤</div>
            <h6 className="info-card-title">Primary Contact</h6>
          </div>
          <div className="info-card-content">
            <div className="info-row">
              <span className="info-label">Owner</span>
              <span className="info-value">{selectedSeller.ownerName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{selectedSeller.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone</span>
              <span className="info-value">{selectedSeller.phone || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Business Details Section */}
      {selectedBusinesses && selectedBusinesses.length > 0 ? (
        <>
          <div style={{ 
            marginTop: '1.5rem', 
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <h5 style={{ 
              color: '#1f2937', 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              💼 Business Details ({selectedBusinesses.length})
            </h5>
          </div>

          {selectedBusinesses.map((business, idx) => (
            <div key={business.businessUid || idx} style={{ marginBottom: '1.5rem' }}>
              {/* Business Header */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                padding: '1rem 1.5rem',
                borderRadius: '12px 12px 0 0',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h6 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                  {business.businessName || `Business ${idx + 1}`}
                </h6>
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem'
                }}>
                  {business.businessType || 'N/A'}
                </span>
              </div>

              {/* Business Info Cards */}
              <div className="seller-info-grid" style={{ marginTop: 0 }}>
                {/* Business Details Card */}
                <div className="info-card business-card">
                  <div className="info-card-header">
                    <div className="info-card-icon">🏢</div>
                    <h6 className="info-card-title">Business Info</h6>
                  </div>
                  <div className="info-card-content">
                    <div className="info-row">
                      <span className="info-label">Full Name</span>
                      <span className="info-value">{business.fullName || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Category</span>
                      <span className="info-value">{business.category || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">GST Number</span>
                      <span className="info-value" style={{ 
                        fontFamily: 'monospace', 
                        fontSize: '0.85rem' 
                      }}>
                        {business.gstNumber || 'N/A'}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">PAN Number</span>
                      <span className="info-value" style={{ 
                        fontFamily: 'monospace', 
                        fontSize: '0.85rem' 
                      }}>
                        {business.panNumber || 'N/A'}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Products</span>
                      <span className="info-value">{business.productCount || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Address Card */}
                {business.warehouseAddress && (
                  <div className="info-card location-card">
                    <div className="info-card-header">
                      <div className="info-card-icon">📍</div>
                      <h6 className="info-card-title">Warehouse Address</h6>
                    </div>
                    <div className="info-card-content">
                      <div className="info-row">
                        <span className="info-label">Address</span>
                        <span className="info-value">{business.warehouseAddress}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">City</span>
                        <span className="info-value">{business.city || 'N/A'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">State</span>
                        <span className="info-value">{business.state || 'N/A'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Pincode</span>
                        <span className="info-value">{business.pincode || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Details Card */}
                {business.accountNumber && (
                  <div className="info-card" style={{ borderLeftColor: '#8b5cf6' }}>
                    <div className="info-card-header">
                      <div className="info-card-icon">🏦</div>
                      <h6 className="info-card-title">Bank Details</h6>
                    </div>
                    <div className="info-card-content">
                      <div className="info-row">
                        <span className="info-label">Account Name</span>
                        <span className="info-value">{business.accountName || 'N/A'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Account No.</span>
                        <span className="info-value" style={{ 
                          fontFamily: 'monospace', 
                          fontSize: '0.85rem' 
                        }}>
                          {business.accountNumber || 'N/A'}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">IFSC Code</span>
                        <span className="info-value" style={{ 
                          fontFamily: 'monospace', 
                          fontSize: '0.85rem' 
                        }}>
                          {business.ifscCode || 'N/A'}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Bank Name</span>
                        <span className="info-value">{business.bankName || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          background: '#f9fafb',
          borderRadius: '12px',
          marginTop: '1rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💼</div>
          <p style={{ color: '#6b7280', margin: 0 }}>No business details available</p>
        </div>
      )}

      {/* Description */}
      {selectedSeller.description && (
        <div className="description-card">
          <h6>📝 Shop Description</h6>
          <p>{selectedSeller.description}</p>
        </div>
      )}

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-box-icon">📦</div>
          <div className="stat-box-value">{selectedSeller.totalProducts || 0}</div>
          <div className="stat-box-label">Products</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-icon">🛒</div>
          <div className="stat-box-value">{selectedSeller.totalOrders || 0}</div>
          <div className="stat-box-label">Orders</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-icon">⭐</div>
          <div className="stat-box-value">{selectedSeller.rating || 'N/A'}</div>
          <div className="stat-box-label">Rating</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-icon">💰</div>
          <div className="stat-box-value">
            {selectedSeller.totalRevenue ? `₹${selectedSeller.totalRevenue}` : 'N/A'}
          </div>
          <div className="stat-box-label">Revenue</div>
        </div>
      </div>
    </>
  ) : (
    <div className="modal-loading">
      <Spinner animation="border" />
      <p>Loading seller details...</p>
    </div>
  )}
</Modal.Body>
  <Modal.Footer>
    <div className="footer-status">
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#6b7280' }}>
        Current Status:
      </span>
      <Badge bg={getVerificationBadge(selectedSeller?.verificationStatus)}>
        {selectedSeller?.verificationStatus || 'N/A'}
      </Badge>
    </div>

    <div className="footer-actions">
      <Button
        variant="success"
        disabled={selectedSeller?.verificationStatus === "APPROVED"}
        onClick={() => approveSeller(selectedSeller)}
      >
        <span>✓</span> Approve
      </Button>

      <Button
        variant="danger"
        disabled={selectedSeller?.verificationStatus === "REJECTED"}
        onClick={() => rejectSeller(selectedSeller)}
      >
        <span>✕</span> Reject
      </Button>

      <Button 
        variant="secondary" 
        onClick={() => setShowModal(false)}
      >
        Close
      </Button>
    </div>
  </Modal.Footer>
</Modal>
    </div>
  );
};

export default Sellers;