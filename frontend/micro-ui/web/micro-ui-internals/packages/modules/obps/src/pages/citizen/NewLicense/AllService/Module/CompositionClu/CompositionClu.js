import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";

function CompositionClu() {
  const {
    register,
    handleSumit,
    formState: { error },
  } = useForm([
    { Sr: "", Name: "", Mobile: "", Email: "", PAN: "", Aadhar: "" },
  ]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [showhide, setShowhide] = useState("No");
  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };

  const [noofRows, setNoOfRows] = useState(1);

  return (
    <div className="container my-5">
      <div className=" col-12 m-auto">
        <div className="card">
          <Form>
            <h4 className="text-center">
              Composition of urban Area Violation in CLU
            </h4>
            <Row>
              <Col className="col-4">
                <Form.Group controlId="formGridCase">
                  <Form.Label>
                    Name of original land owner{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="number" placeholder="" />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridCase">
                  <Form.Label>
                    Land holding of above{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="text" placeholder="" />
                </Form.Group>
              </Col>
            </Row>
            <br></br>
            <Row>
              <div class="bordere">
                <p>
                  Total land sold in parts{" "}
                  <span style={{ color: "red" }}>*</span>
                </p>
                <div class="table-responsive">
                  <table class="table table-bordered">
                    {/* <caption>List of users</caption> */}

                    <thead>
                      <tr>
                        <th colspan="3">Area of parts in sq. meters</th>
                      </tr>
                      <tr>
                        <th scope="col">Sr.No</th>
                        <th scope="col">Khasra No</th>
                        <th scope="col">Area </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>
                          <Form.Control type="text" placeholder="" />
                        </td>
                        <td>
                          <Form.Control type="text" placeholder="" />
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>
                          <Form.Control type="text" placeholder="" />
                        </td>
                        <td>
                          <Form.Control type="text" placeholder="" />
                        </td>
                      </tr>
                      {[...Array(noofRows)].map((elementInArray, input) => {
                        return (
                          <tr>
                            <th scope="row">3</th>
                            <td>
                              <Form.Control type="text" placeholder="" />
                            </td>
                            <td>
                              <Form.Control type="text" placeholder="" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  style={{ float: "left" }}
                  className="btn btn-primary"
                  onClick={() => setNoOfRows(noofRows + 1)}
                >
                  Add more
                </button>
                <button
                  type="button"
                  style={{ float: "right" }}
                  className="btn btn-danger"
                  onClick={() => setNoOfRows(noofRows - 1)}
                >
                  Delete
                </button>
              </div>
            </Row>
            <br></br>
            <Row>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label>
                    Total Area in Sq. meter{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="number" />
                </Form.Group>
              </Col>
            </Row>
            <div class="form-group">
              <label for="exampleFormControlTextarea1">
                Explain the reason for the violation{" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <textarea
                class="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
              ></textarea>
            </div>
            <div class="bordere">
              <div class="table-responsive">
                <table class="table table-bordered">
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
                        Date of sale deeds.
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <Form.Control type="file" placeholder="" />
                      </td>
                    </tr>

                    <tr>
                      <th scope="row">2</th>
                      <td>
                        Any other.<span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <Form.Control type="file" placeholder="" />
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

export default CompositionClu;
