import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Form, InputGroup, Button } from "react-bootstrap";
import { 
  FaSearch, FaChevronRight, FaBox, FaCreditCard, 
  FaTruck, FaExchangeAlt, FaGift, FaShieldAlt, 
  FaQuestionCircle, FaPhone, FaEnvelope, FaComments 
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
      "Edit shipping address"
    ]
  },
  paymentRefund: {
    title: "Payment & Refund",
    icon: <FaCreditCard size={28} className="text-success" />,
    items: [
      "Payment options",
      "Failed transaction",
      "Refund status",
      "Gift card balance",
      "EMI options"
    ]
  },
  shipping: {
    title: "Shipping & Delivery",
    icon: <FaTruck size={28} className="text-warning" />,
    items: [
      "Delivery time & charges",
      "Track shipment",
      "Change delivery address",
      "Delivery related queries"
    ]
  },
  returns: {
    title: "Returns & Exchanges",
    icon: <FaExchangeAlt size={28} className="text-info" />,
    items: [
      "Return policy",
      "Initiate return",
      "Exchange product",
      "Return pickup status",
      "Refund timeline"
    ]
  },
  offers: {
    title: "Offers & Rewards",
    icon: <FaGift size={28} className="text-danger" />,
    items: [
      "Current offers",
      "Coupon codes",
      "SuperCoin balance",
      "Cashback offers"
    ]
  },
  account: {
    title: "Account & Security",
    icon: <FaShieldAlt size={28} className="text-secondary" />,
    items: [
      "Login issues",
      "Change password",
      "Update profile",
      "Deactivate account",
      "Privacy settings"
    ]
  }
};

const faqs = [
  "What is the delivery time?",
  "How do I cancel my order?",
  "How to return a product?",
  "Payment options available",
  "How to track my order?",
  "Refund policy details"
];

const HelpCenter = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
            <h1 className="h2 fw-bold mb-0">e- Help Center</h1>
          </Container>
        </div>

        {/* Category Page */}
        <Container className="py-4">
          <Card className="shadow-sm mb-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                {category.icon}
                <h2 className="h3 fw-bold mb-0">{category.title}</h2>
              </div>
              <p className="text-muted mb-4">Select a topic to get help</p>
              
              <div className="d-grid gap-3">
                {category.items.map((item, idx) => (
                  <Card 
                    key={idx}
                    className="border hover-shadow"
                    style={{ cursor: "pointer", transition: "all 0.3s" }}
                  >
                    <Card.Body className="d-flex justify-content-between align-items-center py-3">
                      <span className="fw-medium">{item}</span>
                      <FaChevronRight className="text-muted" />
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Contact Options */}
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h3 className="h5 fw-bold mb-4">Still need help?</h3>
              <Row className="g-3">
                <Col md={4}>
                  <Card className="border text-center h-100 hover-shadow" style={{ cursor: "pointer" }}>
                    <Card.Body>
                      <FaPhone className="text-primary mb-2" size={24} />
                      <Card.Title className="h6">Call Us</Card.Title>
                      <Card.Text className="text-muted small">24x7 Support</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border text-center h-100 hover-shadow" style={{ cursor: "pointer" }}>
                    <Card.Body>
                      <FaComments className="text-primary mb-2" size={24} />
                      <Card.Title className="h6">Chat</Card.Title>
                      <Card.Text className="text-muted small">Live Chat Support</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border text-center h-100 hover-shadow" style={{ cursor: "pointer" }}>
                    <Card.Body>
                      <FaEnvelope className="text-primary mb-2" size={24} />
                      <Card.Title className="h6">Email</Card.Title>
                      <Card.Text className="text-muted small">We'll respond soon</Card.Text>
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

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f1f3f6" }}>
      {/* Header */}
      <div className="bg-primary text-white py-4 py-md-5">
        <Container>
          <h1 className="h2 h1-md fw-bold mb-4">e-Shop Help Center</h1>
          
          {/* Search Bar */}
          <InputGroup size="lg">
            <InputGroup.Text className="bg-white border-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="What issue are you facing?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0"
            />
          </InputGroup>
        </Container>
      </div>

      <Container className="py-4 py-md-5">
        {/* Main Categories */}
        <div className="mb-5">
          <h2 className="h3 fw-bold mb-4">What issue are you facing?</h2>
          <Row className="g-3 g-md-4">
            {Object.entries(helpData).map(([key, category]) => (
              <Col key={key} xs={12} sm={6} lg={4}>
                <Card 
                  className="h-100 shadow-sm hover-shadow"
                  style={{ cursor: "pointer", transition: "all 0.3s" }}
                  onClick={() => setSelectedCategory(key)}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex gap-3">
                        <div className="mt-1">{category.icon}</div>
                        <div>
                          <Card.Title className="h5 fw-bold mb-2">
                            {category.title}
                          </Card.Title>
                          <Card.Text className="text-muted small">
                            {category.items[0]}
                          </Card.Text>
                        </div>
                      </div>
                      <FaChevronRight className="text-muted mt-1" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* FAQs */}
        <Card className="shadow-sm mb-4">
          <Card.Body className="p-4">
            <h2 className="h4 fw-bold mb-4">Frequently Asked Questions</h2>
            <div className="d-grid gap-2">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="d-flex justify-content-between align-items-center p-3 rounded hover-bg"
                  style={{ cursor: "pointer", transition: "background 0.3s" }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <FaQuestionCircle className="text-primary" />
                    <span>{faq}</span>
                  </div>
                  <FaChevronRight className="text-muted" />
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Call to Action */}
        <Card className="text-white shadow-sm mb-4" style={{ background: "linear-gradient(135deg, #2874f0 0%, #1e5bc6 100%)" }}>
          <Card.Body className="p-4 p-md-5 text-center">
            <h2 className="h4 fw-bold mb-2">Can't find what you're looking for?</h2>
            <p className="mb-4">Browse all help topics or contact our support team</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button variant="light" size="lg" className="fw-medium">
                Browse All Topics
              </Button>
              <Button 
                variant="dark" 
                size="lg" 
                className="fw-medium"
                style={{ backgroundColor: "#1a4d99" }}
              >
                Contact Support
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>

      <style>{`
        .hover-shadow {
          transition: box-shadow 0.3s ease;
        }
        .hover-shadow:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        .hover-bg:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default HelpCenter;
