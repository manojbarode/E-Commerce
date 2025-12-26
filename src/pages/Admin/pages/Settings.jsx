// ==================== SUB-CATEGORIES PAGE ====================
// SubCategories.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Badge, Button, Form, Spinner, Modal } from 'react-bootstrap';
import { subCategoriesAPI, categoriesAPI } from './apiService';

export const SubCategories = () => {
  const [loading, setLoading] = useState(true);
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    slug: '',
    image: '',
    isActive: true
  });

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, [filterCategory]);

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const data = await subCategoriesAPI.getAll(filterCategory);
      setSubCategories(data || []);
    } catch (error) {
      console.error('Error fetching sub-categories:', error);
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

  const handleAdd = () => {
    setEditMode(false);
    setFormData({ name: '', description: '', categoryId: '', slug: '', image: '', isActive: true });
    setShowModal(true);
  };

  const handleEdit = (subCat) => {
    setEditMode(true);
    setSelectedSubCategory(subCat);
    setFormData({
      name: subCat.name || '',
      description: subCat.description || '',
      categoryId: subCat.categoryId || '',
      slug: subCat.slug || '',
      image: subCat.image || '',
      isActive: subCat.isActive !== undefined ? subCat.isActive : true
    });
    setShowModal(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await subCategoriesAPI.update(selectedSubCategory._id, formData);
        alert('Sub-category updated!');
      } else {
        await subCategoriesAPI.create(formData);
        alert('Sub-category created!');
      }
      setShowModal(false);
      fetchSubCategories();
    } catch (error) {
      alert('Failed to save sub-category.');
    }
  };

  const handleDelete = async (subCatId, name) => {
    if (window.confirm(`Delete sub-category "${name}"?`)) {
      try {
        await subCategoriesAPI.delete(subCatId);
        alert('Sub-category deleted!');
        fetchSubCategories();
      } catch (error) {
        alert('Failed to delete sub-category.');
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p>Loading Sub-Categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h4>📑 Sub-Categories Management</h4>
        <Button variant="primary" onClick={handleAdd}>➕ Add New Sub-Category</Button>
      </div>

      <Card className="filter-card mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Label>Filter by Category</Form.Label>
              <Form.Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat._id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Total Sub-Categories</small>
              <h5 className="mb-0">{subCategories.length}</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Active</small>
              <h5 className="mb-0 text-success">{subCategories.filter(s => s.isActive).length}</h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small className="text-muted">Inactive</small>
              <h5 className="mb-0 text-secondary">{subCategories.filter(s => !s.isActive).length}</h5>
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
                  <th>Image</th>
                  <th>Sub-Category Name</th>
                  <th>Parent Category</th>
                  <th>Slug</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subCategories.length > 0 ? (
                  subCategories.map((subCat, idx) => (
                    <tr key={idx}>
                      <td>
                        <img src={subCat.image || 'https://via.placeholder.com/50'} alt={subCat.name}
                             style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px'}} />
                      </td>
                      <td>
                        <strong>{subCat.name}</strong>
                        {subCat.description && (
                          <>
                            <br />
                            <small className="text-muted">{subCat.description}</small>
                          </>
                        )}
                      </td>
                      <td>{subCat.categoryName || 'N/A'}</td>
                      <td><code>{subCat.slug}</code></td>
                      <td><Badge bg="info">{subCat.productCount || 0} products</Badge></td>
                      <td>
                        <Badge bg={subCat.isActive ? 'success' : 'secondary'}>
                          {subCat.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button variant="link" size="sm" onClick={() => handleEdit(subCat)}>✏️ Edit</Button>
                          <Button variant="link" size="sm" className="text-danger" 
                                  onClick={() => handleDelete(subCat._id, subCat.name)}>🗑️ Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">No sub-categories found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? '✏️ Edit Sub-Category' : '➕ Add Sub-Category'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Sub-Category Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Parent Category *</Form.Label>
              <Form.Select
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat._id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Slug *</Form.Label>
              <Form.Control
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Active"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">
              {editMode ? 'Update' : 'Add'} Sub-Category
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};


// ==================== SETTINGS PAGE ====================
// Settings.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Form, Spinner, Tab, Tabs } from 'react-bootstrap';
import { settingsAPI } from './apiService';

export const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: '',
    siteEmail: '',
    sitePhone: '',
    siteAddress: '',
    siteLogo: '',
    currency: 'INR',
    taxRate: '',
    shippingFee: '',
    freeShippingThreshold: '',
    enableCOD: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    maintenanceMode: false
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsAPI.getAll();
      setSettings(data || settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsAPI.update(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p>Loading Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h4>⚙️ Settings</h4>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save Settings'}
        </Button>
      </div>

      <Card>
        <Card.Body>
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
            <Tab eventKey="general" title="🏪 General">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Site Name *</Form.Label>
                    <Form.Control
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleChange('siteName', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Site Email *</Form.Label>
                    <Form.Control
                      type="email"
                      value={settings.siteEmail}
                      onChange={(e) => handleChange('siteEmail', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Site Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={settings.sitePhone}
                      onChange={(e) => handleChange('sitePhone', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Currency</Form.Label>
                    <Form.Select
                      value={settings.currency}
                      onChange={(e) => handleChange('currency', e.target.value)}
                    >
                      <option value="INR">₹ INR (Indian Rupee)</option>
                      <option value="USD">$ USD (US Dollar)</option>
                      <option value="EUR">€ EUR (Euro)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Site Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={settings.siteAddress}
                      onChange={(e) => handleChange('siteAddress', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Site Logo URL</Form.Label>
                    <Form.Control
                      type="text"
                      value={settings.siteLogo}
                      onChange={(e) => handleChange('siteLogo', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="payment" title="💳 Payment & Shipping">
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Tax Rate (%)</Form.Label>
                    <Form.Control
                      type="number"
                      value={settings.taxRate}
                      onChange={(e) => handleChange('taxRate', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Default Shipping Fee (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      value={settings.shippingFee}
                      onChange={(e) => handleChange('shippingFee', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Free Shipping Above (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => handleChange('freeShippingThreshold', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      label="Enable Cash on Delivery (COD)"
                      checked={settings.enableCOD}
                      onChange={(e) => handleChange('enableCOD', e.target.checked)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="notifications" title="🔔 Notifications">
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      label="Enable Email Notifications"
                      checked={settings.enableEmailNotifications}
                      onChange={(e) => handleChange('enableEmailNotifications', e.target.checked)}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      label="Enable SMS Notifications"
                      checked={settings.enableSMSNotifications}
                      onChange={(e) => handleChange('enableSMSNotifications', e.target.checked)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="advanced" title="🔧 Advanced">
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      label="Maintenance Mode (Site will be unavailable to customers)"
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};