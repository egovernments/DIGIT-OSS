import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
// import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import FileDownload from "@mui/icons-material/FileDownload";
import Visibility from "@mui/icons-material/Visibility";
import FileDownload from "@mui/icons-material/FileDownload";
// import { getDocShareholding } from "../ScrutinyDevelopment/docview.helper";
import ModalChild from "../Remarks/ModalChild/";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import "../css/personalInfoChild.style.js";
import { useStyles } from "../css/personalInfoChild.style.js";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Collapse from "react-bootstrap/Collapse";

const ServicePlanService = () => {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [open2, setOpen2] = useState(false);

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({});

  const servicePlan = (data) => console.log(data);

  const classes = useStyles();
  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    approved: "#09cb3d",
    disapproved: "#ff0000",
    info: "#FFB602",
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
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("");
  const [fieldIconColors, setFieldIconColors] = useState({
    loiNO: Colors.info,
    UploadedYN: Colors.info,
    Undertaking: Colors.info,
    Selfcertified: Colors.info,
    environmental: Colors.info,
    template: Colors.info,
    certified: Colors.info,
    AutoCAD: Colors.info,
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

  const fieldIdList = [
    { label: "LOI Number", key: "loiNO" },
    { label: "Uploaded Service Plan", key: "UploadedYN" },
    { label: "Undertaking Mobile No", key: "Undertaking" },
    { label: "Self-certified drawings from empanelled/certified architects that conform to the standard approved template.", key: "Selfcertified" },
    { label: "Environmental Clearance.", key: "environmental" },
    { label: "PDF (OCR Compatible) + GIS format (shapefile as per the template uploaded on the department website).", key: "template" },
    { label: "Certified copy of the plan verified by a third party", key: "certified" },
    { label: "AutoCAD (DXF) file.", key: "AutoCAD" },
  ];

  return (
    <form onSubmit={handleSubmit(servicePlan)}>
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
          Service Plan
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Card
          //   style={{ width: "126%", border: "5px solid #1266af" }}
          >
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Service Plan </h4>
            <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
              <Row>
                <Col className="col-4">
                  {/* <Form.Group as={Col} controlId="formGridLicence"> */}
                  <div>
                    <Form.Label>
                      <h5 className={classes.formLabel}>LOI Number &nbsp;</h5>
                    </Form.Label>
                    <span className={classes.required}>*</span> &nbsp;&nbsp;
                  </div>
                  <div className={classes.fieldContainer}>
                    <Form.Control className={classes.formControl} placeholder="" disabled></Form.Control>

                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.loiNO,
                      }}
                      onClick={() => {
                        setOpennedModal("LOI Number");
                        setLabelValue("LOI Number"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                      }}
                    ></ReportProblemIcon>
                    <ModalChild
                      labelmodal={labelValue}
                      passmodalData={handlemodaldData}
                      displaymodal={smShow}
                      onClose={() => setSmShow(false)}
                      selectedFieldData={selectedFieldData}
                      fieldValue={fieldValue}
                      remarksUpdate={currentRemarks}
                    ></ModalChild>
                  </div>
                  {/* </Form.Group> */}
                </Col>
                <Col className="col-4">
                  <Form.Label
                  // placeholder={personalinfo !== null ? personalinfo.authorizedDeveloper : null}
                  >
                    <div>
                      <label>
                        <h2 data-toggle="tooltip" data-placement="top" title=" Is the uploaded Service Plan in accordance to the Standard designs?">
                          Uploaded Service Plan <span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                    </div>

                    <div className="d-flex flex-row">
                      <input
                        type="radio"
                        disabled
                        value="Yes"
                        //  checked={landScheduleData?.licenseApplied === "Y" ? true : false}
                      />
                      <label className="m-0  mx-2" for="Yes">
                        Yes
                      </label>
                      <input
                        type="radio"
                        disabled
                        value="No"
                        //  checked={landScheduleData?.licenseApplied === "N" ? true : false}
                      />
                      <label className="m-0 mx-2" for="No">
                        No
                      </label>
                      {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                      {/* <ReportProblemIcon
                      style={{
                        color: fieldIconColors.licenceApplied
                      }}
                      onClick={() => {
                        setLabelValue("Whether licence applied for additional area"),
                          setOpennedModal("licenceApplied")
                        setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(landScheduleData?.licenseApplied === "Y" ? "Yes" : landScheduleData?.licenseApplied === "N" ? "No" : null);
                      }}
                    ></ReportProblemIcon> */}
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.UploadedYN,
                        }}
                        onClick={() => {
                          setOpennedModal("Uploaded Service Plan");
                          setLabelValue("Uploaded Service Plan"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </Form.Label>
                </Col>
                <Col className="col-4">
                  <Form.Label
                  // placeholder={personalinfo !== null ? personalinfo.authorizedDeveloper : null}
                  >
                    <div>
                      <label>
                        <h2>Undertaking</h2>
                      </label>
                    </div>

                    <div className="d-flex flex-row">
                      <input
                        type="radio"
                        disabled
                        value="Yes"
                        //  checked={landScheduleData?.licenseApplied === "Y" ? true : false}
                      />
                      <label className="m-0  mx-2" for="Yes">
                        Yes
                      </label>
                      <input
                        type="radio"
                        disabled
                        value="No"
                        //  checked={landScheduleData?.licenseApplied === "N" ? true : false}
                      />
                      <label className="m-0 mx-2" for="No">
                        No
                      </label>
                      {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                      {/* <ReportProblemIcon
                      style={{
                        color: fieldIconColors.licenceApplied
                      }}
                      onClick={() => {
                        setLabelValue("Whether licence applied for additional area"),
                          setOpennedModal("licenceApplied")
                        setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(landScheduleData?.licenseApplied === "Y" ? "Yes" : landScheduleData?.licenseApplied === "N" ? "No" : null);
                      }}
                    ></ReportProblemIcon> */}
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.Undertaking,
                        }}
                        onClick={() => {
                          setOpennedModal("Undertaking");
                          setLabelValue("Undertaking"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </Form.Label>
                </Col>
              </Row>
              <br></br>
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <td style={{ textAlign: "center" }}> Sr.No.</td>
                    <td style={{ textAlign: "center" }}>Type Of Map/Plan</td>
                    <td style={{ textAlign: "center" }}>Annexure</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">1.</p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <h2>Self-certified drawings from empanelled/certified architects that conform to the standard approved template.</h2>
                    </td>
                    <td component="th" scope="row">
                      <div className="btn btn-sm col-md-4">
                        {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                        <Visibility color="info" className="icon" />
                        {/* </IconButton> */}
                      </div>

                      <div className="btn btn-sm col-md-4">
                        {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                        <FileDownload color="primary" className="mx-1" />
                        {/* </IconButton> */}
                      </div>
                      <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.Selfcertified,
                          }}
                          onClick={() => {
                            setOpennedModal(
                              "Self-certified drawings from empanelled/certified architects that conform to the standard approved template."
                            );
                            setLabelValue(
                              "Self-certified drawings from empanelled/certified architects that conform to the standard approved template."
                            ),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">2.</p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <h2>Environmental Clearance.</h2>
                    </td>
                    <td component="th" scope="row">
                      {/* <input
                    type="file"
                    className="form-control"
                    {...register("environmentalClearance")}
                    onChange1={(e) => setFile({ file: e.target.files[0] })}
                  /> */}
                      <div className="btn btn-sm col-md-4">
                        {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                        <Visibility color="info" className="icon" />
                        {/* </IconButton> */}
                      </div>

                      <div className="btn btn-sm col-md-4">
                        {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                        <FileDownload color="primary" className="mx-1" />
                        {/* </IconButton> */}
                      </div>
                      <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.environmental,
                          }}
                          onClick={() => {
                            setOpennedModal("Environmental Clearance.");
                            setLabelValue("Environmental Clearance."),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">3.</p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <h2>PDF (OCR Compatible) + GIS format (shapefile as per the template uploaded on the department website).</h2>
                    </td>
                    <td component="th" scope="row">
                      <div className="btn btn-sm col-md-4">
                        {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                        <Visibility color="info" className="icon" />
                        {/* </IconButton> */}
                      </div>

                      <div className="btn btn-sm col-md-4">
                        {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                        <FileDownload color="primary" className="mx-1" />
                        {/* </IconButton> */}
                      </div>
                      <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.template,
                          }}
                          onClick={() => {
                            setOpennedModal("PDF (OCR Compatible) + GIS format (shapefile as per the template uploaded on the department website).");
                            setLabelValue("PDF (OCR Compatible) + GIS format (shapefile as per the template uploaded on the department website)."),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">4.</p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <h2>AutoCAD (DXF) file.</h2>
                    </td>
                    <td component="th" scope="row">
                      <div className="btn btn-sm col-md-4">
                        {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                        <Visibility color="info" className="icon" />
                        {/* </IconButton> */}
                      </div>

                      <div className="btn btn-sm col-md-4">
                        {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                        <FileDownload color="primary" className="mx-1" />
                        {/* </IconButton> */}
                      </div>
                      <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.AutoCAD,
                          }}
                          onClick={() => {
                            setOpennedModal("AutoCAD (DXF) file.");
                            setLabelValue("AutoCAD (DXF) file."),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">5.</p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <h2>Certified copy of the plan verified by a third party.</h2>
                    </td>
                    <td component="th" scope="row">
                      <div className="btn btn-sm col-md-4">
                        {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                        <Visibility color="info" className="icon" />
                        {/* </IconButton> */}
                      </div>

                      <div className="btn btn-sm col-md-4">
                        {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                        <FileDownload color="primary" className="mx-1" />
                        {/* </IconButton> */}
                      </div>
                      <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.certified,
                          }}
                          onClick={() => {
                            setOpennedModal("Certified copy of the plan verified by a third party");
                            setLabelValue("Certified copy of the plan verified by a third party"),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </div>

              {/* <div class="row">
            <div class="col-sm-12 text-right">
              <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                Submit
              </button>
            </div>
          </div> */}
            </Card>
          </Card>
        </div>
      </Collapse>
    </form>
  );
};

export default ServicePlanService;
