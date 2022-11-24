import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import Collapse from "react-bootstrap/Collapse";

function CompositionClu() {
  const {
    register,
    handleSubmit,
    formState: { error },
  } = useForm([{ Sr: "", Name: "", Mobile: "", Email: "", PAN: "", Aadhar: "" }]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [showhide, setShowhide] = useState("No");
  const [open2, setOpen2] = useState(false);
  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };

  const compositionClu = (data) => console.log(data);
  const [noofRows, setNoOfRows] = useState(1);

  return (
    <form onSubmit={handleSubmit(compositionClu)}>
          <div
        className="collapse-header"
        onClick={() => setOpen2(!open2)}
        aria-controls="example-collapse-text"
        aria-expanded={open2}
        style={{
          background: "#f1f1f1",
          padding: "0.25rem 1.25rem",
          borderRadius: "0.25rem",
          fontWeight: "600",
          display: "flex",
          cursor: "pointer",
          color: "#817f7f",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <span style={{ color: "#817f7f" }} className="">
        Composition of urban Area Violation in CLU
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Composition of urban Area Violation in CLU</h4>
        <div className="card">
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
                <h2>
                  <b> Total land sold in parts</b>{" "}
                </h2>{" "}
              </p>
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th colSpan="3" className="fw-normal" style={{ textAlign: "center" }}>
                      {" "}
                      Area of parts in sq. meters
                    </th>
                  </tr>
                  <tr>
                    <th className="fw-normal">Sr.No</th>
                    <th className="fw-normal">Khasra No</th>
                    <th className="fw-normal">Area </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="fw-normal">1</th>
                    <td>
                      <input type="text" placeholder="" className="form-control" {...register("areaParts")} />
                    </td>
                    <td>
                      <input type="text" placeholder="" className="form-control" {...register("srNo")} />
                    </td>
                  </tr>
                  <tr>
                    <th className="fw-normal">2</th>
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
                        <th className="fw-normal">{input + 1}</th>
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

            <Col className="col-4">
              <Form.Group controlId="formGridState">
                <Form.Label>
                  <h2> Explain the reason for the violation</h2>{" "}
                </Form.Label>
                <input type="number" className="form-control" placeholder="" rows="3" {...register("violationReason")} />
              </Form.Group>
            </Col>
          </Row>
          <br></br>
          <div className="table table-bordered table-responsive">
            <thead>
              <tr>
                <th className="fw-normal">Sr.No</th>
                <th className="fw-normal">Field Name</th>
                <th className="fw-normal">Upload Documents</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="fw-normal">1</th>
                <td>Date of sale deeds.</td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("dateOfSaleDeed")} />
                </td>
              </tr>

              <tr>
                <th className="fw-normal">2</th>
                <td>
                  Any other.<span style={{ color: "red" }}>*</span>
                </td>
                <td>
                  <input type="file" className="form-control" placeholder="" {...register("anyOther")} />
                </td>
              </tr>
            </tbody>
          </div>

          <div class="row">
            <div class="col-sm-12 text-right">
              <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                Submit
              </button>
            </div>
            <div class="col-sm-12 text-right">
              <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </Card>
      </div>
      </Collapse>
    </form>
  );
}

export default CompositionClu;
