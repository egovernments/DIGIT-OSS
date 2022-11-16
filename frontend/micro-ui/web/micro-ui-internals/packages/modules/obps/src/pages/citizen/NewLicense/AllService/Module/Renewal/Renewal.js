import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import AddBoxSharpIcon from "@mui/icons-material/AddBoxSharp";
import IndeterminateCheckBoxSharpIcon from "@mui/icons-material/IndeterminateCheckBoxSharp";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

function renewalClu() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({});
  const [showhide, setShowhide] = useState("");
  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const [showhide2, setShowhide2] = useState("");
  const handleshowhide2 = (event) => {
    const getuser = event.target.value;

    setShowhide2(getuser);
  };
  const [showhide3, setShowhide3] = useState("");
  const handleshowhide3 = (event) => {
    const getuser = event.target.value;

    setShowhide3(getuser);
  };
  const renewal = (data) => console.log(data);
  return (
    <form onSubmit={handleSubmit(renewal)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Renewal</h4>
        <div className="card">
          <Row className="col-12">
            <Col className="col-4">
              <Form.Label>
                <h2>
                  License No.<span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="number" className="form-control" placeholder="" {...register("licenseNo")} />
            </Col>
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Valid Upto <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="date" className="form-control" placeholder="" {...register("validUpto")} />
            </Col>
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Renewal For <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <select className="form-control" {...register("selectService")} onChange={(e) => handleshowhide(e)}>
                <option value=" ">----Select value-----</option>
                <option value="1">Year</option>
                <option value="2">Month</option>
              </select>
            </Col>
            {/* <Col className="col-1">
              <div>
                {showhide === "1" && (
                  <div className="col-md-12 form-group">
                    <Form.Label>
                      <h2>Year</h2>
                    </Form.Label>
                    <select className="form-control" {...register("selectService")} onChange={(e) => handleshowhide(e)}>
                      <option value="1">1 Year</option>
                      <option value="2">2 Year</option>
                      <option value="1">3 Year</option>
                      <option value="2">4 Year</option>
                      <option value="1">5 Year</option>
                    </select>
                  </div>
                )}
              </div>
            </Col> */}
            {/* <Col className="col-1">
              <Form.Group as={Col} controlId="formGridArea">
                <div>
                  {showhide === "2" && (
                    <div className="col-md-12 form-group">
                      <Form.Label>
                        <h2>Months</h2>
                      </Form.Label>
                      <input type="number" className="form-control" placeholder="" {...register("areaInAcres")} />
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col> */}
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Name of Colonizer <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("colonizerName")} />
            </Col>
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Type of Colony
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("colonyType")} />
            </Col>
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Area in Acres
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("areaAcres")} />
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Sector No. <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("sectorNo")} />
            </Col>

            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Village
                  <span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("village")} />
            </Col>
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Tehsil
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="number" className="form-control" placeholder="" {...register("tehsil")} />
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  District <span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>
              <input type="email" className="form-control" placeholder="" {...register("district")} />
            </Col>

            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Whether renewal applied within the stipulated period.
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <label htmlFor=" Whether renewal applied within the stipulated period.">
                {" "}
                &nbsp;&nbsp;
                <input {...register("renewalApplied")} type="radio" value="1" id="yes" onChange={(e) => handleshowhide3(e)} /> &nbsp; Yes
              </label>{" "}
              <label htmlFor="Whether renewal applied within the stipulated period.">
                &nbsp;&nbsp;
                <input {...register("renewalApplied")} type="radio" value="2" id="no" onChange={(e) => handleshowhide3(e)} /> &nbsp; No
              </label>
              {showhide3 === "2" && (
                <Col className="col-4">
                  <Form.Label>
                    <h2></h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" />
                </Col>
              )}
            </Col>
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Renewal Amount <span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>
              <input type="email" className="form-control" disabled placeholder="" {...register("renewalAmount")} />
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Form.Label>
              <h2>
                {" "}
                Reason for not completing the project within the initial validity period of the license.
                <span style={{ color: "red" }}>*</span>
              </h2>
            </Form.Label>
            <textarea className="form-control" placeholder="" {...register("completingProject")} rows="3" />
          </Row>
          <br></br>

          <Row className="col-12">
            <Form.Label>
              <h2>
                {" "}
                Reason for not completing the project within the initial validity period of the license.
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                <label htmlFor=" Whether the renewal applied is the first time ? (Yes/No)">
                  {" "}
                  &nbsp;&nbsp;
                  <input {...register("renewalAppliedFirstTime")} type="radio" value="1" id="yes" onChange={(e) => handleshowhide(e)} /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="Whether the renewal applied is the first time ? (Yes/No)">
                  &nbsp;&nbsp;
                  <input {...register("renewalAppliedFirstTime")} type="radio" value="2" id="no" onChange={(e) => handleshowhide(e)} /> &nbsp; No
                </label>
              </h2>
            </Form.Label>
          </Row>
          {showhide === "2" && (
            <div className="card">
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Sr.No
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Condition
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Complaince Done
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Add more/Remove
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" style={{ textAlign: "center" }}>
                      1
                    </th>
                    <td style={{ textAlign: "center" }}>
                      <input type="text" className="form-control" placeholder="" {...register("condition")} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <label htmlFor=" complianceDone">
                        {" "}
                        &nbsp;&nbsp;
                        <input {...register("complianceDone")} type="radio" value="3" id="yes1" onChange={(e) => handleshowhide2(e)} /> &nbsp; Yes
                      </label>{" "}
                      <label htmlFor="complianceDone">
                        &nbsp;&nbsp;
                        <input {...register("complianceDone")} type="radio" value="4" id="no1" onChange={(e) => handleshowhide2(e)} /> &nbsp; No
                      </label>
                      {showhide2 === "3" && (
                        <div>
                          {/* <label>
                            <h2>Compilance</h2>
                          </label> */}
                          <input type="text" className="form-control" placeholder="" />
                          <ArrowCircleUpIcon color="primary" />
                        </div>
                      )}
                    </td>
                    <td className="text-center">
                      <AddBoxSharpIcon color="success" />
                      <IndeterminateCheckBoxSharpIcon color="error" />
                    </td>
                  </tr>
                </tbody>
              </div>
            </div>
          )}

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
    </form>
  );
}

export default renewalClu;
