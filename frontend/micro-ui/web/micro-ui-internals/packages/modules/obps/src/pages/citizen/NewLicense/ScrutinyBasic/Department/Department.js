import React from "react";
import { Row, Col, Card, Container, Form, Button } from "react-bootstrap";

const windowHeight = window !== undefined ? window.innerHeight : null;
const Department = (props) => {
  return (
    <Container
      className="justify-content-center"
      style={{
        top: windowHeight * 0.3,
        minWidth: "90%",
        maxWidth: "100%",
        maxHeight: "100%",
        minHeight: "40%",
      }}
    >
      <Row>
        <Card>
          <Card.Header>
            <Card.Title style={{ fontFamily: "Roboto", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>Remarks</Card.Title>
          </Card.Header>
          <Card.Body style={{ overflowY: "auto", backgroundColor: "#C6C6C6" }}>
            <Form></Form>
          </Card.Body>
          <Card.Footer></Card.Footer>
        </Card>
      </Row>
    </Container>
  );
};

export default Department;
