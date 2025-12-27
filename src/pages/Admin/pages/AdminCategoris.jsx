// src/components/Categories.jsx
import React, { useState, useEffect } from "react";
import {Row,Col,Card,Table,Badge,Button,Form,Spinner,Modal,} from "react-bootstrap";
import { addCategory, deleteCategory, getCategories, updateCategory } from "../../../api/categoriesApi";

const Categories = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    image: "",
    isActive: true,
    sortOrder: 0,
  });

  // ---------------- Fetch Categories ----------------
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error("Fetch categories error:", err);
      alert("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---------------- Add ----------------
  const handleAddCategory = () => {
    setEditMode(false);
    setSelectedCategory(null);
    setFormData({
      name: "",
      description: "",
      slug: "",
      image: "",
      isActive: true,
      sortOrder: 0,
    });
    setShowModal(true);
  };

  // ---------------- Edit ----------------
  const handleEditCategory = (category) => {
    setEditMode(true);
    setSelectedCategory(category);

    setFormData({
      name: category.name || "",
      description: category.description || "",
      slug: category.slug || "",
      image: category.image || "",
      isActive:
        category.isActive !== undefined ? category.isActive : true,
      sortOrder: category.sortOrder || 0,
    });

    setShowModal(true);
  };

  // ---------------- Save (Add / Update) ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        await updateCategory(selectedCategory.id, formData.name);
        alert("Category updated successfully!");
      } else {
        await addCategory(formData.name);
        alert("Category created successfully!");
      }

      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error("Save category error:", err);
      alert("Failed to save category");
    }
  };

  // ---------------- Delete ----------------
  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete "${name}" ?`)) return;

    try {
      await deleteCategory(id);
      alert("Category deleted!");
      fetchCategories();
    } catch (err) {
      console.error("Delete category error:", err);
      alert("Failed to delete category");
    }
  };

  // ---------------- Input ----------------
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  // ---------------- Loading ----------------
  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading-container text-center py-5">
          <Spinner animation="border" />
          <p className="mt-2">Loading Categories...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="dashboard-content">
      {/* Header */}
      <div className="page-header d-flex justify-content-between align-items-center mb-3">
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

      {/* Stats */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small>Total Categories</small>
              <h5>{categories.length}</h5>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small>Active</small>
              <h5 className="text-success">
                {categories.filter((c) => c.isActive !== false).length}
              </h5>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mini-stat-card">
            <Card.Body>
              <small>Inactive</small>
              <h5 className="text-secondary">
                {categories.filter((c) => c.isActive === false).length}
              </h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat.id}>
                      <td>
                        <img
                          src={
                            cat.image ||
                            "https://via.placeholder.com/50"
                          }
                          alt={cat.name}
                          width={50}
                          height={50}
                          style={{ borderRadius: 8 }}
                        />
                      </td>

                      <td>
                        <strong>{cat.name}</strong>
                        {cat.description && (
                          <div className="small text-muted">
                            {cat.description}
                          </div>
                        )}
                      </td>

                      <td>
                        <code>{cat.slug}</code>
                      </td>

                      <td>
                        <Badge
                          bg={
                            cat.isActive === false
                              ? "secondary"
                              : "success"
                          }
                        >
                          {cat.isActive === false
                            ? "Inactive"
                            : "Active"}
                        </Badge>
                      </td>

                      <td>
                        <Button
                          size="sm"
                          variant="link"
                          onClick={() => handleEditCategory(cat)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="link"
                          className="text-danger"
                          onClick={() =>
                            handleDeleteCategory(cat.id, cat.name)
                          }
                        >
                          🗑️ Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "✏️ Edit Category" : "➕ Add Category"}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Category Name *</Form.Label>
              <Form.Control
                value={formData.name}
                onChange={(e) =>
                  handleInputChange("name", e.target.value)
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                value={formData.slug}
                onChange={(e) =>
                  handleInputChange("slug", e.target.value)
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange(
                    "description",
                    e.target.value
                  )
                }
              />
            </Form.Group>

            <Form.Check
              label="Active"
              checked={formData.isActive}
              onChange={(e) =>
                handleInputChange("isActive", e.target.checked)
              }
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editMode ? "Update" : "Add"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
