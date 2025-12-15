import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import {
  FaSearch,
  FaChevronRight,
  FaBox,
  FaCreditCard,
  FaTruck,
  FaExchangeAlt,
  FaGift,
  FaShieldAlt,
  FaQuestionCircle,
  FaPhone,
  FaEnvelope,
  FaComments,
} from "react-icons/fa";

const helpData = {
  orderIssues: {
    title: "Order Issues",
    icon: <FaBox size={28} className="text-primary" />,
    items: [
      "Track your order",
      "Cancel order",
      "Return or exchange items",
      "Manage order",
      "Edit shipping address",
    ],
  },
  paymentRefund: {
    title: "Payment & Refund",
    icon: <FaCreditCard size={28} className="text-success" />,
    items: [
      "Payment options",
      "Failed transaction",
      "Refund status",
      "Gift card balance",
      "EMI options",
    ],
  },
  shipping: {
    title: "Shipping & Delivery",
    icon: <FaTruck size={28} className="text-warning" />,
    items: [
      "Delivery time & charges",
      "Track shipment",
      "Change delivery address",
      "Delivery related queries",
    ],
  },
  returns: {
    title: "Returns & Exchanges",
    icon: <FaExchangeAlt size={28} className="text-info" />,
    items: [
      "Return policy",
      "Initiate return",
      "Exchange product",
      "Return pickup status",
      "Refund timeline",
    ],
  },
  offers: {
    title: "Offers & Rewards",
    icon: <FaGift size={28} className="text-danger" />,
    items: [
      "Current offers",
      "Coupon codes",
      "SuperCoin balance",
      "Cashback offers",
    ],
  },
  account: {
    title: "Account & Security",
    icon: <FaShieldAlt size={28} className="text-secondary" />,
    items: [
      "Login issues",
      "Change password",
      "Update profile",
      "Deactivate account",
      "Privacy settings",
    ],
  },
};

const faqs = [
  "What is the delivery time?",
  "How do I cancel my order?",
  "How to return a product?",
  "Payment options available",
  "How to track my order?",
  "Refund policy details",
];

const HelpCenter = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ---------------- CATEGORY PAGE ----------------
  if (selectedCategory) {
    const category = helpData[selectedCategory];

    return (
      <div className="min-vh-100" style={{ backgroundColor: "#f1f3f6" }}>
        {/* Header */}
        <div className="bg-primary text-white py-4">
          <Container>
            <Button
              variant="link"
              className="text-white text-decoration-none mb-3 p-0"
              onClick={() => setSelectedCategory(null)}
            >
              ← Back to Help Center
            </Button>
            <h1 className="h2 fw-bold mb-0">e-Help Center</h1>
          </Container>
        </div>

        <Container className="py-4">
          <Card className="shadow-sm mb-4">
            <Card.Body className="p-4 text-dark">
              <div className="d-flex align-items-center gap-3 mb-3">
                {category.icon}
                <h2 className="h3 fw-bold mb-0 text-dark">
                  {category.title}
                </h2>
              </div>
              <p className="text-muted mb-4">Select a topic to get help</p>

              <div className="d-grid gap-3">
                {category.items.map((item, idx) => (
                  <Card
                    key={idx}
                    className="border hover-shadow"
                    style={{ cursor: "pointer" }}
                  >
                    <Card.Body className="d-flex justify-content-between align-items-center py-3 text-dark">
                      <span className="fw-medium text-dark">{item}</span>
                      <FaChevronRight className="text-muted" />
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Contact */}
          <Card className="shadow-sm">
            <Card.Body className="p-4 text-dark">
              <h3 className="h5 fw-bold mb-4 text-dark">
                Still need help?
              </h3>
              <Row className="g-3">
                <Col md={4}>
                  <Card className="text-center h-100 hover-shadow">
                    <Card.Body className="text-dark">
                      <FaPhone size={24} className="text-primary mb-2" />
                      <h6 className="fw-bold">Call Us</h6>
                      <p className="text-muted small">24×7 Support</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center h-100 hover-shadow">
                    <Card.Body className="text-dark">
                      <FaComments size={24} className="text-primary mb-2" />
                      <h6 className="fw-bold">Chat</h6>
                      <p className="text-muted small">Live Chat Support</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center h-100 hover-shadow">
                    <Card.Body className="text-dark">
                      <FaEnvelope size={24} className="text-primary mb-2" />
                      <h6 className="fw-bold">Email</h6>
                      <p className="text-muted small">
                        We'll respond soon
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }

  // ---------------- MAIN PAGE ----------------
  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f1f3f6" }}>
      <div className="bg-primary text-white py-5">
        <Container>
          <h1 className="fw-bold mb-4">e-Shop Help Center</h1>
          <InputGroup size="lg">
            <InputGroup.Text className="bg-white border-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              placeholder="What issue are you facing?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0"
            />
          </InputGroup>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="g-4 mb-5">
          {Object.entries(helpData).map(([key, category]) => (
            <Col md={4} key={key}>
              <Card
                className="h-100 shadow-sm hover-shadow"
                onClick={() => setSelectedCategory(key)}
                style={{ cursor: "pointer" }}
              >
                <Card.Body className="text-dark">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex gap-3">
                      {category.icon}
                      <div>
                        <h5 className="fw-bold text-dark">
                          {category.title}
                        </h5>
                        <p className="text-muted small">
                          {category.items[0]}
                        </p>
                      </div>
                    </div>
                    <FaChevronRight className="text-muted" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Card className="shadow-sm">
          <Card.Body className="text-dark">
            <h4 className="fw-bold mb-3 text-dark">FAQs</h4>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="d-flex justify-content-between align-items-center p-3 hover-bg"
                style={{ cursor: "pointer" }}
              >
                <span className="fw-medium text-dark">{faq}</span>
                <FaChevronRight className="text-muted" />
              </div>
            ))}
          </Card.Body>
        </Card>
      </Container>

      <style>{`
        .hover-shadow:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .hover-bg:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default HelpCenter;
