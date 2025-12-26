// Categories.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Badge, Button, Form, Spinner, Modal } from 'react-bootstrap';
import { categoriesAPI } from './apiService';

const Categories = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    image: '',
    isActive: true,
    sortOrder: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditMode(false);
    setFormData({
      name: '',
      description: '',
      slug: '',
      image: '',
      isActive: true,
      sortOrder: 0
    });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditMode(true);
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      slug: category.slug || '',
      image: category.image || '',
      isActive: category.isActive !== undefined ? category.isActive : true,
      sortOrder: category.sortOrder || 0
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await categoriesAPI.update(selectedCategory._id, formData);
        alert('Category updated successfully!');
      } else {
        await categoriesAPI.create(formData);
        alert('Category created successfully!');
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category.');
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      try {
        await categoriesAPI.delete(categoryId);
        alert('Category deleted successfully!');
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category.');
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p>Loading Categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="page-header">
        <h4>📂 Categories Management</h4>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={fetchCategories}>
            🔄 Refresh
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            ➕ Add New Category
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Total Categories</small>
              <h5 className="mb-0">{categories.length}</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Active Categories</small>
              <h5 className="mb-0 text-success">
                {categories.filter(c => c.isActive).length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Inactive Categories</small>
              <h5 className="mb-0 text-secondary">
                {categories.filter(c => !c.isActive).length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Categories Table */}
      <Card className="table-card">
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="modern-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Products Count</th>
                  <th>Status</th>
                  <th>Sort Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <tr key={index}>
                      <td>
                        <img 
                          src={category.image || 'https://via.placeholder.com/50'} 
                          alt={category.name} 
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
                          <strong>{category.name}</strong>
                          {category.description && (
                            <>
                              <br />
                              <small className="text-muted">{category.description}</small>
                            </>
                          )}
                        </div>
                      </td>
                      <td><code>{category.slug}</code></td>
                      <td>
                        <Badge bg="info">{category.productCount || 0} products</Badge>
                      </td>
                      <td>
                        <Badge bg={category.isActive ? 'success' : 'secondary'}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>{category.sortOrder || 0}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button 
                            variant="link" 
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                          >
                            ✏️ Edit
                          </Button>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="text-danger"
                            onClick={() => handleDeleteCategory(category._id, category.name)}
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      No categories found. Click "Add New Category" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Add/Edit Category Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? '✏️ Edit Category' : '➕ Add New Category'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Category Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Slug *</Form.Label>
              <Form.Control
                type="text"
                placeholder="category-slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                URL-friendly version of the name (auto-generated)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter category description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sort Order</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                value={formData.sortOrder}
                onChange={(e) => handleInputChange('sortOrder', e.target.value)}
              />
              <Form.Text className="text-muted">
                Lower numbers appear first
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active Category"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editMode ? 'Update Category' : 'Add Category'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;