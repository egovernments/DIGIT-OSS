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
  } = useForm([{ Sr: "", Name: "", Mobile: "", Email: "", PAN: "", Aadhar: "" }]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [showhide, setShowhide] = useState("No");
  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };

  const compositionClu = (data) => console.log(data);
  const [noofRows, setNoOfRows] = useState(1);

  return (
    <div className="container my-5">
      <div className=" col-12 m-auto">
        <div className="card">
          <form onSubmit={handleSubmit(compositionClu)}>
            <h4 className="text-center">Composition of urban Area Violation in CLU</h4>
            <Row>
              <Col className="col-4">
                <Form.Group controlId="formGridCase">
                  <Form.Label>
                    <h2>Name of original land owner </h2>{" "}
                  </Form.Label>
                  <input type="number" placeholder="" className="form-control" {...register("originalLand")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridCase">
                  <Form.Label>
                    <h2> Land holding of above </h2>{" "}
                  </Form.Label>
                  <input type="text" placeholder="" className="form-control" {...register("landHolding")} />
                </Form.Group>
              </Col>
            </Row>
            <br></br>
            <Row>
              <div class="bordere">
                <p>
                  <h2> Total land sold in parts </h2>{" "}
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
                          <input type="text" placeholder="" className="form-control" {...register("areaParts")} />
                        </td>
                        <td>
                          <input type="text" placeholder="" className="form-control" {...register("srNo")} />
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>
                          <input type="text" placeholder="" className="form-control" {...register("khasraNo")} />
                        </td>
                        <td>
                          <input type="text" placeholder="" className="form-control" {...register("area")} />
                        </td>
                      </tr>
                      {[...Array(noofRows)].map((elementInArray, input) => {
                        return (
                          <tr>
                            <th scope="row">3</th>
                            <td>
                              <input type="text" placeholder="" />
                            </td>
                            <td>
                              <input type="text" placeholder="" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <button type="button" style={{ float: "left" }} className="btn btn-primary" onClick={() => setNoOfRows(noofRows + 1)}>
                  Add more
                </button>
                <button type="button" style={{ float: "right" }} className="btn btn-danger" onClick={() => setNoOfRows(noofRows - 1)}>
                  Delete
                </button>
              </div>
            </Row>
            <br></br>
            <Row>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label>
                    <h2> Total Area in Sq. meter</h2>{" "}
                  </Form.Label>
                  <input type="number" className="form-control" placeholder="" {...register("totalArea")} />
                </Form.Group>
              </Col>
            </Row>
            <Col className="col-4">
              <Form.Group controlId="formGridState">
                <Form.Label>
                  <h2> Explain the reason for the violation</h2>{" "}
                </Form.Label>
                <input type="number" className="form-control" placeholder="" rows="3" {...register("violationReason")} />
              </Form.Group>
            </Col>
            <div class="bordere">
              <div class="table-responsive">
                <table class="table table-bordered">
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
                      <td>Date of sale deeds.</td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("dateOfSaleDeed")} />
                      </td>
                    </tr>

                    <tr>
                      <th scope="row">2</th>
                      <td>
                        Any other.<span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("anyOther")} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <Row className="justify-content-end">
              <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                Save as Draft
              </Button>
              <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                Submit
              </Button>
            </Row>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompositionClu;
