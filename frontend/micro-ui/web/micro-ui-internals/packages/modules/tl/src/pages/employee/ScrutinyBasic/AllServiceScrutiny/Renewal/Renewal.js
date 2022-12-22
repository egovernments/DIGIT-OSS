import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import AddBoxSharpIcon from "@mui/icons-material/AddBoxSharp";
import IndeterminateCheckBoxSharpIcon from "@mui/icons-material/IndeterminateCheckBoxSharp";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ModalChild from "../../Remarks/ModalChild";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const Colors = {
  approved: "#09cb3d",
  disapproved: "#ff0000",
  info: "#FFB602",
};

function renewalClu() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm({});

  const renewal = (data) => console.log(data);
  const [modal, setmodal] = useState(false);

  const [openedModal, setOpennedModal] = useState("");
  const [labelValue, setLabelValue] = useState("");
  const [smShow, setSmShow] = useState(false);
  const [fieldValue, setFieldValue] = useState("");
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldIconColors, setFieldIconColors] = useState({
    developer: Colors.info,
    authPersonName: Colors.info,
    authMobileNo1: Colors.info,
    authMobileNo2: Colors.info,
    emailId: Colors.info,
    pan: Colors.info,
    address: Colors.info,
    city: Colors.info,
    pin: Colors.info,
    tehsil: Colors.info,
    district: Colors.info,
    state: Colors.info,
    type: Colors.info,
    lciSignedBy: Colors.info,
    lciNotSigned: Colors.info,
    parmanentAddress: Colors.info,
    addressForCommunication: Colors.info,
    authPerson: Colors.info,
    emailForCommunication: Colors.info,
  });

  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  const handlemodaldData = (data) => {
    // setmodaldData(data.data);
    setSmShow(false);
    console.log("here", openedModal, data);
    if (openedModal && data) {
      setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved });
    }
    setOpennedModal("");
    setLabelValue("");
  };

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
              <div style={{ display: "flex" }}>
                <input disabled type="number" className="form-control" placeholder="" {...register("licenseNo")} />
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
            </Col>
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Valid Upto <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div style={{ display: "flex" }}>
                <input disabled type="date" className="form-control" placeholder="" {...register("validUpto")} />
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
            </Col>
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Renewal For <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div style={{ display: "flex" }}>
                <select className="form-control" {...register("selectService")} onChange={(e) => handleshowhide(e)}>
                  <option value=" ">----Select value-----</option>
                  <option value="1">Year</option>
                  <option value="2">Month</option>
                </select>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
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
                      <input disabled  type="number" className="form-control" placeholder="" {...register("areaInAcres")} />
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
              <div style={{ display: "flex" }}>
                <input disabled type="text" className="form-control" placeholder="" {...register("colonizerName")} />
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
            </Col>
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Type of Colony
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div style={{ display: "flex" }}>
                <input disabled type="text" className="form-control" placeholder="" {...register("colonyType")} />
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
            </Col>
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Area in Acres
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div style={{ display: "flex" }}>
                <input disabled type="text" className="form-control" placeholder="" {...register("areaAcres")} />
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
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
              <div style={{ display: "flex" }}>
                <input disabled type="text" className="form-control" placeholder="" {...register("sectorNo")} />
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
            </Col>

            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Village
                  <span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>
              <div style={{ display: "flex" }}>
                <input disabled type="text" className="form-control" placeholder="" {...register("village")} />
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
            </Col>
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Tehsil
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div style={{ display: "flex" }}>
                <input disabled type="number" className="form-control" placeholder="" {...register("tehsil")} />
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
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
              <div style={{ display: "flex" }}>
                <input disabled type="email" className="form-control" placeholder="" {...register("district")} />
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
            </Col>

            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Whether renewal applied within the stipulated period.
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div style={{ display: "flex" }}>
                <label htmlFor=" Whether renewal applied within the stipulated period.">
                  {" "}
                  &nbsp;&nbsp;
                  <input disabled {...register("renewalApplied")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="Whether renewal applied within the stipulated period.">
                  &nbsp;&nbsp;
                  <input disabled {...register("renewalApplied")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
              {watch("renewalApplied") === "2" && (
                <Col className="col-12">
                  <Form.Label>
                    <h2></h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input disabled type="text" className="form-control" placeholder="" />
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.developer,
                      }}
                      onClick={() => {
                        setOpennedModal("Licence No");
                        setLabelValue("Licence No"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                      }}
                    />
                  </div>
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
              <div style={{ display: "flex" }}>
                <input disabled type="email" className="form-control" placeholder="" {...register("renewalAmount")} />
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
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
            <div style={{ display: "flex" }}>
              <textarea disabled className="form-control" placeholder="" {...register("completingProject")} rows="3" />
              <ReportProblemIcon
                style={{
                  color: fieldIconColors.developer,
                }}
                onClick={() => {
                  setOpennedModal("Licence No");
                  setLabelValue("Licence No"),
                    setSmShow(true),
                    console.log("modal open"),
                    setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                }}
              />
            </div>
          </Row>
          <br></br>

          <Row className="col-12">
            <Form.Label>
              <h2>
                {" "}
                Reason for not completing the project within the initial validity period of the license.
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                <div style={{ display: "flex" }}>
                  <label htmlFor=" Whether the renewal applied is the first time ? (Yes/No)">
                    {" "}
                    &nbsp;&nbsp;
                    <input disabled {...register("renewalAppliedFirstTime")} type="radio" value="1" id="yes" /> &nbsp; Yes
                  </label>{" "}
                  <label htmlFor="Whether the renewal applied is the first time ? (Yes/No)">
                    &nbsp;&nbsp;
                    <input disabled {...register("renewalAppliedFirstTime")} type="radio" value="2" id="no" /> &nbsp; No
                  </label>
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.developer,
                    }}
                    onClick={() => {
                      setOpennedModal("Licence No");
                      setLabelValue("Licence No"),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                    }}
                  />
                </div>
              </h2>
            </Form.Label>
          </Row>
          {watch("renewalAppliedFirstTime") === "2" && (
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
                      <input disabled type="text" className="form-control" placeholder="" {...register("condition")} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <label htmlFor=" complianceDone">
                        {" "}
                        &nbsp;&nbsp;
                        <input disabled {...register("complianceDone")} type="radio" value="1" id="yes" /> &nbsp; Yes
                      </label>{" "}
                      <label htmlFor="complianceDone">
                        &nbsp;&nbsp;
                        <input disabled {...register("complianceDone")} type="radio" value="2" id="no" /> &nbsp; No
                      </label>
                      {watch("complianceDone") === "2" && (
                        <div>
                          {/* <label>
                            <h2>Compilance</h2>
                          </label> */}
                          <input disabled type="text" className="form-control" placeholder="" />
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
              <div style={{ display: "flex" }}>
                <label htmlFor=" colonizer">
                  {" "}
                  &nbsp;&nbsp;
                  <input disabled {...register("colonizer")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="colonizer">
                  &nbsp;&nbsp;
                  <input disabled {...register("colonizer")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
              {watch("colonizer") === "1" && (
                <Col className="col-12">
                  <Form.Label>
                    <h2></h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input disabled type="text" className="form-control" placeholder="" />
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.developer,
                      }}
                      onClick={() => {
                        setOpennedModal("Licence No");
                        setLabelValue("Licence No"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                      }}
                    />
                  </div>
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
              <div style={{ display: "flex" }}>
                <label htmlFor=" colonizerUltimatePower">
                  {" "}
                  &nbsp;&nbsp;
                  <input disabled {...register("colonizerUltimatePower")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="colonizerUltimatePower">
                  &nbsp;&nbsp;
                  <input disabled {...register("colonizerUltimatePower")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
              {watch("colonizerUltimatePower") === "1" && (
                <Col className="col-12">
                  <Form.Label>
                    <h2></h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input disabled type="text" className="form-control" placeholder="" />
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.developer,
                      }}
                      onClick={() => {
                        setOpennedModal("Licence No");
                        setLabelValue("Licence No"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                      }}
                    />
                  </div>
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
              <div style={{ display: "flex" }}>
                <label htmlFor=" transferredPortion">
                  {" "}
                  &nbsp;&nbsp;
                  <input disabled {...register("transferredPortion")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="transferredPortion">
                  &nbsp;&nbsp;
                  <input disabled {...register("transferredPortion")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
              {watch("transferredPortion") === "1" && (
                <Row className="col-12">
                  <Col className="col-4">
                    <Form.Label>
                      <h2>Area</h2>
                    </Form.Label>
                    <div style={{ display: "flex" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("area")} />
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      />
                    </div>
                  </Col>
                  <Col className="col-4">
                    <Form.Label>
                      <h2>Khasra No</h2>
                    </Form.Label>
                    <div style={{ display: "flex" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("khasraNo")} />
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      />
                    </div>
                  </Col>
                  <Col className="col-4">
                    <Form.Label>
                      <h2>Remarks</h2>
                    </Form.Label>
                    <div style={{ display: "flex" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("remark")} />
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      />
                    </div>
                  </Col>
                  <Col className="col-12">
                    <Form.Label>
                      <h2>Upload copy of mutation</h2>
                    </Form.Label>
                    <div style={{ display: "flex" }}>
                      <input disabled type="file" className="form-control" placeholder="" {...register("uploadmutation")} />
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      />
                    </div>
                  </Col>
                </Row>
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
              <div style={{ display: "flex" }}>
                <label htmlFor=" compilanceLicense">
                  {" "}
                  &nbsp;&nbsp;
                  <input disabled {...register("compilanceLicense")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="compilanceLicense">
                  &nbsp;&nbsp;
                  <input disabled {...register("compilanceLicense")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
              {watch("compilanceLicense") === "1" && (
                <Col className="col-12">
                  <Form.Label>
                    <h2></h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input disabled type="text" className="form-control" placeholder="" />
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.developer,
                      }}
                      onClick={() => {
                        setOpennedModal("Licence No");
                        setLabelValue("Licence No"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                      }}
                    />
                  </div>
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
              <div style={{ display: "flex" }}>
                <label htmlFor=" courtCases">
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input disabled {...register("courtCases")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="courtCases">
                  &nbsp;&nbsp;
                  <input disabled {...register("courtCases")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
              {watch("courtCases") === "1" && (
                <Col className="col-12">
                  <Form.Label>
                    <h2></h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input disabled type="text" className="form-control" placeholder="" />
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.developer,
                      }}
                      onClick={() => {
                        setOpennedModal("Licence No");
                        setLabelValue("Licence No"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                      }}
                    />
                  </div>
                </Col>
              )}
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-12">
              <Form.Label>
                <h2 style={{ marginleft: "20px" }}>
                  {" "}
                  EDC
                  <span style={{ color: "red" }}>*</span>
                  <div style={{ display: "flex" }}>
                    <label htmlFor=" edc">
                      {" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <input disabled {...register("edc")} type="radio" value="1" id="yes" /> &nbsp; Fully Paid
                    </label>{" "}
                    <label htmlFor="edc">
                      &nbsp;&nbsp;
                      <input disabled {...register("edc")} type="radio" value="2" id="no" /> &nbsp; Outstanding
                    </label>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.developer,
                      }}
                      onClick={() => {
                        setOpennedModal("Licence No");
                        setLabelValue("Licence No"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                      }}
                    />
                  </div>
                </h2>
              </Form.Label>
              {watch("edc") === "2" && (
                <Row className="col-12">
                  <Col className="col-12">
                    <div className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <th colSpan="6" className="fw-normal" style={{ textAlign: "center" }}>
                            Outstanding Dues
                          </th>
                        </tr>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Head
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Principal
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Interest
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Penal interest
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Total
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Remark
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Remaining EDC
                          </th>
                          <td style={{ textAlign: "center" }}>
                            <input disabled type="text" className="form-control" placeholder="" {...register("principal")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input disabled type="text" className="form-control" placeholder="" {...register("interest")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input disabled type="text" className="form-control" placeholder="" {...register("penalInterest")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input disabled type="text" className="form-control" placeholder="" {...register("total")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input disabled type="text" className="form-control" placeholder="" {...register("remark")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.developer,
                              }}
                              onClick={() => {
                                setOpennedModal("Licence No");
                                setLabelValue("Licence No"),
                                  setSmShow(true),
                                  console.log("modal open"),
                                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Under OTS
                          </th>
                          <td style={{ textAlign: "center" }}>
                            <input disabled type="text" className="form-control" placeholder="" {...register("principal")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input disabled type="text" className="form-control" placeholder="" {...register("interest")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input disabled type="text" className="form-control" placeholder="" {...register("penalInterest")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input disabled type="text" className="form-control" placeholder="" {...register("total")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input disabled type="text" className="form-control" placeholder="" {...register("remark")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.developer,
                              }}
                              onClick={() => {
                                setOpennedModal("Licence No");
                                setLabelValue("Licence No"),
                                  setSmShow(true),
                                  console.log("modal open"),
                                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </div>
                  </Col>
                </Row>
              )}
            </Col>

            <Col className="col-12">
              <Form.Label>
                <h2>
                  {" "}
                  SIDC
                  <span style={{ color: "red" }}>*</span>{" "}
                  <div style={{ display: "flex" }}>
                    <label htmlFor=" sidc">
                      {" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <input disabled {...register("sidc")} type="radio" value="1" id="yes" /> &nbsp; Fully Paid
                    </label>{" "}
                    <label htmlFor="sidc">
                      &nbsp;&nbsp;
                      <input disabled {...register("sidc")} type="radio" value="2" id="no" /> &nbsp; Outstanding
                    </label>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.developer,
                      }}
                      onClick={() => {
                        setOpennedModal("Licence No");
                        setLabelValue("Licence No"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                      }}
                    />
                  </div>
                </h2>
              </Form.Label>
              {watch("sidc") === "2" && (
                <Row className="col-12">
                  <Col className="col-12">
                    <div className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <th colSpan="6" className="fw-normal" style={{ textAlign: "center" }}>
                            Outstanding Dues
                          </th>
                        </tr>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Head
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Principal
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Interest
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Penal interest
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Total
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Remark
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Remaining SIDC
                          </th>
                          <td style={{ textAlign: "center" }}>
                            <input disabled type="text" className="form-control" placeholder="" {...register("principal")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input disabled type="text" className="form-control" placeholder="" {...register("interest")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input disabled type="text" className="form-control" placeholder="" {...register("penalInterest")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input disabled type="text" className="form-control" placeholder="" {...register("total")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input disabled type="text" className="form-control" placeholder="" {...register("remark")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.developer,
                              }}
                              onClick={() => {
                                setOpennedModal("Licence No");
                                setLabelValue("Licence No"),
                                  setSmShow(true),
                                  console.log("modal open"),
                                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </div>
                  </Col>
                </Row>
              )}
            </Col>

            <Col className="col-12">
              <Form.Label>
                <h2>
                  {" "}
                  Enhance EDC
                  <span style={{ color: "red" }}>*</span>{" "}
                  <div style={{ display: "flex" }}>
                    <label htmlFor=" enhanceEdc">
                      {" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <input disabled {...register("enhanceEdc")} type="radio" value="1" id="yes" /> &nbsp; Fully Paid
                    </label>{" "}
                    <label htmlFor="enhanceEdc">
                      &nbsp;&nbsp;
                      <input disabled {...register("enhanceEdc")} type="radio" value="2" id="no" /> &nbsp; Outstanding
                    </label>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.developer,
                      }}
                      onClick={() => {
                        setOpennedModal("Licence No");
                        setLabelValue("Licence No"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                      }}
                    />
                  </div>
                </h2>
              </Form.Label>
              {watch("enhanceEdc") === "2" && (
                <Row className="col-12">
                  <Col className="col-6">
                    <Form.Label>
                      <h2>
                        {" "}
                        Amount
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                    </Form.Label>
                    <div style={{ display: "flex" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("amount")} />
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      />
                    </div>
                  </Col>

                  <Col className="col-6">
                    <Form.Label>
                      <h2>
                        {" "}
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                    </Form.Label>
                    <div style={{ display: "flex" }}>
                      <select className="form-control" {...register("selectService")}>
                        <option value=" ">----Select value-----</option>
                        <option value="1">NA</option>
                        <option value="2">Under Stay</option>
                      </select>
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
          <Row className="col-12">
            <Col className="col-12">
              <Form.Label>
                <h2 style={{ marginleft: "20px" }}>
                  {" "}
                  Bank Guarantee
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      BG.No.
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Amount
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Validity
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Bank
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Component
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("bgNo")} />
                    </th>
                    <td style={{ textAlign: "center" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("amount")} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("validity")} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("bank")} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <select className="form-control" {...register("component")}>
                        <option value=" ">----Select value-----</option>
                        <option value="1">EDC</option>
                        <option value="2">IDW </option>
                      </select>
                    </td>
                    <td>
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("bgNo")} />
                    </th>
                    <td style={{ textAlign: "center" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("amount")} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("validity")} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("bank")} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("componet")} />
                    </td>
                    <td>
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </div>
            </Col>
          </Row>
          <hr></hr>
          <Row className="col-12">
            <Col className="col-6">
              <Form.Label>
                <h2>
                  {" "}
                  CA certificate regarding non collection of stamp duty and registration charges.
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </Col>
            <Col className="col-6">
              <div style={{ display: "flex" }}>
                <input disabled type="file" className="form-control" placeholder="" {...register("cacertification")} />
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
            </Col>
          </Row>
          <hr></hr>
          <Row className="col-12">
            <Col className="col-12">
              <Form.Label>
                <h2>
                  {" "}
                  Copies of advertisement for the sale of flat (Sec 24) along with register containing authenticated copies of Agreement entered
                  between colonizer.
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>{" "}
              <br></br>
              <div style={{ display: "flex" }}>
                <label htmlFor=" advertisementCopy">
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input disabled {...register("advertisementCopy")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="advertisementCopy">
                  &nbsp;&nbsp;
                  <input disabled {...register("advertisementCopy")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
              {watch("advertisementCopy") === "1" && (
                <Row className="col-4">
                  <Col className="col-12">
                    <Form.Label>
                      <h2>Remark</h2>
                    </Form.Label>
                    <div style={{ display: "flex" }}>
                      <input disabled type="text" className="form-control" placeholder="" />
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
          <hr></hr>
          <Row className="col-12">
            <Col className="col-12">
              <Form.Label>
                <h2>
                  {" "}
                  Annual Financial statements duly audited/certifie and signed by Chartened Accountant indicating the amount realized from each space
                  holders, the expenditure incured internal and on external development works separately of the colony /building etc. with detail
                  thereof whether with the amount due from each space holders indicating their postal addresses.
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>{" "}
              <br></br>
              <div style={{ display: "flex" }}>
                <label htmlFor=" annualFinancial">
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input disabled {...register("annualFinancial")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="annualFinancial">
                  &nbsp;&nbsp;
                  <input disabled {...register("annualFinancial")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
              {watch("annualFinancial") === "1" && (
                <Row className="col-4">
                  <Col className="col-12">
                    <Form.Label>
                      <h2>Remark</h2>
                    </Form.Label>
                    <div style={{ display: "flex" }}>
                      <input disabled type="text" className="form-control" placeholder="" />
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
          <hr></hr>
          <Row className="col-12">
            <Col className="col-12">
              <Form.Label>
                <h2>
                  {" "}
                  Detail of account number of schedule bank in which 30% of the amount released by him from the space holder deposited to meet out the
                  cost of internet developmant work of the colony.
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>{" "}
              <br></br>
              <div style={{ display: "flex" }}>
                <label htmlFor=" detailAccountNumber">
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input disabled {...register("detailAccountNumber")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="detailAccountNumber">
                  &nbsp;&nbsp;
                  <input disabled {...register("detailAccountNumber")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
              {watch("detailAccountNumber") === "1" && (
                <Row className="col-4">
                  <Col className="col-12">
                    <Form.Label>
                      <h2>Remark</h2>
                    </Form.Label>
                    <div style={{ display: "flex" }}>
                      <input disabled type="text" className="form-control" placeholder="" />
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
          <hr></hr>
          <Row className="col-12">
            <Col className="col-12">
              <Form.Label>
                <h2>
                  {" "}
                  Copies of form AC account indicating the amount released from each space holders and the amount deposited during the preceeding
                  month in the schedule Bank.
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>{" "}
              <br></br>
              <div style={{ display: "flex" }}>
                <label htmlFor=" copiesOfCaAccount">
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input disabled {...register("copiesOfCaAccount")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="copiesOfCaAccount">
                  &nbsp;&nbsp;
                  <input disabled {...register("copiesOfCaAccount")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
              {watch("copiesOfCaAccount") === "1" && (
                <Row className="col-4">
                  <Col className="col-12">
                    <Form.Label>
                      <h2>Remark</h2>
                    </Form.Label>
                    <div style={{ display: "flex" }}>
                      <input disabled type="text" className="form-control" placeholder="" />
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
          <hr></hr>
          <Row className="col-12">
            <Col className="col-12">
              <Form.Label>
                <h2 style={{ marginleft: "20px" }}>
                  {" "}
                  (1) Status of OC
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Sr.No.
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Date of grant of OC
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Tower
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Target date for filling DOD
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Whether DOD filled or not
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <label>
                        <h2>1</h2>
                      </label>
                    </th>
                    <td style={{ textAlign: "center" }}>
                      <input disabled type="date" className="form-control" placeholder="" {...register("date")} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input disabled type="text" className="form-control" readOnly placeholder="" {...register("tower")} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input disabled type="text" className="form-control" readOnly placeholder="" {...register("targetDate")} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <label htmlFor=" dodFilled">
                        {" "}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input disabled {...register("dodFilled")} type="radio" value="1" id="yes" /> &nbsp; Yes
                      </label>{" "}
                      <label htmlFor="dodFilled">
                        &nbsp;&nbsp;
                        <input disabled {...register("dodFilled")} type="radio" value="2" id="no" /> &nbsp; No
                      </label>
                      {watch("dodFilled") === "1" && (
                        <Row className="col-12">
                          <Col className="col-12">
                            <select className="form-control" {...register("dodFiledDrop")}>
                              <option value=" ">----Select value-----</option>
                              <option value="1">Within Time </option>
                              <option value="2">Delayed</option>
                              <option value="3">NA</option>
                            </select>
                          </Col>
                        </Row>
                      )}
                      {watch("dodFiledDrop") === "2" && (
                        <Row className="col-12">
                          <Col className="col-12">
                            <Form.Label>
                              <h2>
                                {" "}
                                Composition
                                <span style={{ color: "red" }}>*</span>
                              </h2>
                            </Form.Label>{" "}
                            <input disabled type="text" placeholder="" className="form-control" readOnly {...register("composition")} />
                          </Col>
                        </Row>
                      )}
                    </td>
                    <td>
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </div>
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-12">
              <Form.Label>
                <h2 style={{ marginleft: "20px" }}>
                  {" "}
                  (2) Status of Part Completion
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Sr.No.
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Date of approval of Layout Plan
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Area in Acre
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }} colspan="2">
                      Part completion (entered granted area )
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Percent of total area
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <label>
                        <h2>1</h2>
                      </label>
                    </th>
                    <td style={{ textAlign: "center" }}>
                      <input disabled type="date" className="form-control" placeholder="" {...register("date")} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("areaInAcre")} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("partCompletion")} />
                    </td>
                    <td>
                      <label>
                        <h2>Upload part Completion certificate</h2>
                        <ArrowCircleUpIcon style={{ textAlign: "center" }} color="primary" />
                      </label>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("percentArea")} />
                    </td>
                    <td>
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </div>
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-12">
              <Form.Label>
                <h2 style={{ marginleft: "20px" }}>
                  {" "}
                  (3) Status of Community Sites
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Sr.No.
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Type
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Area
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Building Plan
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      OC granized
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <label>
                        <h2>1</h2>
                      </label>
                    </th>
                    <td style={{ textAlign: "center" }}>
                      <input disabled type="date" className="form-control" placeholder="" {...register("type")} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("area")} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <label htmlFor=" buildingPlan">
                        {" "}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input disabled {...register("buildingPlan")} type="radio" value="1" id="yes" /> &nbsp; Yes
                      </label>{" "}
                      <label htmlFor="buildingPlan">
                        &nbsp;&nbsp;
                        <input disabled {...register("buildingPlan")} type="radio" value="2" id="no" /> &nbsp; No
                      </label>
                      {watch("buildingPlan") === "1" && (
                        <Col className="col-12">
                          <Form.Label>
                            <h2>Date</h2>
                          </Form.Label>
                          <input disabled type="date" className="form-control" placeholder="" />
                        </Col>
                      )}
                      {watch("buildingPlan") === "2" && (
                        <Col className="col-12">
                          <Form.Label>
                            <h2>Remark</h2>
                          </Form.Label>
                          <input disabled type="text" className="form-control" placeholder="" />
                        </Col>
                      )}
                    </td>
                    <td>
                      <label htmlFor=" ocGranized">
                        {" "}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input disabled {...register("ocGranized")} type="radio" value="1" id="yes" /> &nbsp; Yes
                      </label>{" "}
                      <label htmlFor="ocGranized">
                        &nbsp;&nbsp;
                        <input disabled {...register("ocGranized")} type="radio" value="2" id="no" onClick={() => setmodal(true)} /> &nbsp; No
                      </label>
                      {watch("ocGranized") === "1" && (
                        <Row className="col-12">
                          <Col className="col-6">
                            <Form.Label>
                              <h2>Remark</h2>
                            </Form.Label>
                            <input disabled type="date" className="form-control" placeholder="" />
                          </Col>
                          <Col className="col-6">
                            <Form.Label>
                              <h2>Till Date</h2>
                            </Form.Label>
                            <input disabled type="date" className="form-control" placeholder="" />
                          </Col>
                        </Row>
                      )}
                      {watch("ocGranized") === "2" && (
                        <Col className="col-12">
                          <Modal
                            size="lg"
                            isOpen={modal}
                            toggle={() => setmodal(!modal)}
                            style={{ width: "500px", height: "200px" }}
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                          >
                            <ModalHeader toggle={() => setmodal(!modal)}></ModalHeader>
                            <ModalBody style={{ fontSize: 20 }}>
                              <label>
                                <h2>Valid upto</h2>
                              </label>
                              <input disabled type="date" placeholder="" className="form-control" />
                              <div>
                                <h2>If out of date then redirect to extension of Cs.</h2>
                              </div>
                            </ModalBody>
                            <ModalFooter toggle={() => setmodal(!modal)}></ModalFooter>
                          </Modal>
                        </Col>
                      )}
                    </td>
                    <td>
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </div>
            </Col>
          </Row>
          <hr></hr>
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Total number of EWS Plots/flats approved in the Layout Plan/Building Plan.
                  <br></br>No. of Plots/flats.
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div style={{ display: "flex" }}>
                <input disabled type="text" className="form-control" placeholder="" {...register("noOfFlats")} />
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
            </Col>
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Status of allotment and possession of Plot/Flats of EWS category.
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div style={{ display: "flex" }}>
                <label htmlFor=" allotmentStatus">
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input disabled {...register("allotmentStatus")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="allotmentStatus">
                  &nbsp;&nbsp;
                  <input disabled {...register("allotmentStatus")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
              {watch("allotmentStatus") === "1" && (
                <div className="card">
                  <Row className="col-12">
                    <Form.Label>
                      <h2>Plot/Flats for which possession given. </h2>
                    </Form.Label>
                    <Col className="col-6">
                      <Form.Label>
                        <h2></h2>
                      </Form.Label>
                      <div style={{ display: "flex" }}>
                        <input disabled type="text" className="form-control" placeholder="" />
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.developer,
                          }}
                          onClick={() => {
                            setOpennedModal("Licence No");
                            setLabelValue("Licence No"),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                          }}
                        />
                      </div>
                    </Col>
                    <Col className="col-6">
                      <Form.Label>
                        <h2></h2>
                      </Form.Label>
                      <div style={{ display: "flex" }}>
                        <select className="form-control" {...register("flatPossession")}>
                          <option value=" ">Select value</option>
                          <option value="1">Within time</option>
                          <option value="2">Delayed</option>
                          <option value="2">NA</option>
                        </select>
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.developer,
                          }}
                          onClick={() => {
                            setOpennedModal("Licence No");
                            setLabelValue("Licence No"),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
              {watch("flatPossession") === "2" && (
                <div className="card">
                  <Row className="col-12">
                    <Col className="col-12">
                      <Form.Label>
                        <h2>
                          Whether composition fee paid.
                          <div style={{ display: "flex" }}>
                            <label htmlFor=" compositionPaid">
                              {" "}
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <input disabled {...register("compositionPaid")} type="radio" value="1" id="yes" /> &nbsp; Yes
                            </label>{" "}
                            <label htmlFor="compositionPaid">
                              &nbsp;&nbsp;
                              <input disabled {...register("compositionPaid")} type="radio" value="2" id="no" /> &nbsp; No
                            </label>
                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.developer,
                              }}
                              onClick={() => {
                                setOpennedModal("Licence No");
                                setLabelValue("Licence No"),
                                  setSmShow(true),
                                  console.log("modal open"),
                                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                              }}
                            />
                          </div>
                        </h2>
                      </Form.Label>
                    </Col>
                  </Row>
                </div>
              )}
              {watch("compositionPaid") === "1" && (
                <div className="card">
                  <Row className="col-12">
                    <Col className="col-12">
                      <Form.Label>
                        <h2>Amount</h2>
                      </Form.Label>
                      <div style={{ display: "flex" }}>
                        <input disabled type="text" placeholder="" className="form-control" />
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.developer,
                          }}
                          onClick={() => {
                            setOpennedModal("Licence No");
                            setLabelValue("Licence No"),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
            </Col>
          </Row>
          <br></br>
          <hr></hr>
          <br></br>
          <Row className="col-12">
            <Col className="col-12">
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Sr.No.
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Field Name
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      Upload Documents
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <label>
                        <h2>1.</h2>
                      </label>
                    </th>
                    <td>
                      <label>
                        <h2>Upload the income tax clearance certifiate issued by the income tax officer.</h2>
                      </label>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("indemnityBond")}></input> */}
                      <div className="row">
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                            <VisibilityIcon color="info" className="icon" />
                          </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                            <FileDownloadIcon color="info" className="icon" />
                          </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-4">
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.developer,
                            }}
                            onClick={() => {
                              setOpennedModal("Licence No");
                              setLabelValue("Licence No"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                            }}
                          ></ReportProblemIcon>
                          {/* <input type="file" className="form-control" placeholder="" {...register("uploadbrIII")}></input> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <label>
                        <h2>2.</h2>
                      </label>
                    </th>
                    <td>
                      <label>
                        <h2>
                          Upload an explanatory note indicating the details of development works:which have been completed or are in progress or are
                          yet to be undertaken.
                        </h2>
                      </label>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("indemnityBond")}></input> */}
                      <div className="row">
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                            <VisibilityIcon color="info" className="icon" />
                          </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                            <FileDownloadIcon color="info" className="icon" />
                          </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-4">
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.developer,
                            }}
                            onClick={() => {
                              setOpennedModal("Licence No");
                              setLabelValue("Licence No"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                            }}
                          ></ReportProblemIcon>
                          {/* <input type="file" className="form-control" placeholder="" {...register("uploadbrIII")}></input> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <label>
                        <h2>3.</h2>
                      </label>
                    </th>
                    <td>
                      <label>
                        <h2>Status of dvelopment works duly signed by authorized signatory.</h2>
                      </label>
                    </td>

                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("indemnityBond")}></input> */}
                      <div className="row">
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                            <VisibilityIcon color="info" className="icon" />
                          </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                            <FileDownloadIcon color="info" className="icon" />
                          </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-4">
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.developer,
                            }}
                            onClick={() => {
                              setOpennedModal("Licence No");
                              setLabelValue("Licence No"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                            }}
                          ></ReportProblemIcon>
                          {/* <input type="file" className="form-control" placeholder="" {...register("uploadbrIII")}></input> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <label>
                        <h2>4.</h2>
                      </label>
                    </th>
                    <td>
                      <label>
                        <h2>Old License for verification.</h2>
                      </label>
                    </td>

                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("indemnityBond")}></input> */}
                      <div className="row">
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                            <VisibilityIcon color="info" className="icon" />
                          </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                            <FileDownloadIcon color="info" className="icon" />
                          </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-4">
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.developer,
                            }}
                            onClick={() => {
                              setOpennedModal("Licence No");
                              setLabelValue("Licence No"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                            }}
                          ></ReportProblemIcon>
                          {/* <input type="file" className="form-control" placeholder="" {...register("uploadbrIII")}></input> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </div>
            </Col>
          </Row>
          <br></br>
          <Row className="col-12">
            <Col className="col-4">
              <Form.Label>
                <h2>
                  {" "}
                  Amount <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div style={{ display: "flex" }}>
                <input disabled type="text" className="form-control" placeholder="" readOnly {...register("amount")} />
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.developer,
                  }}
                  onClick={() => {
                    setOpennedModal("Licence No");
                    setLabelValue("Licence No"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
            </Col>

            <Col className="col-4">
              <button type="submit" id="btnSearch" class="btn btn-success btn-md center-block" style={{ marginTop: "25px" }}>
                Pay
              </button>
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
      <ModalChild
        labelmodal={labelValue}
        passmodalData={handlemodaldData}
        displaymodal={smShow}
        onClose={() => setSmShow(false)}
        selectedFieldData={selectedFieldData}
        fieldValue={fieldValue}
        remarksUpdate={currentRemarks}
      />
    </form>
  );
}

export default renewalClu;
