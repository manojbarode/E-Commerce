// Products.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Badge, Button, Form, Spinner, Modal, InputGroup } from 'react-bootstrap';
import { productsAPI, categoriesAPI } from './apiService';

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState({ 
    search: '',
    category: '',
    status: '',
    minPrice: '',
    maxPrice: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    subCategory: '',
    stock: '',
    sku: '',
    brand: '',
    images: [],
    isActive: true
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll(currentPage, 20, filters);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalProducts(data.totalProducts || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', status: '', minPrice: '', maxPrice: '' });
    setCurrentPage(1);
    fetchProducts();
  };

  const handleAddProduct = () => {
    setEditMode(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      comparePrice: '',
      category: '',
      subCategory: '',
      stock: '',
      sku: '',
      brand: '',
      images: [],
      isActive: true
    });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditMode(true);
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      comparePrice: product.comparePrice || '',
      category: product.category || '',
      subCategory: product.subCategory || '',
      stock: product.stock || '',
      sku: product.sku || '',
      brand: product.brand || '',
      images: product.images || [],
      isActive: product.isActive !== undefined ? product.isActive : true
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await productsAPI.update(selectedProduct._id, formData);
        alert('Product updated successfully!');
      } else {
        await productsAPI.create(formData);
        alert('Product created successfully!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await productsAPI.delete(productId);
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || 0}`;
  };

  if (loading && currentPage === 1) {
    return (
      <div className="dashboard-content">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p>Loading Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="page-header">
        <h4>🛍️ Products Management</h4>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={fetchProducts}>
            🔄 Refresh
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            ➕ Add New Product
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
                  placeholder="Product name, SKU..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </InputGroup>
            </Col>
            
            <Col md={2}>
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat._id}>{cat.name}</option>
                ))}
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
                <option value="out-of-stock">Out of Stock</option>
              </Form.Select>
            </Col>

            <Col md={2}>
              <Form.Label>Min Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="₹ 0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </Col>

            <Col md={2}>
              <Form.Label>Max Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="₹ 10000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </Col>

            <Col md={1} className="d-flex align-items-end">
              <Button variant="primary" onClick={applyFilters} className="w-100">
                Apply
              </Button>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Button variant="link" size="sm" onClick={clearFilters}>
                Clear All Filters
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
              <small className="text-muted">Total Products</small>
              <h5 className="mb-0">{totalProducts}</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Active Products</small>
              <h5 className="mb-0 text-success">
                {products.filter(p => p.isActive).length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Out of Stock</small>
              <h5 className="mb-0 text-danger">
                {products.filter(p => p.stock === 0).length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Low Stock</small>
              <h5 className="mb-0 text-warning">
                {products.filter(p => p.stock > 0 && p.stock <= 10).length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Products Table */}
      <Card className="table-card">
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="modern-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
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
                      <Spinner animation="border" size="sm" /> Loading...
                    </td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((product, index) => (
                    <tr key={index}>
                      <td>
                        <img 
                          src={product.images?.[0] || 'https://via.placeholder.com/50'} 
                          alt={product.name} 
                          style={{ 
                            width: '50px', 
                            height: '50px', 
                            objectFit: 'cover', 
                            borderRadius: '8px' 
                          }} 
                        />
                      </td>
                      <td>
                        <div>
                          <strong>{product.name}</strong>
                          <br />
                          <small className="text-muted">{product.brand}</small>
                        </div>
                      </td>
                      <td><code>{product.sku}</code></td>
                      <td>{product.categoryName || product.category}</td>
                      <td>
                        <div>
                          <strong>{formatCurrency(product.price)}</strong>
                          {product.comparePrice && (
                            <div>
                              <small className="text-muted text-decoration-line-through">
                                {formatCurrency(product.comparePrice)}
                              </small>
                            </div>
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
                        <div className="d-flex gap-1">
                          <Button 
                            variant="link" 
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            ✏️
                          </Button>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="text-danger"
                            onClick={() => handleDeleteProduct(product._id, product.name)}
                          >
                            🗑️
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      No products found
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

      {/* Add/Edit Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? '✏️ Edit Product' : '➕ Add New Product'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Price *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Compare Price</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      type="number"
                      placeholder="0.00"
                      value={formData.comparePrice}
                      onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat._id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter brand name"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>SKU *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., PRD-001"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Stock Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Active Product"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editMode ? 'Update Product' : 'Add Product'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;