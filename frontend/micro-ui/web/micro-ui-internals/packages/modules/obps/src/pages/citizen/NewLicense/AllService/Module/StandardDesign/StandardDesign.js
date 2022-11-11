import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function Standard() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };

  return (
    <div className="container my-5">
      <div className=" col-12 m-auto">
        <div className="card">
          <Form>
            <h4 className="text-center">Approval of Standard Design</h4>
            <Row>
              <Col className="col-4">
                <Form.Group controlId="formGridCase">
                  <Form.Label>
                    License No . <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="number" placeholder="Enter License No" />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label>
                    Plan <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label>
                    Any other Document <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label>
                    Amount <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="text" required={true} disabled={true} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Button
                  variant="success"
                  className="col my-4"
                  type="submit"
                  aria-label="right-end"
                >
                  Pay
                </Button>
              </Col>
            </Row>

            <Row className="justify-content-end">
              <Button
                variant="outline-primary"
                className="col-md-2 my-2 mx-2"
                type="submit"
                aria-label="right-end"
              >
                Save as Draft
              </Button>
              <Button
                variant="outline-primary"
                className="col-md-2 my-2 mx-2"
                type="submit"
                aria-label="right-end"
              >
                Submit
              </Button>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Standard;
