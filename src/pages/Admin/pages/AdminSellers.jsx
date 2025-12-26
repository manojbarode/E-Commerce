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
      const res = await sellersAPI.getById(sellerUid);
      setSelectedSeller(res.data?.data || res.data || res);
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
                          {s.verificationStatus?.toUpperCase() === "PENDING" && (
                            <>
                              <Button size="sm" variant="success" onClick={() => approveSeller(s)}>
                                ✓ Approve
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => rejectSeller(s)}>
                                ✕ Reject
                              </Button>
                            </>
                          )}
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

      {/* Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Seller Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSeller && (
            <>
              <Row className="mb-4">
                <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
                  <img src={selectedSeller.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedSeller.shopName)}&background=667eea&color=fff&size=150`}
                    alt={selectedSeller.shopName} className="modal-avatar"
                    style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "50%" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedSeller.shopName)}&background=667eea&color=fff&size=150`;
                    }}
                  />
                </Col>
                <Col xs={12} md={9}>
                  <h5 className="modal-user-name">{selectedSeller.shopName}</h5>
                  <p className="mb-2"><strong>Owner:</strong> {selectedSeller.ownerName}</p>
                  <p className="mb-2"><strong>Email:</strong> {selectedSeller.email}</p>
                  <p className="mb-2"><strong>Phone:</strong> {selectedSeller.phone || "N/A"}</p>
                  <p className="mb-2">
                    <strong>Status:</strong>{" "}
                    <Badge bg={getStatusBadge(selectedSeller.active)}>
                      {selectedSeller.active ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </p>
                  <p className="mb-2">
                    <strong>Verification:</strong>{" "}
                    <Badge bg={getVerificationBadge(selectedSeller.verificationStatus)}>
                      {selectedSeller.verificationStatus || "N/A"}
                    </Badge>
                  </p>
                  {selectedSeller.createdAt && (
                    <p className="mb-2">
                      <strong>Joined:</strong>{" "}
                      {new Date(selectedSeller.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  )}
                </Col>
              </Row>

              {selectedSeller.rejectionReason && (
                <div className="seller-detail-card" style={{ borderLeft: "4px solid #ef4444" }}>
                  <div className="seller-detail-section">
                    <h6 style={{ color: "#ef4444" }}>❌ Rejection Reason</h6>
                    <p>{selectedSeller.rejectionReason}</p>
                  </div>
                </div>
              )}

              {selectedSeller.description && (
                <div className="seller-detail-card">
                  <div className="seller-detail-section">
                    <h6>📝 Shop Description</h6>
                    <p>{selectedSeller.description}</p>
                  </div>
                </div>
              )}

              {selectedSeller.address && (
                <div className="seller-detail-card">
                  <div className="seller-detail-section">
                    <h6>📍Shop Address</h6>
                    <p>{selectedSeller.address}</p>
                  </div>
                </div>
              )}

              <Card className="stats-card">
                <Card.Body>
                  <h6 className="stats-title">📊 Seller Statistics</h6>
                  <Row>
                    <Col xs={12} sm={4} className="mb-2 mb-sm-0">
                      <p className="mb-0">
                        <strong>Total Products:</strong> {selectedSeller.totalProducts || 0}
                      </p>
                    </Col>
                    <Col xs={12} sm={4} className="mb-2 mb-sm-0">
                      <p className="mb-0">
                        <strong>Total Orders:</strong> {selectedSeller.totalOrders || 0}
                      </p>
                    </Col>
                    <Col xs={12} sm={4}>
                      <p className="mb-0">
                        <strong>Rating:</strong> {selectedSeller.rating || "N/A"} ⭐
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sellers;