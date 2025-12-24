import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";

const DeactivateAccount = () => {
  const [showModal, setShowModal] = useState(false);

  const handleDeactivate = () => {
    // Yaha API call ya logic add kar sakte ho
    // alert("Your account has been deactivated!");
    toast.info("Your account has been deactivated");
    setShowModal(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "50px 0",
        background: "#f5f7fa",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} md={8}>
            <Card className="p-4 shadow-sm">
              <div className="text-center">
                <FaExclamationTriangle size={50} color="#ff6b6b" className="mb-3" />
                <h3 className="fw-bold mb-3">Deactivate Account</h3>
                <p className="text-muted">
                  Deactivating your account will hide your profile and remove your access. 
                  You can reactivate anytime by logging in again.
                </p>
                <Button
                  variant="danger"
                  onClick={() => setShowModal(true)}
                  style={{ borderRadius: 12, padding: "10px 30px" }}
                >
                  Deactivate Account
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deactivation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to deactivate your account? This action can be reversed by logging in again.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeactivate}>
            Deactivate
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeactivateAccount;
