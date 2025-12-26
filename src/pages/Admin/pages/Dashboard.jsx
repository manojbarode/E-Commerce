// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Table, Badge, Button, Spinner, Dropdown } from 'react-bootstrap';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import adminDashboardApi, { dashboardAPI } from "../../../api/services/adminDashboardApi";
import "../Css/dashboard.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, salesChartData, ordersData, categoryDistribution] = await Promise.all([
        adminDashboardApi.getStats(),
        dashboardAPI.getSalesData(selectedPeriod),
        dashboardAPI.getRecentOrders(5),
        dashboardAPI.getCategoryDistribution()
      ]);
      
      setStats(statsData);
      setSalesData(salesChartData);
      setRecentOrders(ordersData);
      setCategoryData(categoryDistribution);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      alert('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const variants = {
      'delivered': 'success',
      'processing': 'warning',
      'shipped': 'info',
      'pending': 'secondary',
      'cancelled': 'danger'
    };
    return <Badge bg={variants[statusLower] || 'secondary'}>{status}</Badge>;
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || 0}`;
  };

  const COLORS = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#feca57'];

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="page-header">
        <h4>📊 Dashboard</h4>
        <Button variant="primary" onClick={fetchDashboardData}>
          🔄 Refresh
        </Button>
      </div>

      {/* Stats Cards Row */}
      <Row className="g-4 mb-4">
        <Col lg={3} md={6}>
          <Card className="stat-card stat-card-1">
            <Card.Body>
              <div className="stat-icon">💰</div>
              <div className="stat-details">
                <h6 className="stat-title">Total Revenue</h6>
                <h3 className="stat-value">{formatCurrency(stats?.totalRevenue)}</h3>
                <span className={`stat-change ${stats?.revenueChange >= 0 ? 'positive' : 'negative'}`}>
                  {stats?.revenueChange >= 0 ? '↑' : '↓'} {Math.abs(stats?.revenueChange)}% from last month
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="stat-card stat-card-2">
            <Card.Body>
              <div className="stat-icon">📦</div>
              <div className="stat-details">
                <h6 className="stat-title">Total Orders</h6>
                <h3 className="stat-value">{stats?.totalOrders?.toLocaleString() || 0}</h3>
                <span className={`stat-change ${stats?.ordersChange >= 0 ? 'positive' : 'negative'}`}>
                  {stats?.ordersChange >= 0 ? '↑' : '↓'} {Math.abs(stats?.ordersChange)}% from last month
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="stat-card stat-card-3">
            <Card.Body>
              <div className="stat-icon">🛍️</div>
              <div className="stat-details">
                <h6 className="stat-title">Total Products</h6>
                <h3 className="stat-value">{stats?.totalProducts?.toLocaleString() || 0}</h3>
                <span className={`stat-change ${stats?.productsChange >= 0 ? 'positive' : 'negative'}`}>
                  {stats?.productsChange >= 0 ? '↑' : '↓'} {Math.abs(stats?.productsChange)}% from last month
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="stat-card stat-card-4">
            <Card.Body>
              <div className="stat-icon">👥</div>
              <div className="stat-details">
                <h6 className="stat-title">Total Users</h6>
                <h3 className="stat-value">{stats?.totalUsers?.toLocaleString() || 0}</h3>
                <span className={`stat-change ${stats?.usersChange >= 0 ? 'positive' : 'negative'}`}>
                  {stats?.usersChange >= 0 ? '↑' : '↓'} {Math.abs(stats?.usersChange)}% from last month
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="g-4 mb-4">
        {/* Sales Overview Chart */}
        <Col lg={8}>
          <Card className="chart-card">
            <Card.Body>
              <div className="chart-header">
                <h5>📈 Sales Overview</h5>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSelectedPeriod('daily')}>Daily</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedPeriod('weekly')}>Weekly</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedPeriod('monthly')}>Monthly</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedPeriod('yearly')}>Yearly</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#fff', 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '8px' 
                    }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#667eea" 
                    fillOpacity={1} 
                    fill="url(#colorSales)"
                    name="Sales"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Category Distribution Chart */}
        <Col lg={4}>
          <Card className="chart-card">
            <Card.Body>
              <h5 className="mb-3">📊 Category Distribution</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} products`} />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Orders & Products Row */}
      <Row className="g-4 mb-4">
        {/* Order Status Distribution */}
        <Col lg={6}>
          <Card className="chart-card">
            <Card.Body>
              <h5 className="mb-3">📦 Order Status Distribution</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats?.orderStatusDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#fff', 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '8px' 
                    }}
                  />
                  <Bar dataKey="count" fill="#667eea" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Top Products */}
        <Col lg={6}>
          <Card className="chart-card">
            <Card.Body>
              <h5 className="mb-3">🏆 Top Selling Products</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats?.topProducts || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#fff', 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '8px' 
                    }}
                  />
                  <Bar dataKey="sales" fill="#f093fb" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Table */}
      <Row className="g-4">
        <Col lg={12}>
          <Card className="table-card">
            <Card.Body>
              <div className="table-header">
                <h5>📋 Recent Orders</h5>
                <Link to="/orders" className="view-all-btn">View All →</Link>
              </div>
              <div className="table-responsive">
                <Table hover className="modern-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Products</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order, index) => (
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
                          <td>{getStatusBadge(order.status)}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                          <td>
                            <Link to={`/orders/${order._id}`}>
                              <Button variant="link" size="sm">View Details</Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted py-4">
                          No recent orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats Row */}
      <Row className="g-4 mt-3">
        <Col lg={3} md={6}>
          <Card className="quick-stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Pending Orders</h6>
                  <h4 className="mb-0">{stats?.pendingOrders || 0}</h4>
                </div>
                <div className="quick-stat-icon bg-warning">⏳</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="quick-stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Low Stock Items</h6>
                  <h4 className="mb-0">{stats?.lowStockItems || 0}</h4>
                </div>
                <div className="quick-stat-icon bg-danger">⚠️</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="quick-stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">New Users</h6>
                  <h4 className="mb-0">{stats?.newUsers || 0}</h4>
                </div>
                <div className="quick-stat-icon bg-success">👤</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="quick-stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Pending Reviews</h6>
                  <h4 className="mb-0">{stats?.pendingReviews || 0}</h4>
                </div>
                <div className="quick-stat-icon bg-info">⭐</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;