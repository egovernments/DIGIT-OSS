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
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const Colors = {
  approved: "#09cb3d",
  disapproved: "#ff0000",
  info: "#FFB602",
};

function RenewalClu() {
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
  const [open2, setOpen2] = useState(false);
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldIconColors, setFieldIconColors] = useState({
    licenseNo: Colors.info,
    validUpto: Colors.info,
    renewalRequiredUpto: Colors.info,
    colonizerName: Colors.info,
    colonyType: Colors.info,
    areaAcres: Colors.info,
    sectorNo: Colors.info,
    revenueEstate: Colors.info,
    tehsil: Colors.info,
    district: Colors.info,
    renewalApplied: Colors.info,
    renewalAmount: Colors.info,
    completingProject: Colors.info,
    transferredPortion: Colors.info,
    renewalAppliedFirstTime: Colors.info,
    colonizer: Colors.info,
    imposedSpecificCondition: Colors.info,
    courtCases: Colors.info,
    complianceOfRule26: Colors.info,
    compliedInTimePeriod: Colors.info,
    obtainedOCPart: Colors.info,
    coveredArea: Colors.info,
    proportionateSiteArea: Colors.info,
    OCdocument: Colors.info,
    obtainedCCPart: Colors.info,
    siteArea: Colors.info,
    CCdocument: Colors.info,
    plotAllotmentStatus: Colors.info,
    uploadStatusDevelopment: Colors.info,
    oldAmount: Colors.info,
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
        <span style={{ color: "#817f7f", fontSize: 14 }} className="">
          Renewal
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          {/* <Card style={{ width: "126%", border: "5px solid #1266af" }}> */}
          <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Renewal</h4>
          <div className="card">
            <Row className="col-12">
              <Col className="col-3">
                <Form.Label>
                  <h2>
                    License No.<span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
                <div style={{ display: "flex" }}>
                  <input disabled type="number" className="form-control" placeholder="" {...register("licenseNo")} />
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.licenseNo,
                    }}
                    onClick={() => {
                      setOpennedModal("licenseNo");
                      setLabelValue("Licence No."),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                    }}
                  />
                </div>
              </Col>
              <Col className="col-3">
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
                      color: fieldIconColors.validUpto,
                    }}
                    onClick={() => {
                      setOpennedModal("validUpto");
                      setLabelValue("Valid Upto"),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                    }}
                  />
                </div>
              </Col>
              <Col className="col-3">
                <Form.Label>
                  <h2>
                    {" "}
                    Renewal required upto <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
                <div style={{ display: "flex" }}>
                  <input disabled type="date" className="form-control" placeholder="" {...register("renewalRequiredUpto")} />
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.renewalRequiredUpto,
                    }}
                    onClick={() => {
                      setOpennedModal("renewalRequiredUpto");
                      setLabelValue(" Renewal required upto"),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                    }}
                  />
                </div>
              </Col>
              <Col className="col-3">
                <Form.Label>
                  <h2>
                    {" "}
                    Period of renewal(In months) <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
                <div style={{ display: "flex" }}>
                  <input disabled type="text" className="form-control" placeholder="" {...register("renewalRequiredUpto")} />
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.renewalRequiredUpto,
                    }}
                    onClick={() => {
                      setOpennedModal("renewalRequiredUpto");
                      setLabelValue(" Period of renewal(In months)"),
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
              <Col className="col-3">
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
                      color: fieldIconColors.colonizerName,
                    }}
                    onClick={() => {
                      setOpennedModal("colonizerName");
                      setLabelValue("Name of Colonizer"),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row className="col-12">
              <Col className="col-3">
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
                      color: fieldIconColors.colonyType,
                    }}
                    onClick={() => {
                      setOpennedModal("colonyType");
                      setLabelValue("Type of Colony"),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                    }}
                  />
                </div>
              </Col>
              <Col className="col-3">
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
                      color: fieldIconColors.areaAcres,
                    }}
                    onClick={() => {
                      setOpennedModal("areaAcres");
                      setLabelValue(" Area in Acres"),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                    }}
                  />
                </div>
              </Col>
              <Col className="col-3">
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
                      color: fieldIconColors.sectorNo,
                    }}
                    onClick={() => {
                      setOpennedModal("sectorNo");
                      setLabelValue(" Sector No."),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                    }}
                  />
                </div>
              </Col>
              <Col className="col-3">
                <Form.Label>
                  <h2>
                    {" "}
                    Revenue estate
                    <span style={{ color: "red" }}>*</span>{" "}
                  </h2>
                </Form.Label>
                <div style={{ display: "flex" }}>
                  <input disabled type="text" className="form-control" placeholder="" {...register("revenueEstate")} />
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.revenueEstate,
                    }}
                    onClick={() => {
                      setOpennedModal("revenueEstate");
                      setLabelValue(" Revenue estate"),
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
              <Col className="col-3">
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
                      color: fieldIconColors.tehsil,
                    }}
                    onClick={() => {
                      setOpennedModal("tehsil");
                      setLabelValue("Tehsil"),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                    }}
                  />
                </div>
              </Col>
              <Col className="col-3">
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
                      color: fieldIconColors.district,
                    }}
                    onClick={() => {
                      setOpennedModal("district");
                      setLabelValue("District"),
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
                    <input disabled {...register("renewalApplied")} type="radio" value="yes" id="yes" /> &nbsp; Yes
                  </label>{" "}
                  <label htmlFor="Whether renewal applied within the stipulated period.">
                    &nbsp;&nbsp;
                    <input disabled {...register("renewalApplied")} type="radio" value="no" id="no" /> &nbsp; No
                  </label>
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.renewalApplied,
                    }}
                    onClick={() => {
                      setOpennedModal("renewalApplied");
                      setLabelValue(" Whether renewal applied within the stipulated period."),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                    }}
                  />
                </div>
                {watch("renewalApplied") === "yes" && (
                  <Col className="col-12">
                    <Form.Label>
                      <h2>Whether renewal applied under section 7(B) as special category project</h2>
                    </Form.Label>
                    <div style={{ display: "flex" }}>
                      <label htmlFor="Whether renewal applied under section 7(B) as special category project">
                        {" "}
                        &nbsp;&nbsp;
                        <input disabled {...register("renewalAppliedUnderSection")} type="radio" value="1" id="yes" /> &nbsp; Yes
                      </label>{" "}
                      <label htmlFor="Whether renewal applied within the stipulated period.">
                        &nbsp;&nbsp;
                        <input disabled {...register("renewalAppliedUnderSection")} type="radio" value="2" id="no" /> &nbsp; No
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
                  </Col>
                )}
                {watch("renewalApplied") === "no" && (
                  <Col className="col-12">
                    <Form.Label>
                      <h2>Delay in days</h2>
                    </Form.Label>
                    <div style={{ display: "flex" }}>
                      <input disabled type="text" className="form-control" placeholder="" {...register("delayInDays")} />
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
            {/* <br></br>
          <Row className="col-12">
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
                    color: fieldIconColors.renewalAmount,
                  }}
                  onClick={() => {
                    setOpennedModal("renewalAmount");
                    setLabelValue(" Renewal Amount"),
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
                  color: fieldIconColors.completingProject,
                }}
                onClick={() => {
                  setOpennedModal("completingProject");
                  setLabelValue(" Reason for not completing the project within the initial validity period of the license."),
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
                      color: fieldIconColors.renewalAppliedFirstTime,
                    }}
                    onClick={() => {
                      setOpennedModal("renewalAppliedFirstTime");
                      setLabelValue("Whether the renewal applied is the first time ? (Yes/No)"),
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
          )} */}
            <br></br>
            <Row className="col-12">
              <Form.Label>
                <h2>
                  {" "}
                  Whether the colonizer has obtained approval/NOC from the competent authority in pursuance of MOEF notified dated 14.09.2006 before
                  stating the development works.
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
                <label htmlFor="transferredPortion">
                  &nbsp;&nbsp;
                  <input disabled {...register("transferredPortion")} type="radio" value="2" id="no" /> &nbsp; NA
                </label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.transferredPortion,
                  }}
                  onClick={() => {
                    setOpennedModal("transferredPortion");
                    setLabelValue(
                      " Whether the colonizer has obtained approval/NOC from the competent authority in pursuance of MOEF notified dated 14.09.2006 before stating the development works."
                    ),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
              {/* {watch("colonizer") === "1" && (
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
            )} */}
            </Row>
            <br></br>
            <Row className="col-12">
              <Form.Label>
                <h2>
                  {" "}
                  Whether any specific condition was imposed in the licence.
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div style={{ display: "flex" }}>
                <label htmlFor=" imposedSpecificCondition">
                  {" "}
                  &nbsp;&nbsp;
                  <input disabled {...register("imposedSpecificCondition")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="imposedSpecificCondition">
                  &nbsp;&nbsp;
                  <input disabled {...register("imposedSpecificCondition")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.imposedSpecificCondition,
                  }}
                  onClick={() => {
                    setOpennedModal("imposedSpecificCondition");
                    setLabelValue("Whether any specific condition was imposed in the licence."),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
              {watch("imposedSpecificCondition") === "1" && (
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
            </Row>
            <br></br>
            <Row className="col-12">
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
                    color: fieldIconColors.courtCases,
                  }}
                  onClick={() => {
                    setOpennedModal("courtCases");
                    setLabelValue(" Complaints/court cases pending if any."),
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
            </Row>
            <br></br>

            <Row className="col-12">
              <Form.Label>
                <h2>
                  {" "}
                  Compliance of Rule 24, 26(2), 27 & 28 of Rules 1976 has been made
                  <span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>
              <div style={{ display: "flex" }}>
                <label htmlFor=" complianceOfRule26">
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input disabled {...register("complianceOfRule26")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="complianceOfRule26">
                  &nbsp;&nbsp;
                  <input disabled {...register("complianceOfRule26")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.complianceOfRule26,
                  }}
                  onClick={() => {
                    setOpennedModal("complianceOfRule26");
                    setLabelValue("Compliance of Rule 24, 26(2), 27 & 28 of Rules 1976 has been made"),
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
                  Complied within time period
                  <span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>
              <div style={{ display: "flex" }}>
                <label htmlFor=" compliedInTimePeriod">
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input disabled {...register("compliedInTimePeriod")} type="radio" value="1" id="yes" /> &nbsp; Yes
                </label>{" "}
                <label htmlFor="compliedInTimePeriod">
                  &nbsp;&nbsp;
                  <input disabled {...register("compliedInTimePeriod")} type="radio" value="2" id="no" /> &nbsp; No
                </label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.compliedInTimePeriod,
                  }}
                  onClick={() => {
                    setOpennedModal("compliedInTimePeriod");
                    setLabelValue("Complied within time period"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
            </Row>
            <br></br>

            <Row className="col-12">
              <Col className="col-12">
                <Form.Label>
                  <h2 style={{ marginleft: "20px" }}>
                    <b>Status of OC</b>{" "}
                  </h2>
                </Form.Label>
              </Col>
            </Row>
            <Row className="col-12">
              <Col className="col-12">
                <Form.Label>
                  <h2>
                    {" "}
                    Whether OC/Part OC has been obtained
                    <span style={{ color: "red" }}>*</span>{" "}
                  </h2>
                </Form.Label>
                <div style={{ display: "flex" }}>
                  <label htmlFor=" obtainedOCPart">
                    {" "}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input disabled {...register("obtainedOCPart")} type="radio" value="1" id="yes" /> &nbsp; Yes
                  </label>{" "}
                  <label htmlFor="obtainedOCPart">
                    &nbsp;&nbsp;
                    <input disabled {...register("obtainedOCPart")} type="radio" value="2" id="no" /> &nbsp; No
                  </label>
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.obtainedOCPart,
                    }}
                    onClick={() => {
                      setOpennedModal("obtainedOCPart");
                      setLabelValue(" Whether OC/Part OC has been obtained"),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                    }}
                  />
                </div>
                {watch("obtainedOCPart") === "1" && (
                  <Row className="col-12">
                    <Col className="col-4">
                      <Form.Label>
                        <h2>Covered Area (In sq meters)</h2>
                      </Form.Label>
                      <div style={{ display: "flex" }}>
                        <input disabled type="text" className="form-control" placeholder="" {...register("coveredArea")} />
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.coveredArea,
                          }}
                          onClick={() => {
                            setOpennedModal("coveredArea");
                            setLabelValue("Covered Area (In sq meters)"),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                          }}
                        />
                      </div>
                    </Col>
                    <Col className="col-4">
                      <Form.Label>
                        <h2>Proportionate Site Area in Sq meter</h2>
                      </Form.Label>
                      <div style={{ display: "flex" }}>
                        <input disabled type="text" className="form-control" placeholder="" {...register("proportionateSiteArea")} />
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.proportionateSiteArea,
                          }}
                          onClick={() => {
                            setOpennedModal("proportionateSiteArea");
                            setLabelValue("Proportionate Site Area in Sq meter"),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                          }}
                        />
                      </div>
                    </Col>
                    <Col className="col-4">
                      <Form.Label>
                        <h2>Upload OC Document</h2>
                      </Form.Label>
                      <div style={{ display: "flex" }}>
                        <input disabled type="file" className="form-control" placeholder="" {...register("OCdocument")} />
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.OCdocument,
                          }}
                          onClick={() => {
                            setOpennedModal("OCdocument");
                            setLabelValue("Upload OC Document"),
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
              <Col className="col-12">
                <Form.Label>
                  <h2>
                    {" "}
                    Whether Part CC has been Obtained (Yes/No)
                    <span style={{ color: "red" }}>*</span>{" "}
                  </h2>
                </Form.Label>
                <div style={{ display: "flex" }}>
                  <label htmlFor=" obtainedCCPart">
                    {" "}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input disabled {...register("obtainedCCPart")} type="radio" value="1" id="yes" /> &nbsp; Yes
                  </label>{" "}
                  <label htmlFor="obtainedCCPart">
                    &nbsp;&nbsp;
                    <input disabled {...register("obtainedCCPart")} type="radio" value="2" id="no" /> &nbsp; No
                  </label>
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.obtainedCCPart,
                    }}
                    onClick={() => {
                      setOpennedModal("obtainedCCPart");
                      setLabelValue("Whether Part CC has been Obtained (Yes/No)"),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                    }}
                  />
                </div>
                {watch("obtainedCCPart") === "1" && (
                  <Row className="col-12">
                    <Col className="col-4">
                      <Form.Label>
                        <h2>Site Area(in Acres)</h2>
                      </Form.Label>
                      <div style={{ display: "flex" }}>
                        <input disabled type="text" className="form-control" placeholder="" {...register("siteArea")} />
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.siteArea,
                          }}
                          onClick={() => {
                            setOpennedModal("siteArea");
                            setLabelValue("Site Area(in Acres)"),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                          }}
                        />
                      </div>
                    </Col>
                    <Col className="col-4">
                      <Form.Label>
                        <h2>Upload Part CC Document</h2>
                      </Form.Label>
                      <div style={{ display: "flex" }}>
                        <input disabled type="file" className="form-control" placeholder="" {...register("CCdocument")} />
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.CCdocument,
                          }}
                          onClick={() => {
                            setOpennedModal("CCdocument");
                            setLabelValue("Upload Part CC Document"),
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
            <br></br>
            <Row className="col-12">
              <Form.Label>
                <h2>
                  {" "}
                  Status of allotment of EWS Plots/Flats
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div style={{ display: "flex" }}>
                <label htmlFor=" allotmentStatus">
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input disabled {...register("plotAllotmentStatus")} type="radio" value="1" id="yes" /> &nbsp; Partially Allotted
                </label>{" "}
                <label htmlFor="allotmentStatus">
                  &nbsp;&nbsp;
                  <input disabled {...register("plotAllotmentStatus")} type="radio" value="2" id="no" /> &nbsp; Alloted/Transferred
                </label>
                <label htmlFor="allotmentStatus">
                  &nbsp;&nbsp;
                  <input disabled {...register("plotAllotmentStatus")} type="radio" value="2" id="no" /> &nbsp; Yet to be transferred
                </label>
                <label htmlFor="allotmentStatus">
                  &nbsp;&nbsp;
                  <input disabled {...register("plotAllotmentStatus")} type="radio" value="2" id="no" /> &nbsp; Not applicable
                </label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.plotAllotmentStatus,
                  }}
                  onClick={() => {
                    setOpennedModal("plotAllotmentStatus");
                    setLabelValue("Status of allotment of EWS Plots/Flats"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                  }}
                />
              </div>
            </Row>
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
                          <h2>Status of development works completed at Site.</h2>
                        </label>
                      </td>
                      <td>
                        {/* <input type="file" className="form-control" placeholder="" {...register("indemnityBond")}></input> */}
                        <div className="row">
                          <div className="btn btn-sm col-md-4">
                            <IconButton onClick={() => getDocShareholding(item?.uploadStatusDevelopment)}>
                              <VisibilityIcon color="info" className="icon" />
                            </IconButton>
                          </div>
                          <div className="btn btn-sm col-md-4">
                            <IconButton onClick={() => getDocShareholding(item?.uploadStatusDevelopment)}>
                              <FileDownloadIcon color="info" className="icon" />
                            </IconButton>
                          </div>
                          <div className="btn btn-sm col-md-4">
                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.uploadStatusDevelopment,
                              }}
                              onClick={() => {
                                setOpennedModal("uploadStatusDevelopment");
                                setLabelValue(" Upload Documents"),
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
                  <input disabled type="text" className="form-control" placeholder="" readOnly {...register("oldAmount")} />
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.oldAmount,
                    }}
                    onClick={() => {
                      setOpennedModal("oldAmount");
                      setLabelValue("Amount"),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                    }}
                  />
                </div>
              </Col>

              {/* <Col className="col-4">
              <button type="submit" id="btnSearch" class="btn btn-success btn-md center-block" style={{ marginTop: "25px" }}>
                Pay
              </button>
            </Col> */}
            </Row>
            {/* <div class="row">
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
          </div> */}
          </div>
          {/* </Card> */}
          <ModalChild
            labelmodal={labelValue}
            passmodalData={handlemodaldData}
            displaymodal={smShow}
            onClose={() => setSmShow(false)}
            selectedFieldData={selectedFieldData}
            fieldValue={fieldValue}
            remarksUpdate={currentRemarks}
          />
        </div>
      </Collapse>
    </form>
  );
}

export default RenewalClu;
