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
  const [showhide4, setShowhide4] = useState("");
  const [showhide5, setShowhide5] = useState("");
  const [showhide6, setShowhide6] = useState("");
  const [showhide7, setShowhide7] = useState("");
  const [showhide8, setShowhide8] = useState("");
  const [showhide9, setShowhide9] = useState("");
  const [showhide10, setShowhide10] = useState("");
  const [showhide11, setShowhide11] = useState("");
  const [showhide12, setShowhide12] = useState("");
  const handleshowhide3 = (event) => {
    const getuser = event.target.value;

    setShowhide3(getuser);
  };
  const handleshowhide4 = (event) => {
    const getuser = event.target.value;

    setShowhide4(getuser);
  };
  const handleshowhide5 = (event) => {
    const getuser = event.target.value;

    setShowhide5(getuser);
  };
  const handleshowhide6 = (event) => {
    const getuser = event.target.value;

    setShowhide6(getuser);
  };
  const handleshowhide7 = (event) => {
    const getuser = event.target.value;

    setShowhide7(getuser);
  };
  const handleshowhide8 = (event) => {
    const getuser = event.target.value;

    setShowhide8(getuser);
  };
  const handleshowhide9 = (event) => {
    const getuser = event.target.value;

    setShowhide9(getuser);
  };
  const handleshowhide10 = (event) => {
    const getuser = event.target.value;

    setShowhide10(getuser);
  };
  const handleshowhide11 = (event) => {
    const getuser = event.target.value;

    setShowhide11(getuser);
  };
  const handleshowhide12 = (event) => {
    const getuser = event.target.value;

    setShowhide12(getuser);
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
                <Col className="col-12">
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
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Whether the colonizer has obtained approval/NOC from the competent authority in pursuance of MOEF notified dated 14.09.2006 before
                  stating the development works.
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <label htmlFor=" colonizer">
                {" "}
                &nbsp;&nbsp;
                <input {...register("colonizer")} type="radio" value="1" id="yes" onChange={(e) => handleshowhide4(e)} /> &nbsp; Yes
              </label>{" "}
              <label htmlFor="colonizer">
                &nbsp;&nbsp;
                <input {...register("colonizer")} type="radio" value="2" id="no" onChange={(e) => handleshowhide4(e)} /> &nbsp; No
              </label>
              {showhide4 === "1" && (
                <Col className="col-12">
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
                  Whether the colonizer has conveyed the ultimate power load requiremet of the project to the power utility within two months from the
                  date of grant of license.
                  <span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>
              <label htmlFor=" colonizerUltimatePower">
                {" "}
                &nbsp;&nbsp;
                <input {...register("colonizerUltimatePower")} type="radio" value="1" id="yes" onChange={(e) => handleshowhide5(e)} /> &nbsp; Yes
              </label>{" "}
              <label htmlFor="colonizerUltimatePower">
                &nbsp;&nbsp;
                <input {...register("colonizerUltimatePower")} type="radio" value="2" id="no" onChange={(e) => handleshowhide5(e)} /> &nbsp; No
              </label>
              {showhide5 === "1" && (
                <Col className="col-12">
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
                  Whether colonizer has transferred portion of sector/master plans roads forming part of the licensed area free of cost to the Govt.
                  of not in compilance of condition of license.
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <label htmlFor=" transferredPortion">
                {" "}
                &nbsp;&nbsp;
                <input {...register("transferredPortion")} type="radio" value="1" id="yes" onChange={(e) => handleshowhide6(e)} /> &nbsp; Yes
              </label>{" "}
              <label htmlFor="transferredPortion">
                &nbsp;&nbsp;
                <input {...register("transferredPortion")} type="radio" value="2" id="no" onChange={(e) => handleshowhide6(e)} /> &nbsp; No
              </label>
              {showhide6 === "1" && (
                <Col className="col-12">
                  <Form.Label>
                    <h2></h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" />
                </Col>
              )}
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Compilance with special conditions, if imposed in the license and agrrements.
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <label htmlFor=" compilanceLicense">
                {" "}
                &nbsp;&nbsp;
                <input {...register("compilanceLicense")} type="radio" value="1" id="yes" onChange={(e) => handleshowhide7(e)} /> &nbsp; Yes
              </label>{" "}
              <label htmlFor="compilanceLicense">
                &nbsp;&nbsp;
                <input {...register("compilanceLicense")} type="radio" value="2" id="no" onChange={(e) => handleshowhide7(e)} /> &nbsp; No
              </label>
              {showhide7 === "1" && (
                <Col className="col-12">
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
                  Complaints/court cases pending if any.
                  <span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>
              <label htmlFor=" courtCases">
                {" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input {...register("courtCases")} type="radio" value="1" id="yes" onChange={(e) => handleshowhide9(e)} /> &nbsp; Yes
              </label>{" "}
              <label htmlFor="courtCases">
                &nbsp;&nbsp;
                <input {...register("courtCases")} type="radio" value="2" id="no" onChange={(e) => handleshowhide9(e)} /> &nbsp; No
              </label>
              {showhide9 === "1" && (
                <Col className="col-12">
                  <Form.Label>
                    <h2></h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" />
                </Col>
              )}
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
              <Form.Label>
                <h2 style={{ marginleft: "20px" }}>
                  {" "}
                  EDC
                  <span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>
              <br></br>
              <label htmlFor=" edc">
                {" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input {...register("edc")} type="radio" value="1" id="yes" onChange={(e) => handleshowhide10(e)} /> &nbsp; Fully Paid
              </label>{" "}
              <label htmlFor="edc">
                &nbsp;&nbsp;
                <input {...register("edc")} type="radio" value="2" id="no" onChange={(e) => handleshowhide10(e)} /> &nbsp; Outstanting
              </label>
            </Col>
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  SIDC
                  <span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>{" "}
              <br></br>
              <label htmlFor=" sidc">
                {" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input {...register("sidc")} type="radio" value="1" id="yes" onChange={(e) => handleshowhide11(e)} /> &nbsp; Fully Paid
              </label>{" "}
              <label htmlFor="sidc">
                &nbsp;&nbsp;
                <input {...register("sidc")} type="radio" value="2" id="no" onChange={(e) => handleshowhide11(e)} /> &nbsp; Outstanting
              </label>
            </Col>
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Enhance EDC
                  <span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>
              <br></br>
              <label htmlFor=" enhanceEdc">
                {" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input {...register("enhanceEdc")} type="radio" value="1" id="yes" onChange={(e) => handleshowhide12(e)} /> &nbsp; Fully Paid
              </label>{" "}
              <label htmlFor="enhanceEdc">
                &nbsp;&nbsp;
                <input {...register("enhanceEdc")} type="radio" value="2" id="no" onChange={(e) => handleshowhide12(e)} /> &nbsp; Outstanting
              </label>
            </Col>
          </Row>
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
