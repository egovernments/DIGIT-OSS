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

const ElectricalPlanScrutiny = (props) => {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [open2, setOpen2] = useState(false);
  const { remarksData, iconStates } = useContext(ScrutinyRemarksContext);
  const { t } = useTranslation();
  const dataIcons = props.dataForIcons;
  const apiResponse = props.apiResponse;
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
    electricInfra: Colors.info,
    electricDistribution: Colors.info,
    electricalCapacity: Colors.info,
    switchingStation: Colors.info,
    LoadSancation: Colors.info,
    selfCenteredDrawings: Colors.info,
    autoCad: Colors.info,
    pdfFormat: Colors.info,
    environmentalClearance: Colors.info,
    verifiedPlan: Colors.info,
    state: Colors.info,
    type: Colors.info,
    lciSignedBy: Colors.info,
    lciNotSigned: Colors.info,
    parmanentAddress: Colors.info,
    addressForCommunication: Colors.info,
    authPerson: Colors.info,
    emailForCommunication: Colors.info,
    purpose: Colors.info,
    totalArea: Colors.info,
    devName: Colors.info,
    developmentPlan: Colors.info,
  });

  const fieldIdList = [
    { label: "LOI Number", key: "loiNumber" },
    { label: "Name ", key: "devName" },
    { label: "Total Area", key: "totalArea" },
    { label: "Purpose Of Licence", key: "purpose" },
    { label: "Development Plan", key: "developmentPlan" },
    { label: "Uploaded Service Plan", key: "selfCertifiedDrawingsFromCharetedEng" },
    { label: "Electrical infrastructure sufficient to cater for the electrical need of the project area", key: "electricInfra" },
    { label: "Provision of the electricity distribution in the project area by the instructions of the HVPNL", key: "electricDistribution" },
    { label: "The capacity of the proposed electrical substation as per the requirement", key: "electricalCapacity" },
    { label: "Provision of 33 Kv switching station for the electrical infrastructure as per the approved layout plan", key: "switchingStation" },
    { label: "Load sanction approval as per the requirement", key: "LoadSancation" },
    {
      label:
        "Self-certified drawings from empaneled/certified architects that conform to the standard approved template as per the TCP layout plan / Site plan",
      key: "selfCenteredDrawings",
    },
    { label: "Environmental Clearance", key: "environmentalClearance" },
    { label: "Electrical plan PDF (OCR Compatible) + GIS format.", key: "pdfFormat" },
    { label: "Electrical plan in AutoCAD (DXF) file.", key: "autoCad" },
    { label: "Certified copy of the Electrical plan verified by a third party.", key: "verifiedPlan" },
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

  console.log("Digit123", apiResponse);

  return (
    <form>
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
          Electrical Plan Service
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Card
          // style={{ width: "126%", border: "5px solid #1266af" }}
          >
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Electrical Plan </h4>
            <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
              <Row>
                <Col className="col-3">
                  {/* <Form.Group as={Col} controlId="formGridLicence"> */}
                  <div>
                    <Form.Label>
                      <h5 className={classes.formLabel}>
                        {`${t("EP_SCRUTINY_LOI_NO")}`}
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
                          setFieldValue(apiResponse !== null ? apiResponse?.loiNumber : null);
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
                {/* <Col md={4} xxl lg="4">
 
            </Col>
            <Col md={4} xxl lg="4">
 
            </Col> */}
              </Row>
              <Row style={{ marginTop: 3 }}>
                <Col className="col-3">
                  <div>
                    <label>
                      <h2>
                        {`${t("EP_SCRUTINY_NAME")}`}
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
                        {`${t("EP_SCRUTINY_DEVELOPMENT_PLAN")}`}
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
                        {`${t("EP_SCRUTINY_PURPOSE_OF_LICENCE")}`}
                        {/* Purpose Of Licence */}
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
                        {`${t("EP_SCRUTINY_TOTAL_AREA")}`}
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
              <Row style={{ marginTop: 3 }}>
                <Col className="col-4">
                  <p className="ml-3">
                    {`${t("EP_SCRUTINY_ELECTRICAL_INFRASTRUCTURE_FOR_ELECTRICAL_NEED")}`}
                    {/* Electrical infrastructure sufficient to cater for the electrical need of the project area <span style={{ color: "red" }}>*</span>{" "} */}
                  </p>
                  <div className="ml-3">
                    <input
                      type="radio"
                      value="Yes"
                      className="mx-2 mt-1"
                      checked={apiResponse?.electricInfra === "Y" ? true : false}
                      // onChange={(e) => handleChange(e.target.value)}
                      //
                      // onClick={handleshow}
                      disabled
                    />
                    <label className="m-0  mx-1" for="Yes">
                      Yes
                    </label>

                    <input type="radio" value="No" className="mx-2 mt-1" checked={apiResponse?.electricInfra === "N" ? true : false} disabled />
                    <label className="m-0 mx-2" for="No">
                      No
                    </label>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.electricInfra,
                      }}
                      onClick={() => {
                        setOpennedModal("electricInfra");
                        setLabelValue("Electrical infrastructure sufficient to cater for the electrical need of the project area"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiResponse !== null ? apiResponse.electricInfra : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </Col>
                <Col className="col-4">
                  <p className="ml-3">
                    {`${t("EP_SCRUTINY_PROVISION_ELECTRICITY_DISTRIBUTION")}`}
                    {/* Provision of the electricity distribution in the project area by the instructions of the HVPNL{" "} */}
                    <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                  </p>
                  <div className="ml-3">
                    <input
                      type="radio"
                      value="Yes"
                      className="mx-2 mt-1"
                      checked={apiResponse?.electricDistribution === "Y" ? true : false}
                      // checked={capacityScrutinyInfo?.designatedDirectors === "Y" ?true:false}
                      // onChange={(e) => handleChange(e.target.value)}
                      //
                      // onClick={handleshow}
                      disabled
                    />
                    <label className="m-0  mx-1" for="Yes">
                      Yes
                    </label>

                    <input
                      type="radio"
                      value="No"
                      className="mx-2 mt-1"
                      checked={apiResponse?.electricDistribution === "N" ? true : false}
                      // checked={capacityScrutinyInfo?.designatedDirectors === "N" ?true:false}
                      // onChange={(e) => handleChange(e.target.value)}
                      //
                      // onClick={handleshow}
                      disabled
                    />
                    <label className="m-0 mx-2" for="No">
                      No
                    </label>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.electricDistribution,
                      }}
                      onClick={() => {
                        setOpennedModal("electricDistribution");
                        setLabelValue("Provision of the electricity distribution in the project area by the instructions of the HVPNL"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiResponse !== null ? apiResponse?.electricDistributionr : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </Col>
                <Col className="col-4">
                  <p className="ml-3">
                    {`${t("EP_SCRUTINY_CAPACITY_OF_PROPOSED_ELECTRICAL_SUBSTATION")}`}
                    {/* The capacity of the proposed electrical substation as per the requirement  */}
                    <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;{" "}
                  </p>
                  <div className="ml-3">
                    <input
                      type="radio"
                      value="Yes"
                      className="mx-2 mt-1"
                      checked={apiResponse?.electricalCapacity === "Y" ? true : false}
                      // checked={capacityScrutinyInfo?.designatedDirectors === "Y" ?true:false}
                      // onChange={(e) => handleChange(e.target.value)}
                      //
                      // onClick={handleshow}
                      disabled
                    />
                    <label className="m-0  mx-1" for="Yes">
                      Yes
                    </label>

                    <input type="radio" value="No" className="mx-2 mt-1" checked={apiResponse?.electricalCapacity === "N" ? true : false} disabled />
                    <label className="m-0 mx-2" for="No">
                      No
                    </label>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.electricalCapacity,
                      }}
                      onClick={() => {
                        setOpennedModal("electricalCapacity");
                        setLabelValue("The capacity of the proposed electrical substation as per the requirement"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiResponse !== null ? apiResponse.electricalCapacity : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="col-4">
                  <p className="ml-3">
                    {`${t("EP_SCRUTINY_PROVISION_OF_33KV_SWITCHING_STATION")}`}
                    {/* Provision of 33 Kv switching station for the electrical infrastructure as per the approved layout plan{" "} */}
                    <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;{" "}
                  </p>
                  <div className="ml-3">
                    <input
                      type="radio"
                      value="Yes"
                      className="mx-2 mt-1"
                      checked={apiResponse?.switchingStation === "Y" ? true : false}
                      // checked={capacityScrutinyInfo?.designatedDirectors === "Y" ?true:false}
                      // onChange={(e) => handleChange(e.target.value)}
                      //
                      // onClick={handleshow}
                      disabled
                    />
                    <label className="m-0  mx-1" for="Yes">
                      Yes
                    </label>

                    <input
                      type="radio"
                      value="No"
                      className="mx-2 mt-1"
                      checked={apiResponse?.switchingStation === "N" ? true : false}
                      // checked={capacityScrutinyInfo?.designatedDirectors === "N" ?true:false}
                      // onChange={(e) => handleChange(e.target.value)}
                      //
                      // onClick={handleshow}
                      disabled
                    />
                    {/* <label className="m-0 mx-2" for="No">No</label>
                  <input type="radio" value="Yes" checked={apiResponse?.switchingStation  === "true" ? true : false}  disabled />
                <label className="m-0  mx-1" for="Yes">Yes</label>
                <input type="radio" value="No"  checked={apiResponse?.switchingStation  === "false" ? true : false} disabled />
                <label className="m-0 mx-2" for="No">No</label> */}

                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.switchingStation,
                      }}
                      onClick={() => {
                        setOpennedModal("switchingStation");
                        setLabelValue("Provision of 33 Kv switching station for the electrical infrastructure as per the approved layout plan"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiResponse !== null ? apiResponse.switchingStation : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </Col>
                <Col className="col-4">
                  <p className="ml-3">
                    {`${t("EP_SCRUTINY_LAND_SANCTION_APPROVAL")}`}
                    {/* Load sanction approval as per the requirement  */}
                    <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                  </p>
                  <div className="ml-3">
                    <input
                      type="radio"
                      value="Yes"
                      className="mx-2 mt-1"
                      checked={apiResponse?.LoadSancation === "Y" ? true : false}
                      // checked={capacityScrutinyInfo?.designatedDirectors === "Y" ?true:false}
                      // onChange={(e) => handleChange(e.target.value)}
                      //
                      // onClick={handleshow}
                      disabled
                    />
                    <label className="m-0  mx-1" for="Yes">
                      Yes
                    </label>

                    <input
                      type="radio"
                      value="No"
                      className="mx-2 mt-1"
                      checked={apiResponse?.LoadSancation === "N" ? true : false}
                      // checked={capacityScrutinyInfo?.designatedDirectors === "N" ?true:false}
                      // onChange={(e) => handleChange(e.target.value)}
                      //
                      // onClick={handleshow}
                      disabled
                    />
                    <label className="m-0 mx-2" for="No">
                      No
                    </label>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.LoadSancation,
                      }}
                      onClick={() => {
                        setOpennedModal("LoadSancation");
                        setLabelValue("Load sanction approval as per the requirement"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiResponse !== null ? apiResponse.LoadSancation : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </Col>
                {/* <Col className="ms-auto" md={4} xxl lg="4"></Col> */}
              </Row>
              <br></br>
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <td style={{ textAlign: "center" }}>
                      {`${t("EP_SCRUTINY_SR_NO")}`}
                      {/* Sr.No. */}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {`${t("EP_SCRUTINY_TYPE_OF_MAP")}`}
                      {/* Type Of Map/Plan */}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {" "}
                      {`${t("EP_SCRUTINY_ANEXURE")}`}
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
                        {`${t("EP_SCRUTINY_SELF_CERTIFIED_DRAWING-TEMPLATE_AS_PER_TCP")}`}
                        {/* Self-certified drawings from empaneled/certified architects that conform to the standard approved template as per the TCP
                        layout plan / Site plan */}
                      </h2>
                    </td>
                    <td component="th" scope="row">
                      {/* <input type="file" className="form-control" {...register("selfCenteredDrawings")} /> */}
                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.selfCenteredDrawings)}>
                          <Visibility color="info" className="icon" />
                        </IconButton>
                      </div>

                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.selfCenteredDrawings)}>
                          <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                      </div>
                      <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.selfCenteredDrawings,
                          }}
                          onClick={() => {
                            setOpennedModal("Selfcertified");
                            setLabelValue(
                              "Self-certified drawings from empaneled/certified architects that conform to the standard approved template as per the TCP layout plan / Site plan"
                            ),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(apiResponse !== null ? apiResponse.selfCenteredDrawings : null);
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
                        {`${t("EP_SCRUTINY_ENVIRONMENT_CLEARANCE")}`}
                        {/* Environmental Clearance. */}
                      </h2>
                    </td>
                    <td component="th" scope="row">
                      {/* <input type="file" className="form-control" {...register("environmentalClearance")} /> */}
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
                            color: fieldIconColors.environmentalClearance,
                          }}
                          onClick={() => {
                            setOpennedModal("environmentalClearance");
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
                        {`${t("EP_SCRUTINY_ELECTRICAL_PLAN_PDF")}`}
                        {/* Electrical plan PDF (OCR Compatible) + GIS format. */}
                      </h2>
                    </td>
                    <td component="th" scope="row">
                      {/* <input type="file" className="form-control" {...register("pdfFormat")} /> */}
                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.pdfFormat)}>
                          <Visibility color="info" className="icon" />
                        </IconButton>
                      </div>

                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.pdfFormat)}>
                          <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                      </div>
                      <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.pdfFormat,
                          }}
                          onClick={() => {
                            setOpennedModal("pdfFormat");
                            setLabelValue("Electrical plan PDF (OCR Compatible) + GIS format."),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(apiResponse !== null ? apiResponse?.pdfFormat : null);
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
                        {`${t("EP_SCRUTINY_AUTOCAD_FILE")}`}
                        {/* Electrical plan in AutoCAD (DXF) file. */}
                      </h2>
                    </td>
                    <td component="th" scope="row">
                      {/* <input type="file" className="form-control" {...register("autoCad")} /> */}
                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.autoCad)}>
                          <Visibility color="info" className="icon" />
                        </IconButton>
                      </div>

                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.autoCad)}>
                          <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                      </div>
                      <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.autoCad,
                          }}
                          onClick={() => {
                            setOpennedModal("autoCad");
                            setLabelValue("Electrical plan in AutoCAD (DXF) file."),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(apiResponse !== null ? apiResponse?.autoCad : null);
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
                        {`${t("EP_SCRUTINY_CERTIFIED_COPY_VERIFIED_THIRD_PARTY")}`}
                        {/* Certified copy of the Electrical plan verified by a third party. */}
                      </h2>
                    </td>
                    <td component="th" scope="row">
                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.verifiedPlan)}>
                          <Visibility color="info" className="icon" />
                        </IconButton>
                      </div>

                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={() => getDocShareholding(apiResponse?.verifiedPlan)}>
                          <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                      </div>
                      <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.verifiedPlan,
                          }}
                          onClick={() => {
                            setOpennedModal("verifiedPlan");
                            setLabelValue("Certified copy of the plan verified by a third party"),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(apiResponse !== null ? apiResponse?.verifiedPlan : null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </div>
            </Card>
          </Card>
        </div>
      </Collapse>
    </form>
  );
};

export default ElectricalPlanScrutiny;
