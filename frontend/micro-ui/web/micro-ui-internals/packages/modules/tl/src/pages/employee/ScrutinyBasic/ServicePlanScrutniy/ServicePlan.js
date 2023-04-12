import React, { useState, useEffect, useContext } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
// import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import FileDownload from "@mui/icons-material/FileDownload";
import Visibility from "@mui/icons-material/Visibility";
import FileDownload from "@mui/icons-material/FileDownload";
import { getDocShareholding } from "../ScrutinyDevelopment/docview.helper";
import ModalChild from "../Remarks/ModalChild/";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import "../css/personalInfoChild.style.js";
import { useStyles } from "../css/personalInfoChild.style.js";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Collapse from "react-bootstrap/Collapse";
import { IconButton } from "@mui/material";
import { ScrutinyRemarksContext } from "../../../../../context/remarks-data-context";
import { useTranslation } from "react-i18next";

const ServicePlanService = (props) => {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [open2, setOpen2] = useState(false);
  const { remarksData, iconStates } = useContext(ScrutinyRemarksContext);

  const dataIcons = props.dataForIcons;
  const apiResponse = props.apiResponse;
  const idwDataTreade = props.idwDataTreade;
  const edcDataTreade = props.edcDataTreade;
  const { t } = useTranslation();
  //  apiResponse,refreshScrutinyData, applicationNumber,iconStates
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
    conditional: "#2874A6",
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
    loiNumber: Colors.info,
    selfCertifiedDrawingsFromCharetedEng: Colors.info,
    Undertaking: Colors.info,
    Selfcertified: Colors.info,
    environmental: Colors.info,
    template: Colors.info,
    certified: Colors.info,
    AutoCAD: Colors.info,
    purpose: Colors.info,
    totalArea: Colors.info,
    devName: Colors.info,
    developmentPlan: Colors.info,
    uploaded: Colors.info,
    Revised: Colors.info,
    // district: Colors.info,
    // state: Colors.info,
    // type: Colors.info,
    // lciSignedBy: Colors.info,
    // lciNotSigned: Colors.info,
    // parmanentAddress: Colors.info,
    // addressForCommunication: Colors.info,
    // authPerson: Colors.info,
    // emailForCommunication: Colors.info,
  });

  const fieldIdList = [
    { label: "LOI Number", key: "loiNumber" },
    { label: "Name", key: "devName" },
    { label: "Total Area", key: "totalArea" },
    { label: "Purpose Of Licence", key: "purpose" },
    { label: "Development Plan", key: "developmentPlan" },
    { label: "Uploaded Service Plan", key: "selfCertifiedDrawingsFromCharetedEng" },
    { label: "Undertaking Mobile No", key: "Undertaking" },
    {
      label:
        "Self-certified drawings from empanelled/certified architects that conform to the standard approved template. as per the TCP layout plan / Site plan.",
      key: "Selfcertified",
    },
    { label: "Environmental Clearance.", key: "environmental" },
    { label: "Service plan in PDF (OCR Compatible) + GIS format.", key: "template" },
    { label: "Certified copy of the Service plan verified by a third party", key: "certified" },
    { label: "Service plan in AutoCAD (DXF) file", key: "AutoCAD" },

    { label: "Previously Uploaded layout plan (call)", key: "Uploaded" },
    { label: "Upload the Revised layout plan", key: "Revised" },
    { label: "Service plan in AutoCAD (DXF) file", key: "AutoCAD" },
    { label: "Service plan in AutoCAD (DXF) file", key: "AutoCAD" },
    { label: "Service plan in AutoCAD (DXF) file", key: "AutoCAD" },
    { label: "Service plan in AutoCAD (DXF) file", key: "AutoCAD" },
  ];

  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (dataIcons !== null && dataIcons !== undefined) {
        console.log("color method called");
        const fieldPresent = dataIcons.egScrutiny.filter((ele) => ele.fieldIdL === item.label);
        console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
        if (fieldPresent && fieldPresent.length) {
          console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
          tempFieldColorState = {
            ...tempFieldColorState,
            [item.key]:
              fieldPresent[0].isApproved === "approved"
                ? Colors.approved
                : fieldPresent[0].isApproved === "disapproved"
                ? Colors.disapproved
                : fieldPresent[0].isApproved === "conditional"
                ? Colors.conditional
                : Colors.info,
          };
        }
      }
    });

    setFieldIconColors(tempFieldColorState);
  };

  useEffect(() => {
    getColorofFieldIcon();
    console.log("repeating1...");
  }, [dataIcons]);

  useEffect(() => {
    if (labelValue) {
      const fieldPresent = dataIcons.egScrutiny.filter((ele) => ele.fieldIdL === labelValue);
      setSelectedFieldData(fieldPresent[0]);
    } else {
      setSelectedFieldData(null);
    }
  }, [labelValue]);

  console.log("dataEDC", idwDataTreade);

  console.log("Digit123", apiResponse);
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
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Service Plan</h4>
            <h4 style={{ fontSize: "20px", textAlign: "left" }}>
              EDC : {edcDataTreade} &nbsp;&nbsp; IDW : {idwDataTreade}
            </h4>
            <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
              <Row>
                <Col className="col-3">
                  {/* <Form.Group as={Col} controlId="formGridLicence"> */}
                  <div>
                    <Form.Label>
                      <h5 className={classes.formLabel}>
                        {`${t("SP_SCRUTINY_LOI_NUMBER")}`}
                        {/* LOI Number  */}
                        &nbsp;
                      </h5>
                    </Form.Label>
                    <span className={classes.required}>*</span> &nbsp;&nbsp;
                  </div>
                  <div className={classes.fieldContainer}>
                    <Form.Control className={classes.formControl} placeholder={apiResponse?.loiNumber} disabled></Form.Control>

                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.loiNumber,
                      }}
                      onClick={() => {
                        setOpennedModal("loiNumber");
                        setLabelValue("LOI Number"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiResponse !== null ? apiResponse.loiNumber : null);
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

                {/* <Col className="col-4">
                  <Form.Label>
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
                         checked={apiResponse?.selfCertifiedDrawingsFromCharetedEng === "Y" ? true : false}
                      />
                      <label className="m-0  mx-2" for="Yes">
                        Yes
                      </label>
                      <input
                        type="radio"
                        disabled
                        value="No"
                         checked={apiResponse?.selfCertifiedDrawingsFromCharetedEng === "N" ? true : false}
                      />
                      <label className="m-0 mx-2" for="No">
                        No
                      </label>
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.selfCertifiedDrawingsFromCharetedEng,
                        }}
                        onClick={() => {
                          setOpennedModal("selfCertifiedDrawingsFromCharetedEng");
                          setLabelValue("Uploaded Service Plan"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(apiResponse !== null ? apiResponse.selfCertifiedDrawingsFromCharetedEng : null);
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </Form.Label>
                </Col> */}
                {/* <Col className="col-4">
                  <Form.Label
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
                         checked={apiResponse?.undertaking === "Y" ? true : false}
                      />
                      <label className="m-0  mx-2" for="Yes">
                        Yes
                      </label>
                      <input
                        type="radio"
                        disabled
                        value="No"
                         checked={apiResponse?.undertaking === "N" ? true : false}
                      />
                      <label className="m-0 mx-2" for="No">
                        No 
                      </label>
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.Undertaking,
                        }}
                        onClick={() => {
                          setOpennedModal("Undertaking");
                          setLabelValue("Undertaking"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(apiResponse !== null ? apiResponse.undertaking : null);
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </Form.Label>
                </Col> */}
              </Row>
              <Row>
                <Col className="col-3">
                  <div>
                    <label>
                      <h2>
                        {`${t("SP_SCRUTINY_NAME")}`}
                        {/* Name */}
                      </h2>
                    </label>
                  </div>
                  {/* <input
                type="string"
                className="form-control"
                {...register("devName")}
                onChange={(e) => setDevName(e.target.value)}
                value={devName}
                disabled
              />  */}
                  <div className={classes.fieldContainer}>
                    <Form.Control className={classes.formControl} placeholder={apiResponse?.devName} disabled></Form.Control>

                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.devName,
                      }}
                      onClick={() => {
                        setOpennedModal("devName");
                        setLabelValue("Name"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiResponse !== null ? apiResponse.devName : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </Col>
                <Col className="col-3">
                  <div>
                    <label>
                      <h2>
                        {`${t("SP_SCRUTINY_DEVELOPMENT_PLAN")}`}
                        {/* Development Plan */}
                      </h2>
                    </label>
                  </div>
                  {/* <input
                type="string"
                className="form-control"
                {...register("developmentPlan")}
                onChange={(e) => setDevelopmentPlan(e.target.value)}
                value={developmentPlan}
                disabled
              /> */}
                  <div className={classes.fieldContainer}>
                    <Form.Control className={classes.formControl} placeholder={apiResponse?.developmentPlan} disabled></Form.Control>

                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.developmentPlan,
                      }}
                      onClick={() => {
                        setOpennedModal("developmentPlan");
                        setLabelValue("Development Plan"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiResponse !== null ? apiResponse.developmentPlan : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </Col>
                <Col className="col-3">
                  <div>
                    <label>
                      <h2>
                        {`${t("SP_SCRUTINY_PURPOSE_LICENCE")}`}
                        {/* Purpose Of Licence  */}
                      </h2>
                    </label>
                  </div>
                  {/* <input
                type="string"
                className="form-control"
                {...register("purpose")}
                onChange={(e) => setPurpose(e.target.value)}
                value={purpose}
                disabled
              /> */}
                  <div className={classes.fieldContainer}>
                    <Form.Control className={classes.formControl} placeholder={apiResponse?.purpose} disabled></Form.Control>

                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.purpose,
                      }}
                      onClick={() => {
                        setOpennedModal("purpose");
                        setLabelValue("Purpose Of Licence"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiResponse !== null ? apiResponse.purpose : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </Col>
                <Col className="col-3">
                  <div>
                    <label>
                      <h2>
                        {`${t("SP_SCRUTINY_TOTAL_AREA")}`}
                        {/* Total Area */}
                      </h2>
                    </label>
                  </div>
                  {/* <input
                type="string"
                className="form-control"
                {...register("totalArea")}
                onChange={(e) => setTotalArea(e.target.value)}
                value={totalArea}
                disabled
              /> */}
                  <div className={classes.fieldContainer}>
                    <Form.Control className={classes.formControl} placeholder={apiResponse?.totalArea} disabled></Form.Control>

                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.totalArea,
                      }}
                      onClick={() => {
                        setOpennedModal("totalArea");
                        setLabelValue("Total Area"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiResponse !== null ? apiResponse.totalArea : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </Col>
              </Row>
              <br></br>
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <td style={{ textAlign: "center" }}>
                      {" "}
                      {`${t("SP_SCRUTINY_SR_NO")}`}
                      {/* Sr.No. */}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {`${t("SP_SCRUTINY_TYPE_OF_MAP")}`}
                      {/* Type Of Map/Plan */}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {`${t("SP_SCRUTINY_ANNEXURE")}`}
                      {/* Annexure */}
                    </td>
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
                      <h2>
                        {`${t("SP_SCRUTINY_SELF_CERTIFIED_DRAWING_CERTIFIED_ARCHITECT")}`}
                        {/* Self-certified drawings from empanelled/certified architects that conform to the standard approved template. as per the TCP layout plan / Site plan. */}
                      </h2>
                    </td>
                    <td component="th" scope="row">
                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.selfCertifiedDrawingFromEmpaneledDoc)}>
                          <Visibility color="info" className="icon" />
                        </IconButton>
                      </div>

                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.selfCertifiedDrawingFromEmpaneledDoc)}>
                          <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                      </div>
                      <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.Selfcertified,
                          }}
                          onClick={() => {
                            setOpennedModal("Selfcertified");
                            setLabelValue(
                              "Self-certified drawings from empanelled/certified architects that conform to the standard approved template. as per the TCP layout plan / Site plan."
                            ),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(apiResponse !== null ? apiResponse?.selfCertifiedDrawingFromEmpaneledDoc : null);
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
                      <h2>
                        {`${t("SP_SCRUTINY_ENVIRONMENT_CLEARANCE")}`}
                        {/* Environmental Clearance. */}
                      </h2>
                    </td>
                    <td component="th" scope="row">
                      {/* <input
                    type="file"
                    className="form-control"
                    {...register("environmentalClearance")}
                    onChange1={(e) => setFile({ file: e.target.files[0] })}
                  /> */}
                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.environmentalClearance)}>
                          <Visibility color="info" className="icon" />
                        </IconButton>
                      </div>

                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.environmentalClearance)}>
                          <FileDownload color="primary" className="mx-1" />
                        </IconButton>
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
                              setFieldValue(apiResponse !== null ? apiResponse?.environmentalClearance : null);
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
                      <h2>
                        {`${t("SP_SCRUTINY_SERVICE_PLAN_PDF_FORMAT")}`}
                        {/* Service plan in PDF (OCR Compatible) + GIS format. */}
                      </h2>
                    </td>
                    <td component="th" scope="row">
                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.shapeFileAsPerTemplate)}>
                          <Visibility color="info" className="icon" />
                        </IconButton>
                      </div>

                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.shapeFileAsPerTemplate)}>
                          <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                      </div>
                      <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.template,
                          }}
                          onClick={() => {
                            setOpennedModal("template");
                            setLabelValue("Service plan in PDF (OCR Compatible) + GIS format."),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(apiResponse !== null ? apiResponse?.shapeFileAsPerTemplate : null);
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
                      <h2>
                        {`${t("SP_SCRUTINY_AUTOCAD_FILE")}`}
                        {/* Service plan in AutoCAD (DXF) file */}
                      </h2>
                    </td>
                    <td component="th" scope="row">
                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.autoCadFile)}>
                          <Visibility color="info" className="icon" />
                        </IconButton>
                      </div>

                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.autoCadFile)}>
                          <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                      </div>
                      <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.AutoCAD,
                          }}
                          onClick={() => {
                            setOpennedModal("AutoCAD");
                            setLabelValue("Service plan in AutoCAD (DXF) file"),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(apiResponse !== null ? apiResponse?.autoCadFile : null);
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
                      <h2>
                        {`${t("SP_SCRUTINY_CERTIFIED_COPY_VERIFIED_THIRD_PARTY")}`}
                        {/* Certified copy of the Service plan verified by a third party. */}
                      </h2>
                    </td>
                    <td component="th" scope="row">
                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.certifieadCopyOfThePlan)}>
                          <Visibility color="info" className="icon" />
                        </IconButton>
                      </div>

                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.certifieadCopyOfThePlan)}>
                          <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                      </div>
                      <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.certified,
                          }}
                          onClick={() => {
                            setOpennedModal("certified");
                            setLabelValue("Certified copy of the Service plan verified by a third party"),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(apiResponse !== null ? apiResponse?.certifieadCopyOfThePlan : null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </td>
                  </tr>
                </tbody>
                {(apiResponse?.purpose === "DDJAY_APHP" ||
                  apiResponse?.purpose === "RPL" ||
                  apiResponse?.purpose === "NILP" ||
                  apiResponse?.purpose === "NILPC" ||
                  apiResponse?.purpose === "IPA" ||
                  apiResponse?.purpose === "CPRS" ||
                  apiResponse?.purpose === "CICS") && (
                  <tbody>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p className="mb-2">6.</p>
                        </div>
                      </td>
                      <td component="th" scope="row">
                        <h2>
                          {`${t("SP_SCRUTINY_PREVIOUSLY_UPDATED_LAYOUT_PLAN")}`}
                          {/* Previously Uploaded layout plan (call) */}
                        </h2>
                        {/* {drawingErr.selfCertifiedDrawingFromEmpaneledDoc ? <p style={{color: 'red'}}>Please upload self-certified drawings from empanelled/certified architects*</p> : " "} */}
                      </td>
                      {/* <td component="th" scope="row">
                  <label for='file-input-1'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="file-input-1"
                    onChange={(e) => getDocumentData(e?.target?.files[0], "selfCertifiedDrawingFromEmpaneledDoc")}
                    style={{display: "none"}}
                  />
                    
                  {fileStoreId?.selfCertifiedDrawingFromEmpaneledDoc ? 
                  <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.selfCertifiedDrawingFromEmpaneledDoc)}>
                    {" "}
                  </VisibilityIcon>
                  : "" }
                  {applicationId && (!fileStoreId?.selfCertifiedDrawingFromEmpaneledDoc) &&
                  <div className="btn btn-sm col-md-4">
                    <IconButton onClick={()=>downloadDocument(selfCertifiedDrawing)}>
                        <FileDownload color="primary" className="mx-1" />
                    </IconButton>
                      <IconButton onClick={()=>viewDocument(selfCertifiedDrawing)}>
                        <VisibilityIcon color="info" className="icon" />
                      </IconButton>
                  </div> 
                  }
                </td> */}
                      <td component="th" scope="row">
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(apiResponse?.certifieadCopyOfThePlan)}>
                            <Visibility color="info" className="icon" />
                          </IconButton>
                        </div>

                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(apiResponse?.certifieadCopyOfThePlan)}>
                            <FileDownload color="primary" className="mx-1" />
                          </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-4">
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.certified,
                            }}
                            onClick={() => {
                              setOpennedModal("Uploaded");
                              setLabelValue("Previously Uploaded layout plan (call)"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiResponse !== null ? apiResponse?.certifieadCopyOfThePlan : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p className="mb-2">7.</p>
                        </div>
                      </td>
                      <td component="th" scope="row">
                        <h2>
                          {`${t("SP_SCRUTINY_UPLOAD_REVISED_LAYOUT_PLAN")}`}
                          {/* Upload the Revised layout plan */}
                        </h2>
                        {/* {drawingErr.environmentalClearance ? <p style={{color: 'red'}}>Please upload environmental clearance drawings*</p> : " "} */}
                      </td>
                      {/* <td component="th" scope="row">
                <label for='file-input-2'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="file-input-2"
                    // {...register("environmentalClearance")}
                    onChange={(e) => getDocumentData(e?.target?.files[0], "environmentalClearance")}
                    style={{display: "none"}}
                  />
                  {fileStoreId?.environmentalClearance ? 
                  <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.environmentalClearance)}>
                    {" "}
                  </VisibilityIcon>
                  : ""}
                   {applicationId && (!fileStoreId?.environmentalClearance) && 
                  <div className="btn btn-sm col-md-4">
                    <IconButton onClick={()=>downloadDocument(environmental)}>
                        <FileDownload color="primary" className="mx-1" />
                    </IconButton>
                      <IconButton onClick={()=>viewDocument(environmental)}>
                        <VisibilityIcon color="info" className="icon" />
                      </IconButton>
                  </div> 
                  }
                </td> */}
                      <td component="th" scope="row">
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(apiResponse?.certifieadCopyOfThePlan)}>
                            <Visibility color="info" className="icon" />
                          </IconButton>
                        </div>

                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(apiResponse?.certifieadCopyOfThePlan)}>
                            <FileDownload color="primary" className="mx-1" />
                          </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-4">
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.certified,
                            }}
                            onClick={() => {
                              setOpennedModal("Revised");
                              setLabelValue("Upload the Revised layout plan"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiResponse !== null ? apiResponse?.certifieadCopyOfThePlan : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p className="mb-2">8.</p>
                        </div>
                      </td>
                      <td component="th" scope="row">
                        <h2>
                          {`${t("SP_SCRUTINY_UPLOAD_DEMARCATION_PLAN_AUTOAD")}`}
                          {/* Upload Demarcation Plan in AutoCAD (DXF) file */}
                        </h2>
                        {/* {drawingErr.shapeFileAsPerTemplate ? <p style={{color: 'red'}}>Please upload service plan pdf and gis format*</p> : " "} */}
                      </td>
                      {/* <td component="th" scope="row">
                <label for='file-input-3'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    // {...register("shapeFileAsPerTemplate")}
                    id="file-input-3"
                    onChange={(e) => getDocumentData(e?.target?.files[0], "shapeFileAsPerTemplate")}
                    style={{display: "none"}}
                  />
                  {fileStoreId?.shapeFileAsPerTemplate ? 
                  <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.shapeFileAsPerTemplate)}>
                    {" "}
                  </VisibilityIcon>
                    : ""}
                   {applicationId && (!fileStoreId?.shapeFileAsPerTemplate) && 
                  <div className="btn btn-sm col-md-4">
                    <IconButton onClick={()=>downloadDocument(gisFormat)}>
                        <FileDownload color="primary" className="mx-1" />
                    </IconButton>
                      <IconButton onClick={()=>viewDocument(gisFormat)}>
                        <VisibilityIcon color="info" className="icon" />
                      </IconButton>
                  </div> 
                  }
                </td> */}
                      <td component="th" scope="row">
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(apiResponse?.certifieadCopyOfThePlan)}>
                            <Visibility color="info" className="icon" />
                          </IconButton>
                        </div>

                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(apiResponse?.certifieadCopyOfThePlan)}>
                            <FileDownload color="primary" className="mx-1" />
                          </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-4">
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.certified,
                            }}
                            onClick={() => {
                              setOpennedModal("certified");
                              setLabelValue("Certified copy of the Service plan verified by a third party"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiResponse !== null ? apiResponse?.certifieadCopyOfThePlan : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p className="mb-2">9.</p>
                        </div>
                      </td>
                      <td component="th" scope="row">
                        <h2>
                          {`${t("SP_SCRUTINY_UPLOAD_DEMARCATION_PLAN_PDF")}`}
                          {/* Upload Demarcation Plan in PDF (OCR Compatible) + GIS format. */}
                        </h2>
                        {/* {drawingErr.autoCadFile ? <p style={{color: 'red'}}>Please upload autocad file*</p> : " "} */}
                      </td>
                      {/* <td component="th" scope="row">
                <label for='file-input-4'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="file-input-4"
                    // {...register("autoCadFile")}
                    onChange={(e) => getDocumentData(e?.target?.files[0], "autoCadFile")}
                    style={{display: "none"}}
                  />
                  {fileStoreId?.autoCadFile ? 
                  <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.autoCadFile)}>
                    {" "}
                  </VisibilityIcon>
                  : "" }
                   {applicationId && (!fileStoreId?.autoCadFile) &&
                  <div className="btn btn-sm col-md-4">
                    <IconButton onClick={()=>downloadDocument(autocad)}>
                        <FileDownload color="primary" className="mx-1" />
                    </IconButton>
                      <IconButton onClick={()=>viewDocument(autocad)}>
                        <VisibilityIcon color="info" className="icon" />
                      </IconButton>
                  </div> 
                  }
                </td> */}
                      <td component="th" scope="row">
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(apiResponse?.certifieadCopyOfThePlan)}>
                            <Visibility color="info" className="icon" />
                          </IconButton>
                        </div>

                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(apiResponse?.certifieadCopyOfThePlan)}>
                            <FileDownload color="primary" className="mx-1" />
                          </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-4">
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.certified,
                            }}
                            onClick={() => {
                              setOpennedModal("certified");
                              setLabelValue("Certified copy of the Service plan verified by a third party"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiResponse !== null ? apiResponse?.certifieadCopyOfThePlan : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p className="mb-2">10.</p>
                        </div>
                      </td>
                      <td component="th" scope="row">
                        <h2>
                          {`${t("SP_SCRUTINY_UPLOAD_EXCEL_LAYOUT_STRUCTURE")}`}
                          {/* Upload Excel of detailed layout structure */}
                        </h2>
                      </td>

                      <td component="th" scope="row">
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(apiResponse?.certifieadCopyOfThePlan)}>
                            <Visibility color="info" className="icon" />
                          </IconButton>
                        </div>

                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(apiResponse?.certifieadCopyOfThePlan)}>
                            <FileDownload color="primary" className="mx-1" />
                          </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-4">
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.certified,
                            }}
                            onClick={() => {
                              setOpennedModal("certified");
                              setLabelValue("Certified copy of the Service plan verified by a third party"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiResponse !== null ? apiResponse?.certifieadCopyOfThePlan : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p className="mb-2">11.</p>
                        </div>
                      </td>
                      <td component="th" scope="row">
                        <h2>
                          {`${t("SP_SCRUTINY_OTHER_RELEVANT_DOCUMENT")}`}
                          {/* Any other relevant document */}
                        </h2>
                      </td>

                      <td component="th" scope="row">
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(apiResponse?.certifieadCopyOfThePlan)}>
                            <Visibility color="info" className="icon" />
                          </IconButton>
                        </div>

                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => getDocShareholding(apiResponse?.certifieadCopyOfThePlan)}>
                            <FileDownload color="primary" className="mx-1" />
                          </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-4">
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.certified,
                            }}
                            onClick={() => {
                              setOpennedModal("certified");
                              setLabelValue("Certified copy of the Service plan verified by a third party"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(apiResponse !== null ? apiResponse?.certifieadCopyOfThePlan : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                )}
              </div>
            </Card>
          </Card>
        </div>
      </Collapse>
    </form>
  );
};

export default ServicePlanService;
