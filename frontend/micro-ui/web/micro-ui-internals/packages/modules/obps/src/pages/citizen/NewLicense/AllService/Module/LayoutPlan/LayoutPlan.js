import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function LayoutPlan() {
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
            <h4 className="text-center">
              APPROVAL OF REVISED LAYOUT PLAN OF LICENSE
            </h4>
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
                    Existing Area <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label>
                    Area of which planning is being changed{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <fieldset>
                  <Form.Group as={Row} className="mb-4">
                    <Form.Label>
                      Any other feature
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col className="col-2">
                      <Form.Check
                        type="radio"
                        label="Yes"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios1"
                        value="4"
                      />
                    </Col>
                    <Col className="col-2">
                      <Form.Check
                        type="radio"
                        label="No"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios2"
                      />
                    </Col>
                  </Form.Group>
                </fieldset>
                
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
            </Form>
            </div>
      </div>
   
            
      <div className=" col-12 m-auto">
        <div className="card">
            <div class="bordere">
              <div class="table-responsive">
                <table class="table">
                  
                  <thead>
                    <tr>
                      <th scope="col">Sr.No</th>
                      <th scope="col">Field Name</th>
                      <th scope="col">Upload Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">1</th>
                      <td>
                        Reasons for revision in the layout plan{" "}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file"></input>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>
                        {" "}
                        Copy of earlier approved layout plan{" "}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file"></input>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">3</th>
                      <td>
                        {" "}
                        Any Other <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file"></input>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

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
          
        </div>
      </div>
    </div>
  );
}

export default LayoutPlan;
