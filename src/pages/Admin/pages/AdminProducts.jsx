// AdminProducts.jsx - View Only, Client-Side Search, Real-Time Updates
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Table, Badge, Button, Form, Spinner, Modal, InputGroup } from 'react-bootstrap';
import { productsAPI } from "../../../api/services/adminProductApi";
import "../Css/AdminProduct.css";
import { toast } from "react-toastify";
import { fetchCategories1 } from "../../../Redux/categoriesSlice";

const PAGE_SIZE = 20;

const AdminProducts = () => {
  const dispatch = useDispatch();
  
  // Redux state for categories
  const { data: categories, status: categoriesStatus } = useSelector(
    (state) => state.categories
  );

  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [filters, setFilters] = useState({search: '',category: '',subCategory: '',status: '',minPrice: '',maxPrice: ''});
  
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const filterCategoryData = categories.find(cat => cat.id === filters.category);
  const filterSubcategories = filterCategoryData?.subcategories || [];

  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories1());
    }
  }, [dispatch, categoriesStatus]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Fetch ALL products once
  const fetchAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch large number to get all products
      const data = await productsAPI.getAll(0, 1000, {});
      setAllProducts(data.products || []);
      toast.success("Products loaded successfully!");
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Search filter (name, SKU, brand)
      const searchMatch = !filters.search || 
        [product.name, product.sku, product.brand]
          .some(field => field?.toLowerCase().includes(filters.search.toLowerCase()));
      const categoryMatch = !filters.category || 
        product.category === filters.category;
      const subCategoryMatch = !filters.subCategory || 
        product.subCategory === filters.subCategory;

      let statusMatch = true;
      if (filters.status === 'active') {
        statusMatch = product.isActive;
      } else if (filters.status === 'inactive') {
        statusMatch = !product.isActive;
      } else if (filters.status === 'out-of-stock') {
        statusMatch = product.stock === 0;
      }
      const minPriceMatch = !filters.minPrice || 
        product.price >= parseFloat(filters.minPrice);
      
      const maxPriceMatch = !filters.maxPrice || 
        product.price <= parseFloat(filters.maxPrice);
      
      return searchMatch && categoryMatch && subCategoryMatch && 
             statusMatch && minPriceMatch && maxPriceMatch;
    });
  }, [allProducts, filters]);

  // Calculate stats from filtered products
  const stats = useMemo(() => {
    return {
      total: allProducts.length,
      active: allProducts.filter(p => p.isActive).length,
      outOfStock: allProducts.filter(p => p.stock === 0).length,
      lowStock: allProducts.filter(p => p.stock > 0 && p.stock <= 10).length,
    };
  }, [allProducts]);

  // Pagination on filtered products
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
    
      if (key === 'category') {
        updated.subCategory = '';
      }
      
      return updated;
    });
  };

  const clearFilters = () => {
    setFilters({ search: '',category: '',subCategory: '',status: '', minPrice: '', maxPrice: '' });
  };

  const viewProductDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || 0}`;
  };

  // Get category name from ID
  const getCategoryName = (categoryId) => {
    const filterCategoryData = categories.find(cat => String(cat.id) === String(filters.category));

    return filterCategoryData?.name || categoryId;
  };

  // Get subcategory name from ID
  const getSubcategoryName = (categoryId, subCategoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    const subcategory = category?.subcategories?.find(sub => sub.id === subCategoryId);
    return subcategory?.name || subCategoryId;
  };

  if (loading && allProducts.length === 0) {
    return (
      <div className="dashboard-content">
        <div className="loading-container">
          <Spinner animation="border" className="loading-spinner" />
          <p className="loading-text">Loading Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="page-header">
        <h4>Products Management</h4>
        <div className="header-actions">
          <Button variant="outline-primary" onClick={fetchAllProducts} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "🔄 Refresh"}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card stat-total">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <small className="stat-label">Total Products</small>
            <h3 className="stat-value">{stats.total}</h3>
          </div>
        </div>
        <div className="stat-card stat-approved">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <small className="stat-label">Active</small>
            <h3 className="stat-value">{stats.active}</h3>
          </div>
        </div>
        <div className="stat-card stat-rejected">
          <div className="stat-icon">✕</div>
          <div className="stat-info">
            <small className="stat-label">Out of Stock</small>
            <h3 className="stat-value">{stats.outOfStock}</h3>
          </div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <small className="stat-label">Low Stock</small>
            <h3 className="stat-value">{stats.lowStock}</h3>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="filter-card mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col xs={12} md={3}>
              <Form.Label>Search</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Product name, SKU, brand..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </InputGroup>
            </Col>
            
            <Col xs={12} sm={6} md={2}>
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={12} sm={6} md={2}>
              <Form.Label>Subcategory</Form.Label>
              <Form.Select
                value={filters.subCategory}
                onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                disabled={!filters.category || filterSubcategories.length === 0}
              >
                <option value="">All Subcategories</option>
                {filterSubcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={12} sm={6} md={2}>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out-of-stock">Out of Stock</option>
              </Form.Select>
            </Col>

            <Col xs={6} sm={4} md={1}>
              <Form.Label>Min ₹</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </Col>

            <Col xs={6} sm={4} md={1}>
              <Form.Label>Max ₹</Form.Label>
              <Form.Control
                type="number"
                placeholder="10000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </Col>

            <Col xs={12} sm={4} md={1} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                Clear
              </Button>
            </Col>
          </Row>
          
          <div className="mt-3">
            <small className="text-muted">
              Showing <strong>{paginatedProducts.length}</strong> of <strong>{filteredProducts.length}</strong> products
              {filteredProducts.length !== allProducts.length && 
                ` (filtered from ${allProducts.length} total)`
              }
            </small>
          </div>
        </Card.Body>
      </Card>

      {/* Products Table */}
      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="sellers-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <Spinner size="sm" /> Loading...
                    </td>
                  </tr>
                ) : paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <tr key={product._id || product.id}>
                      <td>
                        <img 
                          src={product.images?.[0] || 'https://via.placeholder.com/50'} 
                          alt={product.name} 
                          className="seller-logo"
                        />
                      </td>
                      <td>
                        <div className="seller-details">
                          <strong className="seller-name">{product.name}</strong>
                          <small className="seller-id">{product.brand || 'No Brand'}</small>
                        </div>
                      </td>
                      <td>
                        <code style={{ 
                          fontSize: '0.85rem', 
                          background: '#f3f4f6', 
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px'
                        }}>
                          {product.sku}
                        </code>
                      </td>
                      <td>
                        <div>
                          <div>{getCategoryName(product.category)}</div>
                          {product.subCategory && (
                            <small className="text-muted">
                              {getSubcategoryName(product.category, product.subCategory)}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{formatCurrency(product.price)}</strong>
                          {product.comparePrice && product.comparePrice > product.price && (
                            <>
                              <br />
                              <small className="text-muted text-decoration-line-through">
                                {formatCurrency(product.comparePrice)}
                              </small>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge bg={
                          product.stock === 0 ? 'danger' : 
                          product.stock <= 10 ? 'warning' : 
                          'success'
                        }>
                          {product.stock} units
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={product.isActive ? 'success' : 'secondary'}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn-view"
                            onClick={() => viewProductDetails(product)}
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
                    <td colSpan="8" className="text-center">
                      <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        <p className="empty-state-text">
                          {filters.search || filters.category || filters.status
                            ? "No products match your filters"
                            : "No products found"}
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
              <Button 
                className="pagination-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ← Previous
              </Button>
              <span className="pagination-info">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>
              <Button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next →
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Product Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>📦 Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              {/* Product Images */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    overflowX: 'auto',
                    padding: '0.5rem'
                  }}>
                    {selectedProduct.images.map((img, idx) => (
                      <img 
                        key={idx}
                        src={img} 
                        alt={`${selectedProduct.name} ${idx + 1}`}
                        style={{
                          width: '150px',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          border: '2px solid #e5e7eb',
                          flexShrink: 0
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Product Info Grid */}
              <div className="seller-info-grid">
                <div className="info-card contact-card">
                  <div className="info-card-header">
                    <div className="info-card-icon">📋</div>
                    <h6 className="info-card-title">Basic Info</h6>
                  </div>
                  <div className="info-card-content">
                    <div className="info-row">
                      <span className="info-label">Name</span>
                      <span className="info-value">{selectedProduct.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">SKU</span>
                      <span className="info-value">{selectedProduct.sku}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Brand</span>
                      <span className="info-value">{selectedProduct.brand || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="info-card business-card">
                  <div className="info-card-header">
                    <div className="info-card-icon">💰</div>
                    <h6 className="info-card-title">Pricing</h6>
                  </div>
                  <div className="info-card-content">
                    <div className="info-row">
                      <span className="info-label">Price</span>
                      <span className="info-value">{formatCurrency(selectedProduct.price)}</span>
                    </div>
                    {selectedProduct.comparePrice && (
                      <div className="info-row">
                        <span className="info-label">Compare At</span>
                        <span className="info-value">{formatCurrency(selectedProduct.comparePrice)}</span>
                      </div>
                    )}
                    <div className="info-row">
                      <span className="info-label">Stock</span>
                      <span className="info-value">
                        <Badge bg={
                          selectedProduct.stock === 0 ? 'danger' : 
                          selectedProduct.stock <= 10 ? 'warning' : 
                          'success'
                        }>
                          {selectedProduct.stock} units
                        </Badge>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="info-card location-card">
                  <div className="info-card-header">
                    <div className="info-card-icon">🏷️</div>
                    <h6 className="info-card-title">Category</h6>
                  </div>
                  <div className="info-card-content">
                    <div className="info-row">
                      <span className="info-label">Category</span>
                      <span className="info-value">{getCategoryName(selectedProduct.category)}</span>
                    </div>
                    {selectedProduct.subCategory && (
                      <div className="info-row">
                        <span className="info-label">Subcategory</span>
                        <span className="info-value">
                          {getSubcategoryName(selectedProduct.category, selectedProduct.subCategory)}
                        </span>
                      </div>
                    )}
                    <div className="info-row">
                      <span className="info-label">Status</span>
                      <span className="info-value">
                        <Badge bg={selectedProduct.isActive ? 'success' : 'secondary'}>
                          {selectedProduct.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedProduct.description && (
                <div className="description-card">
                  <h6>📝 Description</h6>
                  <p>{selectedProduct.description}</p>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProducts;