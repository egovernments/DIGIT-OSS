import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import Table from "react-bootstrap/Table";
// import Col from 'react-bootstrap/Col';
// import Row from 'react-bootstrap/Row';
// import InfoIcon from "@mui/icons-material/Info";

import Collapse from "react-bootstrap/Collapse";

import ModalChild from "../Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import RemoveIcon from "@mui/icons-material/Remove";
import { useStyles } from "../css/personalInfoChild.style";
import Visibility from "@mui/icons-material/Visibility";
import FileDownload from "@mui/icons-material/FileDownload";
import { IconButton } from "@mui/material";
import { getDocShareholding } from "../ScrutinyDevelopment/docview.helper";

const LicenseDetailsScrutiny = (props) => {
  const [uncheckedValue, setUncheckedVlue] = useState([]);
  const [checkValue, setCheckedVAlue] = useState([]);
  const [open, setOpen] = useState(false);
  const [smShow, setSmShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const Colors = {
    conditional:"#2874A6",
    approved:"#09cb3d",
    disapproved:"#ff0000",
   
    info:"#FFB602"
  }
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("")

  const [noChecked, setNochecked] = useState(true);
  const [warningOrred, setwarningOrred] = useState("#ffcf33");
  const [color, setColor] = useState({ yes: false, no: false });
  const [labelValue, setLabelValue] = useState("");
  const [modaldData, setmodaldData] = useState({ label: "", Remarks: "" });
  const [isyesOrNochecked, setYesorNochecked] = useState(true);
  const [existingColonizer, setExistingColonizer] = useState();
  const [existingColonizerDetails, setExistingColonizerDetails] = useState({
    name: "",
    mobile: "",
    email: "",
    dob: "",
    pan: "",
    licNo: "",
    licDate: "",
    licValidity: "",
    licPurpose: "",
    aggreementBtw: "",
    boardResolution: ""
  })

  const [fieldIconColors, setFieldIconColors] = useState({
    developerType: Colors.info,
    developerName: Colors.info,
    developerEmail: Colors.info,
    developerMobileNo: Colors.info,
    cinNo: Colors.info,
    companyName: Colors.info,
    dateOfIncorporation: Colors.info,
    regAddress: Colors.info,
    email: Colors.info,
    mobileNo: Colors.info,
    gstNo: Colors.info,
    existingColonizerDoc: Colors.info

  })

  const fieldIdList = [{ label: "Developer's Type", key: "developerType" }, { label: "Developer's Name", key: "developerName" }, { label: "Developer's Email", key: "developerEmail" }, { label: "Developer's Mobile No.", key: "developerMobileNo" }, { label: "CIN No.", key: "cinNo" }, { label: "Company's Name", key: "companyName" }, { label: "Date of Incorporation", key: "dateOfIncorporation" }, { label: "Registered Address", key: "regAddress" }, { label: "Email", key: "email" }, { label: "Mobile No.", key: "mobileNo" }, { label: "GST No.", key: "gstNo" },
{label: "Agreement between the proposed developer and existing colonizer", key: "existingColonizerDoc"}]

  const addInfo = props.addInfo;
  const iconStates = props.iconColorState;
  let user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((e) => e.code) || [];
  const hideRemarks = userRoles.some((item)=>item === "CTP_HR" || item === "CTP_HQ" || item === "DTP_HR" || item === "DTP_HQ")
  const hideRemarksPatwari = userRoles.some((item)=>item ==="Patwari_HQ")

  const classes = useStyles();

  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (iconStates !== null && iconStates !== undefined) {
        console.log("color method called");
        const fieldPresent = iconStates.egScrutiny.filter(ele => (ele.fieldIdL === item.label));
        console.log("filteration value", fieldPresent, fieldPresent[0]?.isApproved);
        if (fieldPresent && fieldPresent.length) {
          console.log("filteration value1", fieldPresent, fieldPresent[0]?.isApproved);
          tempFieldColorState = {...tempFieldColorState,[item.key]:fieldPresent[0].isApproved === "approved" ?Colors.approved: fieldPresent[0].isApproved === "disapproved" ? Colors.disapproved:fieldPresent[0].isApproved === "conditional" ? Colors.conditional:Colors.info}
        }
      }
    })

    setFieldIconColors(tempFieldColorState);

  };


  useEffect(() => {
    getColorofFieldIcon();
    console.log("repeating1...",)
  }, [iconStates])

  useEffect(() => {
    if (labelValue) {
      const fieldPresent = iconStates.egScrutiny.filter(ele => (ele.fieldIdL === labelValue));
      setSelectedFieldData(fieldPresent[0]);
    } else {
      setSelectedFieldData(null);
    }
  }, [labelValue])


  const handlemodaldData = (data) => {
    setSmShow(false);
    console.log("here", openedModal, data);
    if (openedModal && data) {
      setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved })
    }
    setOpennedModal("");
    setLabelValue("");
  };


  const [showhide9, setShowhide9] = useState("0");
  const handleshow9 = (e) => {
    const getshow = e.target.value;
    setShowhide9(getshow);
  };

  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
    props.getRemarkData();
  };

  // console.log("color for the deeloper", developerInputFiledColor);

  return (
    <Form
      ref={props.licenseDetailsInfoRef}
    // style={{
    //   width: "100%",
    //   height: props.heightPersonal,
    //   overflow: "hidden",
    //   marginBottom: 20,
    //   borderColor: "#C3C3C3",
    //   borderStyle: "solid",
    //   borderWidth: 2,
    // }}
    >
      {/* <Alert variant="warning">{messege}</Alert> */}

      <div
        className="collapse-header"
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
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
          - Add Info
        </span>
        {open ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>

      <Collapse in={open}>
        <div id="example-collapse-text" style={{ marginTop: 5, paddingLeft: 5, paddingRight: 5 }}>
          <Form.Group style={{ display: props.displayLicenseDetails, margin: 5 }}>
            <div>
              <Card style={{ margin: 2 }}>
                <div className="card-body">
                  <h5 className={[classes.formLabel, "d-flex flex-row align-items-center"]}>Developer's type <div className="d-flex flex-row align-items-center ml-2">
                    {/* {JSON.stringify(addInfo)} */}
                    <Form.Control
                      className={classes.formControl}
                      placeholder={addInfo?.showDevTypeFields 
                        // === "Individual" ? "Individual" : addInfo?.showDevTypeFields === "Company" ? "Company" : addInfo?.showDevTypeFields === "LLP" ? "LLP" : addInfo?.showDevTypeFields === "04" ? "Society" : ""
                      }
                      disabled
                    ></Form.Control>
                    &nbsp;&nbsp;
                  {/* {JSON.stringify(hideRemarks)}  */}
                    
                    <ReportProblemIcon
                      style={{
                        display: hideRemarks || hideRemarksPatwari ?"none":"block",
                        color: fieldIconColors.developerType
                      }}
                      onClick={() => {
                        setOpennedModal("developerType")
                        setLabelValue("Developer's type"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(addInfo?.showDevTypeFields || null);
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

                  </div></h5>
                  <div className="row">
                    <div className="col-sm-12">
                      {/* <div className="form-group row"> */}
                      <div className="col-sm-4 p-0 pt-1">
                        {/* <Form.Select
                          type="text"
                          placeholder=""

                          onClick={handleshow9}
                          style={{ maxWidth: 200, marginRight: 5, height: 40 }}

                        >
                          <option value="">--Purpose--</option>
                          <option value="01">Individual</option>
                          <option value="02">Company</option>
                          <option value="03">LLP</option>
                          <option value="04">Society</option>
                        </Form.Select>vvvv */}

                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {addInfo?.showDevTypeFields === "Individual"  &&
                <div>
                  <Card style={{ margin: 5 }}>
                    <h5>Developer Details</h5>
                    <Row>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Name &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.name : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.name
                            }}
                            onClick={() => {
                              setOpennedModal("developerName")
                              setLabelValue("Developer's Name"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.name : null);
                            }}
                          ></ReportProblemIcon>



                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Email &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.emailId : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.emailId
                            }}
                            onClick={() => {
                              setOpennedModal("developerEmail")
                              setLabelValue("Developer's Email"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.emailId : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Mobile No. &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.mobileNumberUser : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.mobileNumberUser
                            }}
                            onClick={() => {
                              setOpennedModal("developerMobileNo")
                              setLabelValue("Developer's Mobile No."),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.mobileNumberUser : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </div>
              }

              {addInfo?.showDevTypeFields === "Company"  &&
                <div>
                  <Card style={{ margin: 5 }}>
                    <h5>Developer Details</h5>
                    <Row>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5>CIN Number &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.cin_Number : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.cinNo
                            }}
                            onClick={() => {
                              setOpennedModal("cinNo")
                              setLabelValue("CIN No."),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.cin_Number : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Company Name &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.companyName : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.companyName
                            }}
                            onClick={() => {
                              setOpennedModal("companyName")
                              setLabelValue("Company's Name"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.companyName : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Date of Incorporation &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.incorporationDate : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.dateOfIncorporation
                            }}
                            onClick={() => {
                              setOpennedModal("dateOfIncorporation")
                              setLabelValue("Date of Incorporation"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.incorporationDate : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Registered Address &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.registeredAddress : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.regAddress
                            }}
                            onClick={() => {
                              setOpennedModal("regAddress")
                              setLabelValue("Registered Address"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.registeredAddress : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Email &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.email : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.email
                            }}
                            onClick={() => {
                              setOpennedModal("email")
                              setLabelValue("Email"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.email : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Mobile No. &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.registeredContactNo : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.mobileNo
                            }}
                            onClick={() => {
                              setOpennedModal("mobileNo")
                              setLabelValue("Mobile No."),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.registeredContactNo : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>GST No. &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.gst_Number : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.gstNo
                            }}
                            onClick={() => {
                              setOpennedModal("gstNo")
                              setLabelValue("GST No."),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.gst_Number : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                    </Row>
                  </Card>



                  <Card style={{ margin: 5 }}>
                  <h5 className="card-title fw-bold">Shareholding Patterns</h5>
                    <div className="table-bd">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Sr. No</th>
                            <th>Name</th>
                            <th>Designition</th>
                            <th>Percentage</th>
                            <th>View PDF</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            addInfo?.shareHoldingPatterens?.map((item, index) => (

                              <tr>
                                <td>{item?.serialNumber || index + 1}</td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.name} disabled></Form.Control>
                                </td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.designition} disabled></Form.Control>
                                </td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.percentage} disabled></Form.Control>
                                </td>
                                <td>
                                  <div className="row">
                                    {/* <button className="btn btn-sm col-md-6" onClick={()=>getDocShareholding(item?.uploadPdf)} > */}
                                    <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                      <Visibility color="info" className="icon" /></IconButton>
                                      </div>
                                    {/* </button> */}
                                    {/* <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                      <FileDownload color="primary" /> */}
                                      <div className="btn btn-sm col-md-6">
                                      <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                        </div>
                                    {/* </button> */}
                                  </div>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </Card>
                  {/* {showDevTypeFields === "02" && (
                  <div className="card mb-3">
                    <h5 className="card-title fw-bold">Directors Information</h5>
                    <div className="card-body"> */}
                    <Card style={{ margin:5}}>
                    <h5 className="card-title fw-bold">Directors Information</h5>
               
                  <div className="table-bd">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr. No</th>
                          <th>DIN Number</th>
                          <th>Name</th>
                          <th>Contact Number</th>
                          <th>View PDF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          addInfo?.DirectorsInformation?.map((item, index) => (

                            <tr
                            >
                              <td>{index + 1}</td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.din} disabled></Form.Control>
                              </td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.name} disabled></Form.Control>
                              </td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.contactNumber} disabled></Form.Control>
                              </td>
                              <td>
                                <div className="row">
                                  {/* <button className="btn btn-sm col-md-6" onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                    <Visibility color="info" className="icon" />
                                  </button> */}
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                      <Visibility color="info" className="icon" /></IconButton>
                                  {/* <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                    <FileDownload color="primary" />
                                  </button> */}
                                  </div>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                        </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        }
                        {/* );
                            })} */}
                      </tbody>
                    </table>
                  </div>
                  </Card>
                 
                  <Card style={{ margin: 5 }}>
                  <p className="ml-1">
                    In case the Partner/director of the applicant firm/company is common with any existing colonizer who has been granted a license under the 1975 act Yes/No.

                  </p>
                            <div>
                  <div className="form-group ml-2">
                    <input
                      type="radio"
                      value="Y"
                      id="existingColonizer"
                      className="mx-2 mt-1"
                      checked={addInfo?.existingColonizer === "Y" ? true : false}
                      // onChange={(e) => setExistingColonizer(e.target.value)}
                      name="existingColonizer"
                    />
                    <label for="Yes">Yes</label>

                    <input
                      type="radio"
                      value="N"
                      id="existingColonizerN"
                      className="mx-2 mt-1"
                      checked={addInfo?.existingColonizer === "N" ? true : false}
                      // onChange={(e) => setExistingColonizer(e.target.value)}
                      name="existingColonizer"
                    />
                    <label for="No">No</label>
                    </div>

                    {addInfo?.existingColonizer === "Y"  && (
                      <div>
                        <div className="row ">
                          <div className="form-group row">
                            <div className="col-sm-12">
                              <Col xs="12" md="12" sm="12">
                                <Table className="table table-bordered" size="sm">
                                  <thead>
                                    <tr>
                                      <th>S.No.</th>
                                      <th>Document Name </th>
                                      {/* <th> Upload Documents</th> */}
                                      <th> Annexure</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td> 1 &nbsp;&nbsp;</td>
                                      <td>
                                        {" "}
                                        Agreement between the proposed developer and existing colonizer
                                      </td>
                                      <td align="center" size="large">
                                        {/* <input
                                          type="file"
                                          accept="application/pdf"
                                          name="agreementDoc"
                                          onChange={(e) => getDocumentData(e?.target?.files[0], "aggreementBtw", "existingColonizer")}
                                          class="employee-card-input"
                                        /> */}
                                          <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(addInfo?.existingColonizerData?.aggreementBtw)}>
                                      <Visibility color="info" className="icon" />
                                      </IconButton>
                                      </div>
                                   
                                      <div className="btn btn-sm col-md-4">
                                      {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                                <FileDownload color="primary" className="mx-1" />
                        {/* </IconButton> */}
                        </div>
                        <div className="btn btn-sm col-md-4">
                  <ReportProblemIcon
              style={{
                  display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                                      </td>
                                      {/* <td>
                                 
                                        <div className="btn btn-sm col-md-6">
                                          <button type="button" 
                                       
                                          className="btn btn-sm col-md-6">
                                            <Visibility color="info" className="icon" />
                                          </button> : <p></p>
                                          </div>
                                       
                                      </td> */}
                                    </tr>
                                    <tr>
                                      <td> 2&nbsp;&nbsp; </td>
                                      <td>
                                        Board resolution of authorised signatory of the existing colonizer
                                      </td>
                                      <td align="center" size="large">
                                        {/* <input
                                          type="file"
                                          accept="application/pdf"
                                          name="boardDoc"
                                          onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolution", "existingColonizer")}
                                          class="employee-card-input"
                                        /> */}
                                          <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(addInfo?.existingColonizerData?.boardResolution)}>
                                      <Visibility color="info" className="icon" />
                                      </IconButton>
                                      </div>
                                   
                                      <div className="btn btn-sm col-md-4">
                                      {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                                <FileDownload color="primary" className="mx-1" />
                        {/* </IconButton> */}
                        </div>
                        <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                                      </td>
                                      
                                    </tr>
                                  </tbody>
                                </Table>
                              </Col>
                            </div>
                          </div>
                        </div>

                        <div className="row mx-2">


                          <div className="col col-4">
                            <div >
                              <label htmlFor="dob">DOB</label>
                              {/* <input
                                type="date"
                                value={existingColonizerDetails.dob}
                                name="dob"
                               
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, dob: e.target.value })}
                                className="employee-card-input"
                              /> */}
                              <div className={classes.fieldContainer}>

                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={addInfo?.existingColonizerData?.dob} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                                     <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                            </div>
                          </div>

                          <div className="col col-4">
                            <div >
                              <label htmlFor="pan">PAN Number</label>
                              {/* <input
                                type="pan"
                                value={existingColonizerDetails.pan}
                                name="dob"
                               
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, pan: e.target.value })}
                                className="employee-card-input"
                                maxLength={10}
                              /> */}
                              <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} 
                              placeholder={addInfo?.existingColonizerData?.pan} 
                              disabled></Form.Control>
                              &nbsp;&nbsp;
                                    <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                            </div>
                          </div>

                          <div className="col col-4">
                            <div >
                              <label htmlFor="licNo">License No.</label>
                              {/* <input
                                type="text"
                                value={existingColonizerDetails.licNo}
                                name="licNo"
                                
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, licNo: e.target.value })}
                                className="employee-card-input"
                                maxLength={10}
                              /> */}
                              <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={addInfo?.existingColonizerData?.licNo} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                                     <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                            </div>
                          </div>

                          <div className="col col-4">
                            <div >
                              <label htmlFor="licDate">Date</label>
                              {/* <input
                                type="date"
                                value={existingColonizerDetails.licDate}
                                name="licDate"
                               
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, licDate: e.target.value })}
                                className="employee-card-input"
                                maxLength={10}
                              /> */}
                              <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={addInfo?.existingColonizerData?.licDate}
                                disabled></Form.Control>
                                &nbsp;&nbsp;
                                      <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                            </div>
                          </div>

                          <div className="col col-4">
                            <div >
                              <label htmlFor="licValidity">Validity</label>
                             <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={addInfo?.existingColonizerData?.licValidity} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                                     <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                            </div>
                          </div>

                          <div className="col col-4">
                            <div >
                              <label >Purpose</label>
                      <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={addInfo?.existingColonizerData?.licPurpose} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                                     <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>

                            </div>
                          </div>


                        </div>
                      </div>
                    )}
                  </div>
                  
                  </Card>
                </div>
              }
                {addInfo?.showDevTypeFields === "Trust" &&
                <div>
                  <Card style={{ margin: 5 }}>
                    <h5>Developer Details </h5>
                    <Row>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5>CSR Number &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.csr_Number : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.cinNo
                            }}
                            onClick={() => {
                              setOpennedModal("cinNo")
                              setLabelValue("CSR Number"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.csr_Number : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Trust Name  &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.companyName : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.companyName
                            }}
                            onClick={() => {
                              setOpennedModal("companyName")
                              setLabelValue("Trust Name "),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.companyName : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Date of Incorporation &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.incorporationDate : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.dateOfIncorporation
                            }}
                            onClick={() => {
                              setOpennedModal("dateOfIncorporation")
                              setLabelValue("Date of Incorporation"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.incorporationDate : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Registered Address &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.registeredAddress : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.regAddress
                            }}
                            onClick={() => {
                              setOpennedModal("regAddress")
                              setLabelValue("Registered Address"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.registeredAddress : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Email &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.email : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.email
                            }}
                            onClick={() => {
                              setOpennedModal("email")
                              setLabelValue("Email"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.email : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Mobile No. &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.registeredContactNo : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.mobileNo
                            }}
                            onClick={() => {
                              setOpennedModal("mobileNo")
                              setLabelValue("Mobile No."),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.registeredContactNo : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>GST No. &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.gst_Number : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.gstNo
                            }}
                            onClick={() => {
                              setOpennedModal("gstNo")
                              setLabelValue("GST No."),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.gst_Number : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                    </Row>
                  </Card>



                  <Card style={{ margin: 5 }}>
                  <h5 className="card-title fw-bold">Shareholding Patterns</h5>
                    <div className="table-bd">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Sr. No</th>
                            <th>Name</th>
                            <th>Designition</th>
                            <th>Percentage</th>
                            <th>View PDF</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            addInfo?.shareHoldingPatterens?.map((item, index) => (

                              <tr>
                                <td>{item?.serialNumber || index + 1}</td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.name} disabled></Form.Control>
                                </td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.designition} disabled></Form.Control>
                                </td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.percentage} disabled></Form.Control>
                                </td>
                                <td>
                                  <div className="row">
                                    {/* <button className="btn btn-sm col-md-6" onClick={()=>getDocShareholding(item?.uploadPdf)} > */}
                                    <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                      <Visibility color="info" className="icon" /></IconButton>
                                      </div>
                                    {/* </button> */}
                                    {/* <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                      <FileDownload color="primary" /> */}
                                      <div className="btn btn-sm col-md-6">
                                      <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                        </div>
                                    {/* </button> */}
                                  </div>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </Card>
                  {/* {showDevTypeFields === "02" && (
                  <div className="card mb-3">
                    <h5 className="card-title fw-bold">Directors Information</h5>
                    <div className="card-body"> */}
                    <Card style={{ margin:5}}>
                    <h5 className="card-title fw-bold">Directors Information</h5>
               
                  <div className="table-bd">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr. No</th>
                          <th>DIN Number</th>
                          <th>Name</th>
                          <th>Contact Number</th>
                          <th>View PDF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          addInfo?.DirectorsInformation?.map((item, index) => (

                            <tr
                            >
                              <td>{index + 1}</td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.din} disabled></Form.Control>
                              </td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.name} disabled></Form.Control>
                              </td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.contactNumber} disabled></Form.Control>
                              </td>
                              <td>
                                <div className="row">
                                  {/* <button className="btn btn-sm col-md-6" onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                    <Visibility color="info" className="icon" />
                                  </button> */}
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                      <Visibility color="info" className="icon" /></IconButton>
                                  {/* <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                    <FileDownload color="primary" />
                                  </button> */}
                                  </div>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                        </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        }
                        {/* );
                            })} */}
                      </tbody>
                    </table>
                  </div>
                  </Card>
                 
                  <Card style={{ margin: 5 }}>
                  <p className="ml-1">
                    In case the Partner/director of the applicant firm/company is common with any existing colonizer who has been granted a license under the 1975 act Yes/No.

                  </p>
                            <div>
                  <div className="form-group ml-2">
                    <input
                      type="radio"
                      value="Y"
                      id="existingColonizer"
                      className="mx-2 mt-1"
                      checked={addInfo?.existingColonizer === "Y" ? true : false}
                      // onChange={(e) => setExistingColonizer(e.target.value)}
                      name="existingColonizer"
                    />
                    <label for="Yes">Yes</label>

                    <input
                      type="radio"
                      value="N"
                      id="existingColonizerN"
                      className="mx-2 mt-1"
                      checked={addInfo?.existingColonizer === "N" ? true : false}
                      // onChange={(e) => setExistingColonizer(e.target.value)}
                      name="existingColonizer"
                    />
                    <label for="No">No</label>
                    </div>

                    {addInfo?.existingColonizer === "Y"  && (
                      <div>
                        <div className="row ">
                          <div className="form-group row">
                            <div className="col-sm-12">
                              <Col xs="12" md="12" sm="12">
                                <Table className="table table-bordered" size="sm">
                                  <thead>
                                    <tr>
                                      <th>S.No.</th>
                                      <th>Document Name </th>
                                      {/* <th> Upload Documents</th> */}
                                      <th> Annexure</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td> 1 &nbsp;&nbsp;</td>
                                      <td>
                                        {" "}
                                        Agreement between the proposed developer and existing colonizer
                                      </td>
                                      <td align="center" size="large">
                                        {/* <input
                                          type="file"
                                          accept="application/pdf"
                                          name="agreementDoc"
                                          onChange={(e) => getDocumentData(e?.target?.files[0], "aggreementBtw", "existingColonizer")}
                                          class="employee-card-input"
                                        /> */}
                                          <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(addInfo?.existingColonizerData?.aggreementBtw)}>
                                      <Visibility color="info" className="icon" />
                                      </IconButton>
                                      </div>
                                   
                                      <div className="btn btn-sm col-md-4">
                                      {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                                <FileDownload color="primary" className="mx-1" />
                        {/* </IconButton> */}
                        </div>
                        <div className="btn btn-sm col-md-4">
                  <ReportProblemIcon
              style={{
                  display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                                      </td>
                                      {/* <td>
                                 
                                        <div className="btn btn-sm col-md-6">
                                          <button type="button" 
                                       
                                          className="btn btn-sm col-md-6">
                                            <Visibility color="info" className="icon" />
                                          </button> : <p></p>
                                          </div>
                                       
                                      </td> */}
                                    </tr>
                                    <tr>
                                      <td> 2&nbsp;&nbsp; </td>
                                      <td>
                                        Board resolution of authorised signatory of the existing colonizer
                                      </td>
                                      <td align="center" size="large">
                                        {/* <input
                                          type="file"
                                          accept="application/pdf"
                                          name="boardDoc"
                                          onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolution", "existingColonizer")}
                                          class="employee-card-input"
                                        /> */}
                                          <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(addInfo?.existingColonizerData?.boardResolution)}>
                                      <Visibility color="info" className="icon" />
                                      </IconButton>
                                      </div>
                                   
                                      <div className="btn btn-sm col-md-4">
                                      {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                                <FileDownload color="primary" className="mx-1" />
                        {/* </IconButton> */}
                        </div>
                        <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                                      </td>
                                      
                                    </tr>
                                  </tbody>
                                </Table>
                              </Col>
                            </div>
                          </div>
                        </div>

                        <div className="row mx-2">


                          <div className="col col-4">
                            <div >
                              <label htmlFor="dob">DOB</label>
                              {/* <input
                                type="date"
                                value={existingColonizerDetails.dob}
                                name="dob"
                               
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, dob: e.target.value })}
                                className="employee-card-input"
                              /> */}
                              <div className={classes.fieldContainer}>

                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={addInfo?.existingColonizerData?.dob} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                                     <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                            </div>
                          </div>

                          <div className="col col-4">
                            <div >
                              <label htmlFor="pan">PAN Number</label>
                              {/* <input
                                type="pan"
                                value={existingColonizerDetails.pan}
                                name="dob"
                               
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, pan: e.target.value })}
                                className="employee-card-input"
                                maxLength={10}
                              /> */}
                              <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} 
                              placeholder={addInfo?.existingColonizerData?.pan} 
                              disabled></Form.Control>
                              &nbsp;&nbsp;
                                    <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                            </div>
                          </div>

                          <div className="col col-4">
                            <div >
                              <label htmlFor="licNo">License No.</label>
                              {/* <input
                                type="text"
                                value={existingColonizerDetails.licNo}
                                name="licNo"
                                
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, licNo: e.target.value })}
                                className="employee-card-input"
                                maxLength={10}
                              /> */}
                              <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={addInfo?.existingColonizerData?.licNo} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                                     <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                            </div>
                          </div>

                          <div className="col col-4">
                            <div >
                              <label htmlFor="licDate">Date</label>
                              {/* <input
                                type="date"
                                value={existingColonizerDetails.licDate}
                                name="licDate"
                               
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, licDate: e.target.value })}
                                className="employee-card-input"
                                maxLength={10}
                              /> */}
                              <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={addInfo?.existingColonizerData?.licDate}
                                disabled></Form.Control>
                                &nbsp;&nbsp;
                                      <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                            </div>
                          </div>

                          <div className="col col-4">
                            <div >
                              <label htmlFor="licValidity">Validity</label>
                             <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={addInfo?.existingColonizerData?.licValidity} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                                     <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                            </div>
                          </div>

                          <div className="col col-4">
                            <div >
                              <label >Purpose</label>
                      <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={addInfo?.existingColonizerData?.licPurpose} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                                     <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>

                            </div>
                          </div>


                        </div>
                      </div>
                    )}
                  </div>
                  
                  </Card>
                </div>
              }
                {addInfo?.showDevTypeFields === "Hindu Undivided Family" &&
                <div>
                  <Card style={{ margin: 5 }}>
                    <h5>Developer Details </h5>
                    <Row>
                      {/* <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                        
                            <h5>CSR Number &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.csr_Number : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.cinNo
                            }}
                            onClick={() => {
                              setOpennedModal("cinNo")
                              setLabelValue("CSR Number"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.csr_Number : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col> */}
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Company Name  &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.companyName : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.companyName
                            }}
                            onClick={() => {
                              setOpennedModal("companyName")
                              setLabelValue("Trust Name "),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.companyName : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Date of Incorporation &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.incorporationDate : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.dateOfIncorporation
                            }}
                            onClick={() => {
                              setOpennedModal("dateOfIncorporation")
                              setLabelValue("Date of Incorporation"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.incorporationDate : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Registered Address &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.registeredAddress : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.regAddress
                            }}
                            onClick={() => {
                              setOpennedModal("regAddress")
                              setLabelValue("Registered Address"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.registeredAddress : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Email &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.email : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.email
                            }}
                            onClick={() => {
                              setOpennedModal("email")
                              setLabelValue("Email"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.email : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Mobile No. &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.registeredContactNo : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.mobileNo
                            }}
                            onClick={() => {
                              setOpennedModal("mobileNo")
                              setLabelValue("Mobile No."),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.registeredContactNo : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>GST No. &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.gst_Number : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.gstNo
                            }}
                            onClick={() => {
                              setOpennedModal("gstNo")
                              setLabelValue("GST No."),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.gst_Number : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                    </Row>
                  </Card>



                  <Card style={{ margin: 5 }}>
                  <h5 className="card-title fw-bold">Shareholding Patterns</h5>
                    <div className="table-bd">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Sr. No</th>
                            <th>Name</th>
                            <th>Designition</th>
                            <th>Percentage</th>
                            <th>View PDF</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            addInfo?.shareHoldingPatterens?.map((item, index) => (

                              <tr>
                                <td>{item?.serialNumber || index + 1}</td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.name} disabled></Form.Control>
                                </td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.designition} disabled></Form.Control>
                                </td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.percentage} disabled></Form.Control>
                                </td>
                                <td>
                                  <div className="row">
                                    {/* <button className="btn btn-sm col-md-6" onClick={()=>getDocShareholding(item?.uploadPdf)} > */}
                                    <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                      <Visibility color="info" className="icon" /></IconButton>
                                      </div>
                                    {/* </button> */}
                                    {/* <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                      <FileDownload color="primary" /> */}
                                      <div className="btn btn-sm col-md-6">
                                      <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                        </div>
                                    {/* </button> */}
                                  </div>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </Card>
                  {/* {showDevTypeFields === "02" && (
                  <div className="card mb-3">
                    <h5 className="card-title fw-bold">Directors Information</h5>
                    <div className="card-body"> */}
                    <Card style={{ margin:5}}>
                    <h5 className="card-title fw-bold">Directors Information</h5>
               
                  <div className="table-bd">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr. No</th>
                          <th>DIN Number</th>
                          <th>Name</th>
                          <th>Contact Number</th>
                          <th>View PDF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          addInfo?.DirectorsInformation?.map((item, index) => (

                            <tr
                            >
                              <td>{index + 1}</td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.din} disabled></Form.Control>
                              </td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.name} disabled></Form.Control>
                              </td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.contactNumber} disabled></Form.Control>
                              </td>
                              <td>
                                <div className="row">
                                  {/* <button className="btn btn-sm col-md-6" onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                    <Visibility color="info" className="icon" />
                                  </button> */}
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                      <Visibility color="info" className="icon" /></IconButton>
                                  {/* <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                    <FileDownload color="primary" />
                                  </button> */}
                                  </div>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                        </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        }
                        {/* );
                            })} */}
                      </tbody>
                    </table>
                  </div>
                  </Card>
                 
                  <Card style={{ margin: 5 }}>
                  <p className="ml-1">
                    In case the Partner/director of the applicant firm/company is common with any existing colonizer who has been granted a license under the 1975 act Yes/No.

                  </p>
                            <div>
                  <div className="form-group ml-2">
                    <input
                      type="radio"
                      value="Y"
                      id="existingColonizer"
                      className="mx-2 mt-1"
                      checked={addInfo?.existingColonizer === "Y" ? true : false}
                      // onChange={(e) => setExistingColonizer(e.target.value)}
                      name="existingColonizer"
                    />
                    <label for="Yes">Yes</label>

                    <input
                      type="radio"
                      value="N"
                      id="existingColonizerN"
                      className="mx-2 mt-1"
                      checked={addInfo?.existingColonizer === "N" ? true : false}
                      // onChange={(e) => setExistingColonizer(e.target.value)}
                      name="existingColonizer"
                    />
                    <label for="No">No</label>
                    </div>

                    {addInfo?.existingColonizer === "Y"  && (
                      <div>
                        <div className="row ">
                          <div className="form-group row">
                            <div className="col-sm-12">
                              <Col xs="12" md="12" sm="12">
                                <Table className="table table-bordered" size="sm">
                                  <thead>
                                    <tr>
                                      <th>S.No.</th>
                                      <th>Document Name </th>
                                      {/* <th> Upload Documents</th> */}
                                      <th> Annexure</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td> 1 &nbsp;&nbsp;</td>
                                      <td>
                                        {" "}
                                        Agreement between the proposed developer and existing colonizer
                                      </td>
                                      <td align="center" size="large">
                                        {/* <input
                                          type="file"
                                          accept="application/pdf"
                                          name="agreementDoc"
                                          onChange={(e) => getDocumentData(e?.target?.files[0], "aggreementBtw", "existingColonizer")}
                                          class="employee-card-input"
                                        /> */}
                                          <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(addInfo?.existingColonizerData?.aggreementBtw)}>
                                      <Visibility color="info" className="icon" />
                                      </IconButton>
                                      </div>
                                   
                                      <div className="btn btn-sm col-md-4">
                                      {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                                <FileDownload color="primary" className="mx-1" />
                        {/* </IconButton> */}
                        </div>
                        <div className="btn btn-sm col-md-4">
                  <ReportProblemIcon
              style={{
                  display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                                      </td>
                                      {/* <td>
                                 
                                        <div className="btn btn-sm col-md-6">
                                          <button type="button" 
                                       
                                          className="btn btn-sm col-md-6">
                                            <Visibility color="info" className="icon" />
                                          </button> : <p></p>
                                          </div>
                                       
                                      </td> */}
                                    </tr>
                                    <tr>
                                      <td> 2&nbsp;&nbsp; </td>
                                      <td>
                                        Board resolution of authorised signatory of the existing colonizer
                                      </td>
                                      <td align="center" size="large">
                                        {/* <input
                                          type="file"
                                          accept="application/pdf"
                                          name="boardDoc"
                                          onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolution", "existingColonizer")}
                                          class="employee-card-input"
                                        /> */}
                                          <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(addInfo?.existingColonizerData?.boardResolution)}>
                                      <Visibility color="info" className="icon" />
                                      </IconButton>
                                      </div>
                                   
                                      <div className="btn btn-sm col-md-4">
                                      {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                                <FileDownload color="primary" className="mx-1" />
                        {/* </IconButton> */}
                        </div>
                        <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                                      </td>
                                      
                                    </tr>
                                  </tbody>
                                </Table>
                              </Col>
                            </div>
                          </div>
                        </div>

                        <div className="row mx-2">


                          <div className="col col-4">
                            <div >
                              <label htmlFor="dob">DOB</label>
                              {/* <input
                                type="date"
                                value={existingColonizerDetails.dob}
                                name="dob"
                               
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, dob: e.target.value })}
                                className="employee-card-input"
                              /> */}
                              <div className={classes.fieldContainer}>

                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={addInfo?.existingColonizerData?.dob} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                                     <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                            </div>
                          </div>

                          <div className="col col-4">
                            <div >
                              <label htmlFor="pan">PAN Number</label>
                              {/* <input
                                type="pan"
                                value={existingColonizerDetails.pan}
                                name="dob"
                               
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, pan: e.target.value })}
                                className="employee-card-input"
                                maxLength={10}
                              /> */}
                              <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} 
                              placeholder={addInfo?.existingColonizerData?.pan} 
                              disabled></Form.Control>
                              &nbsp;&nbsp;
                                    <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                            </div>
                          </div>

                          <div className="col col-4">
                            <div >
                              <label htmlFor="licNo">License No.</label>
                              {/* <input
                                type="text"
                                value={existingColonizerDetails.licNo}
                                name="licNo"
                                
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, licNo: e.target.value })}
                                className="employee-card-input"
                                maxLength={10}
                              /> */}
                              <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={addInfo?.existingColonizerData?.licNo} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                                     <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                            </div>
                          </div>

                          <div className="col col-4">
                            <div >
                              <label htmlFor="licDate">Date</label>
                              {/* <input
                                type="date"
                                value={existingColonizerDetails.licDate}
                                name="licDate"
                               
                                onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, licDate: e.target.value })}
                                className="employee-card-input"
                                maxLength={10}
                              /> */}
                              <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={addInfo?.existingColonizerData?.licDate}
                                disabled></Form.Control>
                                &nbsp;&nbsp;
                                      <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                            </div>
                          </div>

                          <div className="col col-4">
                            <div >
                              <label htmlFor="licValidity">Validity</label>
                             <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={addInfo?.existingColonizerData?.licValidity} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                                     <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>
                            </div>
                          </div>

                          <div className="col col-4">
                            <div >
                              <label >Purpose</label>
                      <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={addInfo?.existingColonizerData?.licPurpose} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                                     <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                color:fieldIconColors.existingColonizerDoc}}
              onClick={() => {
                  setOpennedModal("Agreement between the proposed developer and existing colonizer")
                  setLabelValue("Agreement between the proposed developer and existing colonizer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            </div>

                            </div>
                          </div>


                        </div>
                      </div>
                    )}
                  </div>
                  
                  </Card>
                </div>
              }
              {addInfo?.showDevTypeFields === "Limited Liability Partnership" &&
                <div>
                <Card style={{ margin: 5 }}>
                  <h5>Developer Details</h5>
                  <Row>
                    <Col md={4} xxl lg="4">
                      <div>
                        <Form.Label>
                          {/* <b>individual Land owner</b> */}
                          <h5>LLP Number &nbsp;</h5>
                        </Form.Label>
                        <span style={{ color: "red" }}>*</span>
                      </div>

                      <div style={{ display: "flex" }}>
                        <Form.Control className={classes.formControl}
                          placeholder={addInfo !== null ? addInfo?.llp_Number : null}
                          disabled ></Form.Control>
                        &nbsp;&nbsp;
                        <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.llp_Number
                          }}
                          onClick={() => {
                            setOpennedModal("cinNo")
                            setLabelValue("LLP Number"),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(addInfo !== null ? addInfo?.llp_Number : null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </Col>
                    <Col md={4} xxl lg="4">
                      <div>
                        <Form.Label>
                          {/* <b>individual Land owner</b> */}
                          <h5 className={classes.formLabel}>Company Name &nbsp;</h5>
                        </Form.Label>
                        <span style={{ color: "red" }}>*</span>
                      </div>

                      <div style={{ display: "flex" }}>
                        <Form.Control className={classes.formControl}
                          placeholder={addInfo !== null ? addInfo?.companyName : null}
                          disabled></Form.Control>
                        &nbsp;&nbsp;
                        <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.companyName
                          }}
                          onClick={() => {
                            setOpennedModal("companyName")
                            setLabelValue("Company's Name"),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(addInfo !== null ? addInfo?.companyName : null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </Col>
                    <Col md={4} xxl lg="4">
                      <div>
                        <Form.Label>
                          {/* <b>individual Land owner</b> */}
                          <h5 className={classes.formLabel}>Date of Incorporation &nbsp;</h5>
                        </Form.Label>
                        <span style={{ color: "red" }}>*</span>
                      </div>

                      <div style={{ display: "flex" }}>
                        <Form.Control className={classes.formControl}
                          placeholder={addInfo !== null ? addInfo?.incorporationDate : null}
                          disabled ></Form.Control>
                        &nbsp;&nbsp;
                        <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.dateOfIncorporation
                          }}
                          onClick={() => {
                            setOpennedModal("dateOfIncorporation")
                            setLabelValue("Date of Incorporation"),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(addInfo !== null ? addInfo?.incorporationDate : null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </Col>
                    <Col md={4} xxl lg="4">
                      <div>
                        <Form.Label>
                          {/* <b>individual Land owner</b> */}
                          <h5 className={classes.formLabel}>Registered Address &nbsp;</h5>
                        </Form.Label>
                        <span style={{ color: "red" }}>*</span>
                      </div>

                      <div style={{ display: "flex" }}>
                        <Form.Control className={classes.formControl}
                          placeholder={addInfo !== null ? addInfo?.registeredAddress : null}
                          disabled ></Form.Control>
                        &nbsp;&nbsp;
                        <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.regAddress
                          }}
                          onClick={() => {
                            setOpennedModal("regAddress")
                            setLabelValue("Registered Address"),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(addInfo !== null ? addInfo?.registeredAddress : null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </Col>
                    <Col md={4} xxl lg="4">
                      <div>
                        <Form.Label>
                          {/* <b>individual Land owner</b> */}
                          <h5 className={classes.formLabel}>Email &nbsp;</h5>
                        </Form.Label>
                        <span style={{ color: "red" }}>*</span>
                      </div>

                      <div style={{ display: "flex" }}>
                        <Form.Control className={classes.formControl}
                          placeholder={addInfo !== null ? addInfo?.email : null}
                          disabled ></Form.Control>
                        &nbsp;&nbsp;
                        <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.email
                          }}
                          onClick={() => {
                            setOpennedModal("email")
                            setLabelValue("Email"),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(addInfo !== null ? addInfo?.email : null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </Col>
                    <Col md={4} xxl lg="4">
                      <div>
                        <Form.Label>
                          {/* <b>individual Land owner</b> */}
                          <h5 className={classes.formLabel}>Mobile No. &nbsp;</h5>
                        </Form.Label>
                        <span style={{ color: "red" }}>*</span>
                      </div>

                      <div style={{ display: "flex" }}>
                        <Form.Control className={classes.formControl}
                          placeholder={addInfo !== null ? addInfo?.registeredContactNo : null}
                          disabled></Form.Control>
                        &nbsp;&nbsp;
                        <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.mobileNo
                          }}
                          onClick={() => {
                            setOpennedModal("mobileNo")
                            setLabelValue("Mobile No."),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(addInfo !== null ? addInfo?.registeredContactNo : null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </Col>
                    <Col md={4} xxl lg="4">
                      <div>
                        <Form.Label>
                          {/* <b>individual Land owner</b> */}
                          <h5 className={classes.formLabel}>GST No. &nbsp;</h5>
                        </Form.Label>
                        <span style={{ color: "red" }}>*</span>
                      </div>

                      <div style={{ display: "flex" }}>
                        <Form.Control className={classes.formControl}
                          placeholder={addInfo !== null ? addInfo?.gst_Number : null}
                          disabled ></Form.Control>
                        &nbsp;&nbsp;
                        <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.gstNo
                          }}
                          onClick={() => {
                            setOpennedModal("gstNo")
                            setLabelValue("GST No."),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(addInfo !== null ? addInfo?.gst_Number : null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </Col>
                  </Row>
                </Card>



                <Card style={{ margin: 5 }}>
                <h5 className="card-title fw-bold">Shareholding Patterns</h5>
                  <div className="table-bd">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr. No</th>
                          <th>Name</th>
                          <th>Designition</th>
                          <th>Percentage</th>
                          <th>View PDF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          addInfo?.shareHoldingPatterens?.map((item, index) => (

                            <tr>
                              <td>{item?.serialNumber || index + 1}</td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.name} disabled></Form.Control>
                              </td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.designition} disabled></Form.Control>
                              </td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.percentage} disabled></Form.Control>
                              </td>
                              <td>
                                <div className="row">
                                  {/* <button className="btn btn-sm col-md-6" onClick={()=>getDocShareholding(item?.uploadPdf)} > */}
                                  <div className="btn btn-sm col-md-6">
                                  <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                    <Visibility color="info" className="icon" /></IconButton>
                                    </div>
                                  {/* </button> */}
                                  {/* <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                    <FileDownload color="primary" /> */}
                                    <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                              <FileDownload color="primary" className="mx-1" />
                      </IconButton>
                      </div>
                                  {/* </button> */}
                                </div>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </Card>
                {/* {showDevTypeFields === "02" && (
                <div className="card mb-3">
                  <h5 className="card-title fw-bold">Directors Information</h5>
                  <div className="card-body"> */}
                  <Card style={{ margin:5}}>
                  <h5 className="card-title fw-bold">Directors Information</h5>
             
                <div className="table-bd">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>DIN Number</th>
                        <th>Name</th>
                        <th>Contact Number</th>
                        <th>View PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        addInfo?.DirectorsInformation?.map((item, index) => (

                          <tr
                          >
                            <td>{index + 1}</td>
                            <td>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.din} disabled></Form.Control>
                            </td>
                            <td>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.name} disabled></Form.Control>
                            </td>
                            <td>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.contactNumber} disabled></Form.Control>
                            </td>
                            <td>
                              <div className="row">
                                {/* <button className="btn btn-sm col-md-6" onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                  <Visibility color="info" className="icon" />
                                </button> */}
                                <div className="btn btn-sm col-md-6">
                                  <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                    <Visibility color="info" className="icon" /></IconButton>
                                {/* <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                  <FileDownload color="primary" />
                                </button> */}
                                </div>
                                <div className="btn btn-sm col-md-6">
                                  <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                              <FileDownload color="primary" className="mx-1" />
                      </IconButton>
                      </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                      {/* );
                          })} */}
                    </tbody>
                  </table>
                </div>
                </Card>
               
                <Card style={{ margin: 5 }}>
                <p className="ml-1">
                  In case the Partner/director of the applicant firm/company is common with any existing colonizer who has been granted a license under the 1975 act Yes/No.

                </p>
                          <div>
                <div className="form-group ml-2">
                  <input
                    type="radio"
                    value="Y"
                    id="existingColonizer"
                    className="mx-2 mt-1"
                    checked={addInfo?.existingColonizer === "Y" ? true : false}
                    // onChange={(e) => setExistingColonizer(e.target.value)}
                    name="existingColonizer"
                  />
                  <label for="Yes">Yes</label>

                  <input
                    type="radio"
                    value="N"
                    id="existingColonizerN"
                    className="mx-2 mt-1"
                    checked={addInfo?.existingColonizer === "N" ? true : false}
                    // onChange={(e) => setExistingColonizer(e.target.value)}
                    name="existingColonizer"
                  />
                  <label for="No">No</label>
                  </div>

                  {addInfo?.existingColonizer === "Y"  && (
                    <div>
                      <div className="row ">
                        <div className="form-group row">
                          <div className="col-sm-12">
                            <Col xs="12" md="12" sm="12">
                              <Table className="table table-bordered" size="sm">
                                <thead>
                                  <tr>
                                    <th>S.No.</th>
                                    <th>Document Name </th>
                                    {/* <th> Upload Documents</th> */}
                                    <th> Annexure</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td> 1 &nbsp;&nbsp;</td>
                                    <td>
                                      {" "}
                                      Agreement between the proposed developer and existing colonizer
                                    </td>
                                    <td align="center" size="large">
                                      {/* <input
                                        type="file"
                                        accept="application/pdf"
                                        name="agreementDoc"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "aggreementBtw", "existingColonizer")}
                                        class="employee-card-input"
                                      /> */}
                                        <div className="btn btn-sm col-md-4">
                                  <IconButton onClick={()=>getDocShareholding(addInfo?.existingColonizerData?.aggreementBtw)}>
                                    <Visibility color="info" className="icon" />
                                    </IconButton>
                                    </div>
                                 
                                    <div className="btn btn-sm col-md-4">
                                    {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                              <FileDownload color="primary" className="mx-1" />
                      {/* </IconButton> */}
                      </div>
                      <div className="btn btn-sm col-md-4">
                <ReportProblemIcon
            style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
              color:fieldIconColors.existingColonizerDoc}}
            onClick={() => {
                setOpennedModal("Agreement between the proposed developer and existing colonizer")
                setLabelValue("Agreement between the proposed developer and existing colonizer"),
                setSmShow(true),
                console.log("modal open"),
                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
            }}
          ></ReportProblemIcon>
          </div>
                                    </td>
                                    {/* <td>
                               
                                      <div className="btn btn-sm col-md-6">
                                        <button type="button" 
                                     
                                        className="btn btn-sm col-md-6">
                                          <Visibility color="info" className="icon" />
                                        </button> : <p></p>
                                        </div>
                                     
                                    </td> */}
                                  </tr>
                                  <tr>
                                    <td> 2&nbsp;&nbsp; </td>
                                    <td>
                                      Board resolution of authorised signatory of the existing colonizer
                                    </td>
                                    <td align="center" size="large">
                                      {/* <input
                                        type="file"
                                        accept="application/pdf"
                                        name="boardDoc"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolution", "existingColonizer")}
                                        class="employee-card-input"
                                      /> */}
                                        <div className="btn btn-sm col-md-4">
                                  <IconButton onClick={()=>getDocShareholding(addInfo?.existingColonizerData?.boardResolution)}>
                                    <Visibility color="info" className="icon" />
                                    </IconButton>
                                    </div>
                                 
                                    <div className="btn btn-sm col-md-4">
                                    {/* <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}> */}
                              <FileDownload color="primary" className="mx-1" />
                      {/* </IconButton> */}
                      </div>
                      <div className="btn btn-sm col-md-4">
                      <ReportProblemIcon
            style={{
              display: hideRemarks || hideRemarksPatwari ?"none":"block",
              color:fieldIconColors.existingColonizerDoc}}
            onClick={() => {
                setOpennedModal("Agreement between the proposed developer and existing colonizer")
                setLabelValue("Agreement between the proposed developer and existing colonizer"),
                setSmShow(true),
                console.log("modal open"),
                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
            }}
          ></ReportProblemIcon>
          </div>
                                    </td>
                                    
                                  </tr>
                                </tbody>
                              </Table>
                            </Col>
                          </div>
                        </div>
                      </div>

                      <div className="row mx-2">


                        <div className="col col-4">
                          <div >
                            <label htmlFor="dob">DOB</label>
                            {/* <input
                              type="date"
                              value={existingColonizerDetails.dob}
                              name="dob"
                             
                              onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, dob: e.target.value })}
                              className="employee-card-input"
                            /> */}
                            <div className={classes.fieldContainer}>

                            <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                             placeholder={addInfo?.existingColonizerData?.dob} 
                             disabled></Form.Control>
                             &nbsp;&nbsp;
                                   <ReportProblemIcon
            style={{
              display: hideRemarks || hideRemarksPatwari ?"none":"block",
              color:fieldIconColors.existingColonizerDoc}}
            onClick={() => {
                setOpennedModal("Agreement between the proposed developer and existing colonizer")
                setLabelValue("Agreement between the proposed developer and existing colonizer"),
                setSmShow(true),
                console.log("modal open"),
                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
            }}
          ></ReportProblemIcon>
          </div>
                          </div>
                        </div>

                        <div className="col col-4">
                          <div >
                            <label htmlFor="pan">PAN Number</label>
                            {/* <input
                              type="pan"
                              value={existingColonizerDetails.pan}
                              name="dob"
                             
                              onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, pan: e.target.value })}
                              className="employee-card-input"
                              maxLength={10}
                            /> */}
                            <div className={classes.fieldContainer}>
                            <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} 
                            placeholder={addInfo?.existingColonizerData?.pan} 
                            disabled></Form.Control>
                            &nbsp;&nbsp;
                                  <ReportProblemIcon
            style={{
              display: hideRemarks || hideRemarksPatwari ?"none":"block",
              color:fieldIconColors.existingColonizerDoc}}
            onClick={() => {
                setOpennedModal("Agreement between the proposed developer and existing colonizer")
                setLabelValue("Agreement between the proposed developer and existing colonizer"),
                setSmShow(true),
                console.log("modal open"),
                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
            }}
          ></ReportProblemIcon>
          </div>
                          </div>
                        </div>

                        <div className="col col-4">
                          <div >
                            <label htmlFor="licNo">License No.</label>
                            {/* <input
                              type="text"
                              value={existingColonizerDetails.licNo}
                              name="licNo"
                              
                              onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, licNo: e.target.value })}
                              className="employee-card-input"
                              maxLength={10}
                            /> */}
                            <div className={classes.fieldContainer}>
                            <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                             placeholder={addInfo?.existingColonizerData?.licNo} 
                             disabled></Form.Control>
                             &nbsp;&nbsp;
                                   <ReportProblemIcon
            style={{
              display: hideRemarks || hideRemarksPatwari ?"none":"block",
              color:fieldIconColors.existingColonizerDoc}}
            onClick={() => {
                setOpennedModal("Agreement between the proposed developer and existing colonizer")
                setLabelValue("Agreement between the proposed developer and existing colonizer"),
                setSmShow(true),
                console.log("modal open"),
                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
            }}
          ></ReportProblemIcon>
          </div>
                          </div>
                        </div>

                        <div className="col col-4">
                          <div >
                            <label htmlFor="licDate">Date</label>
                            {/* <input
                              type="date"
                              value={existingColonizerDetails.licDate}
                              name="licDate"
                             
                              onChange={(e) => setExistingColonizerDetails({ ...existingColonizerDetails, licDate: e.target.value })}
                              className="employee-card-input"
                              maxLength={10}
                            /> */}
                            <div className={classes.fieldContainer}>
                            <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                             placeholder={addInfo?.existingColonizerData?.licDate}
                              disabled></Form.Control>
                              &nbsp;&nbsp;
                                    <ReportProblemIcon
            style={{
              display: hideRemarks || hideRemarksPatwari ?"none":"block",
              color:fieldIconColors.existingColonizerDoc}}
            onClick={() => {
                setOpennedModal("Agreement between the proposed developer and existing colonizer")
                setLabelValue("Agreement between the proposed developer and existing colonizer"),
                setSmShow(true),
                console.log("modal open"),
                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
            }}
          ></ReportProblemIcon>
          </div>
                          </div>
                        </div>

                        <div className="col col-4">
                          <div >
                            <label htmlFor="licValidity">Validity</label>
                           <div className={classes.fieldContainer}>
                            <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                             placeholder={addInfo?.existingColonizerData?.licValidity} 
                             disabled></Form.Control>
                             &nbsp;&nbsp;
                                   <ReportProblemIcon
            style={{
              display: hideRemarks || hideRemarksPatwari ?"none":"block",
              color:fieldIconColors.existingColonizerDoc}}
            onClick={() => {
                setOpennedModal("Agreement between the proposed developer and existing colonizer")
                setLabelValue("Agreement between the proposed developer and existing colonizer"),
                setSmShow(true),
                console.log("modal open"),
                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
            }}
          ></ReportProblemIcon>
          </div>
                          </div>
                        </div>

                        <div className="col col-4">
                          <div >
                            <label >Purpose</label>
                    <div className={classes.fieldContainer}>
                            <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                             placeholder={addInfo?.existingColonizerData?.licPurpose} 
                             disabled></Form.Control>
                             &nbsp;&nbsp;
                                   <ReportProblemIcon
            style={{
              display: hideRemarks || hideRemarksPatwari ?"none":"block",
              color:fieldIconColors.existingColonizerDoc}}
            onClick={() => {
                setOpennedModal("Agreement between the proposed developer and existing colonizer")
                setLabelValue("Agreement between the proposed developer and existing colonizer"),
                setSmShow(true),
                console.log("modal open"),
                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
            }}
          ></ReportProblemIcon>
          </div>

                          </div>
                        </div>


                      </div>
                    </div>
                  )}
                </div>
                
                </Card>
              </div>
              }
            </div>
            {/* </Row> */}

            {/* <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 40 }}>
              <Button
                style={{ textAlign: "right" }}
                onClick={() => {
                  console.log("here");
                  props.passUncheckedList({ data: uncheckedValue });
                }}
              >
                Submit
              </Button>
            </div> */}
          </Form.Group>

          {/* <hr></hr> */}
          {/* </Card> */}
        </div>
      </Collapse>
      {/* <LicenseDetailsScrutiny />
          <CapacityScrutiny /> */}
      {/* </div>
      </Collapse> */}
    </Form>
  );
};
export default LicenseDetailsScrutiny;