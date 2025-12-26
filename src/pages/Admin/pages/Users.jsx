// Users.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Row, Col, Card, Table, Badge, Button, Spinner, Modal, InputGroup } from 'react-bootstrap';
import { usersAPI } from "../../../api/services/adminuserapi";
import "../Css/adminUsers.css";
import { toast } from "react-toastify";

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ search: '', status: '', role: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const itemsPerPage = 20;
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getAll(1, 1000);
      setAllUsers(data.content || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters({ search: '', status: '', role: '' });

  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const searchMatch = !filters.search || 
        [user.name, user.email, user.phone].some(field =>
          field?.toLowerCase().includes(filters.search.toLowerCase())
        );
      const statusMatch = !filters.status || user.status?.toUpperCase() === filters.status.toUpperCase();
      const roleMatch = !filters.role || user.role?.toUpperCase() === filters.role.toUpperCase();
      return searchMatch && statusMatch && roleMatch;
    });
  }, [allUsers, filters]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  useEffect(() => setCurrentPage(1), [filters]);

  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: filteredUsers.length,
      active: filteredUsers.filter(u => u.status?.toLowerCase() === 'active').length,
      inactive: filteredUsers.filter(u => u.status?.toLowerCase() === 'inactive').length,
      banned: filteredUsers.filter(u => u.status?.toLowerCase() === 'banned').length,
      suspended: filteredUsers.filter(u => u.status?.toLowerCase() === 'suspended').length,
      blocked: filteredUsers.filter(u => u.status?.toLowerCase() === 'blocked').length,
      thisMonth: filteredUsers.filter(u => {
        const created = new Date(u.createdAt);
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length
    };
  }, [filteredUsers]);

  const handleStatusUpdate = async (userUid, newStatus) => {
    try {
      const response = await usersAPI.updateStatus(userUid, newStatus);
      setAllUsers(prev => prev.map(u => u.userUid === userUid ? { ...u, status: newStatus } : u));
      toast.success(response.message || 'Status updated successfully!');
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status.');
    }
  };

  const viewUserDetails = async (userId) => {
    try {
      const userData = await usersAPI.getByUid(userId);
      setSelectedUser(userData);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details.');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) return;
    try {
      await usersAPI.delete(userId);
      setAllUsers(prev => prev.filter(u => u.userUid !== userId));
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user.');
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Role', 'Status', 'Total Orders', 'Joined Date'],
      ...filteredUsers.map(u => [u.name,u.email,u.phone || 'N/A', u.role || 'USER',u.status,u.totalOrders || 0,
        new Date(u.createdAt).toLocaleDateString('en-IN')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Users exported successfully!');
  };

  const getStatusBadge = (status) => {
    const variants = {'active': 'success','inactive': 'danger','banned': 'dark','suspended': 'warning','blocked': 'secondary'};
    return variants[status?.toLowerCase()] || 'secondary';
  };

  const getRoleBadge = (role) => {
    if (role?.toLowerCase() === 'admin') return 'danger';
    if (role?.toLowerCase() === 'seller') return 'info';
    return 'primary';
  };

  if (loading) return (
    <div className="premium-dashboard">
      <div className="loading-container">
        <Spinner animation="border" variant="light" className="loading-spinner" />
        <p className="loading-text">Loading Users...</p>
      </div>
    </div>
  );

  return (
    <div className="premium-dashboard">
      {/* Page Header */}

      <div className="page-header-card">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h4 className="page-title mb-0">
            <span className="title-icon">👥</span>
            <span className="title-icon-name" color="white">Users Management</span>
          </h4>
          <div className="header-actions">
              <Button className="action-btn" onClick={fetchUsers}>
                <span className="btn-icon">🔄</span>
              </Button>
              <Button className="action-btn" onClick={exportUsers}>
                <span className="btn-icon">📥</span>
              </Button>
            </div>

        </div>
      </div>

      {/* Filters Section */}
      <Card className="filter-card mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <label className="filter-label">Search</label>
              <InputGroup>
                <input type="text" className="form-control" placeholder="Name, email, phone..."
                  value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)}/>
              </InputGroup>
            </Col>
            <Col md={3}>
              <label className="filter-label">Status</label>
              <select className="form-select" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                <option value="">All Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="BANNED">BANNED</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>
            </Col>
            <Col md={3}>
              <label className="filter-label">Role</label>
              <select className="form-select" value={filters.role} onChange={(e) => handleFilterChange('role', e.target.value)}>
                <option value="">All Roles</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                Clear All
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Stats Overview */}
      <Row className="g-3 mb-4">
        {[
          { label: 'Total Users', value: stats.total, icon: '👤', className: 'stat-total' },
          { label: 'Active Users', value: stats.active, icon: '✓', className: 'stat-active' },
          { label: 'Inactive', value: stats.inactive, icon: '○', className: 'stat-inactive' },
          { label: 'Banned', value: stats.banned, icon: '✕', className: 'stat-banned' }
        ].map((stat, idx) => (
          <Col key={idx} lg={3} md={6} sm={6}>
            <Card className={`stat-card ${stat.className}`}>
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-info">
                    <small className="stat-label">{stat.label}</small>
                    <h3 className="stat-value">{stat.value}</h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Users Table */}
      <Card className="table-card">
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Orders</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length ? paginatedUsers.map(user => (
                  <tr key={user.userUid} className={user.role?.toLowerCase() === 'admin' ? 'admin-row' : ''}>
                    <td>
                      <div className="user-info">
                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=667eea&color=fff`}
                          alt={user.name} className="user-avatar"/>
                        <div className="user-details">
                          <strong className="user-name">{user.name}</strong>
                          <small className="user-id">ID: {user.userUid?.substring(0, 8)}</small>
                        </div>
                      </div>
                    </td>
                    <td className="email-cell">{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      <Badge bg={getRoleBadge(user.role)} className="role-badge">{user.role || 'USER'}</Badge>
                    </td>
                    <td>{user.totalOrders || 0}</td>
                    <td>
                      <select className={`form-select form-select-sm status-select status-${user.status?.toLowerCase()}`}
                        value={user.status} onChange={e => handleStatusUpdate(user.userUid, e.target.value)}>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="BANNED">BANNED</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                        <option value="BLOCKED">BLOCKED</option>
                      </select>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <div className="action-buttons">
                        <Button variant="link" size="sm" className="action-btn-view" onClick={() => viewUserDetails(user.userUid)}>👁️</Button>
                        <Button variant="link" size="sm" className="action-btn-delete" onClick={() => handleDeleteUser(user.userUid, user.name)}>🗑️</Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="text-center no-data">No users found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <Button variant="outline-primary" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}
                className="pagination-btn">← Previous
              </Button>
              <span className="pagination-info">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>
              <Button variant="outline-primary" disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)} className="pagination-btn">Next →
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* User Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>👤 User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          {selectedUser && (
            <>
              <Row className="mb-4">
                <Col md={3} className="text-center">
                  <img src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${selectedUser.name}&background=667eea&color=fff&size=150`}
                    alt={selectedUser.name} className="modal-avatar"/>
                </Col>
                <Col md={9}>
                  <h5 className="modal-user-name">{selectedUser.name}</h5>
                  <p className="mb-2"><strong>Email:</strong> {selectedUser.email}</p>
                  <p className="mb-2"><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                  <p className="mb-2">
                    <strong>Role:</strong> <Badge bg={getRoleBadge(selectedUser.role)}>{selectedUser.role}</Badge>
                  </p>
                  <p className="mb-2">
                    <strong>Status:</strong> <Badge bg={getStatusBadge(selectedUser.status)}>{selectedUser.status}</Badge>
                  </p>
                  <p className="mb-2">
                    <strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </Col>
              </Row>

              <Card className="stats-card mb-3">
                <Card.Body>
                  <h6 className="stats-title">📊 User Statistics</h6>
                  <Row>
                    <Col md={4}><p><strong>Total Orders:</strong> {selectedUser.totalOrders || 0}</p></Col>
                    <Col md={4}><p><strong>Total Spent:</strong> ₹{selectedUser.totalSpent?.toLocaleString('en-IN') || 0}</p></Col>
                    <Col md={4}><p><strong>Last Order:</strong> {selectedUser.lastOrderDate ? new Date(selectedUser.lastOrderDate).toLocaleDateString('en-IN') : 'N/A'}</p></Col>
                  </Row>
                </Card.Body>
              </Card>

              {selectedUser.addresses?.length > 0 && (
                <Card className="address-card">
                  <Card.Body>
                    <h6 className="address-title">📍 Saved Addresses</h6>
                    {selectedUser.addresses.map((address, idx) => (
                      <div key={idx} className="address-item">
                        <strong>{address.label || `Address ${idx + 1}`}:</strong>
                        <p className="address-text">{address.street}, {address.city}, {address.state} - {address.zipCode}</p>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              )}
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

export default Users;
