import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function ExtensionClu() {
  return (
    <div className="container my-5">
      <div className=" col-12 m-auto">
        <div className="card">
          <Form>
            <h4 className="text-center">Extension of CLU permission</h4>
            <Row className="col-12">
              <Form.Group as={Col} controlId="formGridCase">
                <Form.Label>
                  Case No . <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="number" placeholder="Enter Case No" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Application Number <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="number" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Nature (land Use) Purpose{" "}
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Row>
            <Row className="col-12">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Total Area in Sq. meter{" "}
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="number" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Date Of CLU <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="Date" />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Date of Expiry of CLU <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="Date" />
              </Form.Group>
            </Row>
            <Row className="col-12">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Stage of construction <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Name of applicant <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Mobile <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="number" />
              </Form.Group>
            </Row>
            <Row className="col-12">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Email-Address <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="email" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Address <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Village <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Row>
            <Row className="col-8">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Tehsil <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Pin code <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="number" />
              </Form.Group>
            </Row>

            <div class="form-group">
              Reason for Delay <span style={{ color: "red" }}>*</span>
              <textarea
                class="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
              ></textarea>
            </div>

            <div class="bordere">
              <div class="table-responsive">
                <table class="table">
                  {/* <caption>List of users</caption> */}
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
                        Upload BR-III<span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file"></input>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>
                        {" "}
                        Upload photographs of building under construction
                        showing the status of construction at the site{" "}
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
                        Receipt of application if any submitted for taking
                        occupation certificate{" "}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file"></input>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">4</th>
                      <td>
                        {" "}
                        Upload approved Building Plan{" "}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file"></input>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">5</th>
                      <td>
                        {" "}
                        Indemnity Bond <span style={{ color: "red" }}>*</span>
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
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ExtensionClu;
