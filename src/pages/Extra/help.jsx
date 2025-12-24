import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
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
  FaPhone,
  FaComments,
  FaEnvelope,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const helpData = {
  orderIssues: {
    title: "Order Issues",
    icon: <FaBox size={28} className="text-primary" />,
    route: "/order-issue",
    desc: "Track your order",
  },
  paymentRefund: {
    title: "Payment & Refund",
    icon: <FaCreditCard size={28} className="text-success" />,
    route: "/refund-payment",
    desc: "Payment options",
  },
  shipping: {
    title: "Shipping & Delivery",
    icon: <FaTruck size={28} className="text-warning" />,
    route: "/delivery",
    desc: "Delivery time & charges",
  },
  returns: {
    title: "Returns & Exchanges",
    icon: <FaExchangeAlt size={28} className="text-info" />,
    route: "/return",
    desc: "Return policy",
  },
  offers: {
    title: "Offers & Rewards",
    icon: <FaGift size={28} className="text-danger" />,
    route: "/offer-rewards",
    desc: "Current offers",
  },
  account: {
    title: "Account & Security",
    icon: <FaShieldAlt size={28} className="text-secondary" />,
    route: "/account",
    desc: "Login issues",
  },
};

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <div className="min-vh-100" style={{ background: "#f1f3f6" }}>
      {/* ===== HEADER ===== */}
      <div className="bg-primary text-white py-5">
        <Container>
          <h1 className="fw-bold mb-4">e-Shop Help Center</h1>
          <InputGroup size="lg">
            <InputGroup.Text className="bg-white border-0">
              <FaSearch />
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

      {/* ===== HELP CATEGORIES ===== */}
      <Container className="py-5">
        <Row className="g-4">
          {Object.entries(helpData).map(([key, cat]) => (
            <Col md={4} key={key}>
              <Card
                className="shadow-sm h-100"
                style={{ cursor: "pointer" }}
                onClick={() => handleNavigate(cat.route)}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-3">
                      {cat.icon}
                      <div>
                        <h5 className="fw-bold">{cat.title}</h5>
                        <p className="text-muted small mb-0">{cat.desc}</p>
                      </div>
                    </div>
                    <FaChevronRight />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ===== STILL NEED HELP ===== */}
        <Card className="shadow-sm mt-4">
          <Card.Body className="p-4">
            <h3 className="h5 fw-bold mb-4">Still need help?</h3>
            <Row className="g-3">
              <Col md={4}>
                <Card className="text-center h-100">
                  <Card.Body>
                    <FaPhone size={24} className="text-primary mb-2" />
                    <h6 className="fw-bold">Call Us</h6>
                    <p className="text-muted small">24×7 Support</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className="text-center h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/chat")}
                >
                  <Card.Body>
                    <FaComments size={24} className="text-primary mb-2" />
                    <h6 className="fw-bold">Chat</h6>
                    <p className="text-muted small">Live Chat Support</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className="text-center h-100">
                  <Card.Body>
                    <FaEnvelope size={24} className="text-primary mb-2" />
                    <h6 className="fw-bold">Email</h6>
                    <p className="text-muted small">We'll respond soon</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Help;
