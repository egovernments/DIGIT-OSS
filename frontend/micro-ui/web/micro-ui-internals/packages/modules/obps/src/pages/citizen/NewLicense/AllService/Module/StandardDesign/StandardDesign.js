import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { Card } from "react-bootstrap";

function Standard() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const { register, handleSubmit } = useForm();
  const standardDesign = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(standardDesign)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Approval of Standard Design</h4>
        <div className="card">
          <Row>
            <Col className="col-4">
              <Form.Group controlId="formGridCase">
                <Form.Label>
                  License No . <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="number" placeholder="" className="form-control" {...register("licenseNo")} />
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group controlId="formGridState">
                <Form.Label>
                  Plan <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="file" placeholder="" className="form-control" {...register("plan")} />
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group controlId="formGridState">
                <Form.Label>
                  Any other Document <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="file" placeholder="" className="form-control" {...register("otherDocument")} />
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Form.Group controlId="formGridState">
                <Form.Label>
                  Amount <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="text" required={true} disabled={true} placeholder="" className="form-control" {...register("amount")} />
              </Form.Group>
            </Col>
            <Col className="col-4">
              <Button variant="success" className="col my-4" type="submit" aria-label="right-end">
                Pay
              </Button>
            </Col>
          </Row>

          <Row className="justify-content-end">
            <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
              Save as Draft
            </Button>
            <Button type="submit" variant="outline-primary" className="col-md-2 my-2 mx-2" aria-label="right-end">
              Submit
            </Button>
          </Row>
        </div>
      </Card>
    </form>
  );
}

export default Standard;
