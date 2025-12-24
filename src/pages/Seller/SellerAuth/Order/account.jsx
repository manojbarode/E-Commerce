import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Form, InputGroup } from "react-bootstrap";
import { FaShieldAlt, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const accountData = {
  title: "Account & Security",
  icon: <FaShieldAlt size={28} className="text-secondary" />,
  items: ["Login issues", "Change password", "Deactivate account"],
};

const Account = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    if (item === "Change password") {
      navigate("/change-password"); // Navigate to ChangePassword page
      return;
    }

    if (item === "Login issues") {
      navigate("/login-issue"); // Navigate to LoginIssue page
      return;
    }

    if (item === "Deactivate account") {
      navigate("/deactivate"); // Navigate to DeactivateAccount page
      return;
    }

    toast.info(`"${item}" feature coming soon`);
  };

  return (
    <div className="min-vh-100" style={{ background: "#f1f3f6" }}>
      {/* Header Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <h1 className="fw-bold mb-4">{accountData.title}</h1>
          <InputGroup size="lg">
            <InputGroup.Text className="bg-white border-0">
              {accountData.icon}
            </InputGroup.Text>
            <Form.Control
              placeholder="Search account issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0"
            />
          </InputGroup>
        </Container>
      </div>

      {/* Cards Section */}
      <Container className="py-5">
        <Row className="g-4">
          {accountData.items
            .filter((item) =>
              item.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item, idx) => (
              <Col md={6} key={idx}>
                <Card
                  className="shadow-sm h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleItemClick(item)}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="fw-bold">{item}</h5>
                      </div>
                      <FaChevronRight />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    </div>
  );
};

export default Account;
