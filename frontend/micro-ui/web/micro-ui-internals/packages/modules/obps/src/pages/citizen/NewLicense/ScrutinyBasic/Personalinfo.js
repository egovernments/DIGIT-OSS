import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import * as Icon from "react-bootstrap-icons";
// import { XCircleFill } from "react-bootstrap-icons";
// import { CheckCircleFill } from "react-bootstrap-icons";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import InfoIcon from "@mui/icons-material/Info";
// import BootstrapSwitchButton from "bootstrap-switch-button-react";
// import Alert from "react-bootstrap/Alert";
// import ToggleButton from "react-toggle-button";
// import Toggle from "react-toggle";
// import "react-toggle/style.css";
// import WarningIcon from "@material-ui/icons/Warning";
import PersonalinfoChild from "./PersonalinfoChild";
import LicenseDetailsScrutiny from "../ScrutinyBasic/Developer/LicenseDetailsScrutiny";
import CapacityScrutiny from "../ScrutinyBasic/Developer/CapacityScrutiny";
import Collapse from "react-bootstrap/Collapse";
import Modal from "react-bootstrap/Modal";
import ModalChild from "./Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const Personalinfo = (props) => {
  const [uncheckedValue, setUncheckedVlue] = useState([]);
  const [checkValue, setCheckedVAlue] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [messege, setMessege] = useState("");
  const [developerLabel, setDeveloperLabel] = useState(true);
  const [show, setshow] = useState(false);
  const [show3, setshow3] = useState(false);
  const [smShow, setSmShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [noChecked, setNochecked] = useState(true);
  const [warningOrred, setwarningOrred] = useState("#ffcf33");
  const [color, setColor] = useState({ yes: false, no: false });
  const [smShow2, setSmShow2] = useState(false);
  const [smShow3, setSmShow3] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const [modaldData, setmodaldData] = useState({ label: "", Remarks: "" });
  const [isyesOrNochecked, setYesorNochecked] = useState(true);

  const applicantInfoPersonal = props.ApiResponseData;
  console.log("personal info applicant data", applicantInfoPersonal);

  const handlemodaldData = (data) => {
    setmodaldData(data.data);
    setSmShow(false);
  };

  const handleYesOrNochecked = (data) => {
    setYesorNochecked(data.data);
  };
  const handlemodalsubmit = () => {
    console.log("here");
    const filteredObj = uncheckedValue.filter((obj) => {
      return obj.label == modaldData.label;
    });
    const filteredObjCheked = checkValue.filter((obj) => {
      return obj.label == modaldData.label;
    });
    if (filteredObj.length !== 0) {
      const removedList = uncheckedValue.filter((obj) => {
        return obj.label !== modaldData.label;
      });
      setUncheckedVlue(removedList);
    }
    if (filteredObjCheked.length !== 0) {
      const removedList = checkValue.filter((obj) => {
        return obj.label !== modaldData.label;
      });
      setCheckedVAlue(removedList);
    }

    if (isyesOrNochecked === false) {
      if (modaldData.label !== "" || modaldData.Remarks !== "") {
        if (filteredObj.length === 0) {
          setUncheckedVlue((prev) => [...prev, modaldData]);
        }
      }
    } else {
      if (modaldData.label !== "" || modaldData.Remarks !== "") {
        if (filteredObjCheked.length === 0) {
          setCheckedVAlue((prev) => [...prev, modaldData]);
        }
      }
    }
  };
  useEffect(() => {
    console.log("called");
    handlemodalsubmit();
  }, [modaldData.Remarks]);
  useEffect(() => {
    props.passUncheckedList({ data: uncheckedValue });
  }, [uncheckedValue]);

  useEffect(() => {
    props.passCheckedList({ data: checkValue });
  }, [checkValue]);

  const currentRemarklifo = (data) => {
    props.showTable({ data: data.data });
  };

  return (
<<<<<<< HEAD
    <Form
      ref={props.personalInfoRef}
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
        <span style={{ color: "#817f7f" }} className="">
          Applicant info
        </span>
        {open ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
=======
    <Form ref={props.personalInfoRef}>
      {/* <div className="justify-content-center" 
                style={{
                    width:"100%", 
                    height:40,
                    backgroundColor:"aliceblue",
                    padding:5,
                    borderColor:"darkblue", 
                    borderWidth:2, 
                    borderBlockStyle:"solid", 
                    borderRadius:5,
                    marginBottom:10
                }}>
                <h2 style={{fontSize:20, fontFamily:"Roboto", color:"GrayText"}}>Personal Information</h2>
            </div> */}
      <Form.Group style={{ display: props.displayPersonal }} className="justify-content-center">
        <Row className="ms-auto" style={{ marginBottom: 20 }}>
          <Col className="ms-auto" md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>Developer</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
            </div>

            <Form.Check
              value="Developer"
              type="radio"
              id="default-radio"
              //  label={<AiFillCheckCircle  class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group0"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Developer"
              type="radio"
              id="default-radio"
              //  label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group0"
              inline
            ></Form.Check>

            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
          <Col className="ms-auto" md={4} xxl lg="3">
            <Form.Label>
              <b>Authorized Person Name</b>
            </Form.Label>
            <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
            <Form.Check
              value="Authorized Person Name"
              type="radio"
              id="default-radio"
              // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group1"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Authorized Person Name"
              type="radio"
              id="default-radio"
              // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group1"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
          <Col className="ms-auto" md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>Authorized Mobile No</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
            </div>
            <Form.Check
              value="Authorized Mobile No"
              type="radio"
              id="default-radio"
              //  label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group2"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Authorized Mobile No"
              type="radio"
              id="default-radio"
              //  label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group2"
              inline
            ></Form.Check>

            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>

          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>Authorized Mobile No. 2</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span>
            </div>
            <Form.Check
              value="Authorized Mobile No. 2"
              type="radio"
              id="default-radio"
              // label={<AiFillCheckCircle  class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group3"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Authorized Mobile No. 2"
              type="radio"
              id="default-radio"
              // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group3"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
        </Row>
        <Row className="ms-auto" style={{ marginBottom: 20 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>Email ID</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span>
            </div>
            <Form.Check
              value="Email ID"
              type="radio"
              id="default-radio"
              // label={<AiFillCheckCircle  class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group4"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Email ID"
              type="radio"
              id="default-radio"
              // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group4"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>PAN No.</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span>
            </div>
            <Form.Check
              value="PAN No."
              type="radio"
              id="default-radio"
              // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group5"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="PAN No."
              type="radio"
              id="default-radio"
              // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group5"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>Address 1 </b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span>
            </div>
            <Form.Check
              value="Address 1"
              type="radio"
              id="default-radio"
              // label={<AiFillCheckCircle  class="fa fa-check text-success"size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group6"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Address 1"
              type="radio"
              id="default-radio"
              // label={<AiFillCloseCircle class="fa fa-times text-danger"size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group6"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>Village/City</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span>
            </div>
            <Form.Check
              value="Village/City."
              type="radio"
              id="default-radio"
              // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group7"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Village/City."
              type="radio"
              id="default-radio"
              //  label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group7"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
        </Row>
        <Row className="ms-auto" style={{ marginBottom: 20 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>Pincode</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span>
            </div>
            <Form.Check
              value="Pincode"
              type="radio"
              id="default-radio"
              // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group8"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Pincode"
              type="radio"
              id="default-radio"
              // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group8"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>Tehsil</b>{" "}
              </Form.Label>
              <span style={{ color: "red" }}>*</span>
            </div>
            <Form.Check
              value="Tehsil"
              type="radio"
              id="default-radio"
              //  label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group9"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Tehsil"
              type="radio"
              id="default-radio"
              // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group9"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>District</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span>
            </div>
            <Form.Check
              value="District"
              type="radio"
              id="default-radio"
              // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group10"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="District"
              type="radio"
              id="default-radio"
              // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group10"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>State</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span>
            </div>
            <Form.Check
              value="State"
              type="radio"
              id="default-radio"
              // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group11"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="State"
              type="radio"
              id="default-radio"
              // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group11"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
        </Row>
        <Row className="ms-auto" style={{ marginBottom: 20 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>Status (Individual/ Company/ Firm/ LLP etc.)</b>
              </Form.Label>
            </div>
            <Form.Check
              value="Status (Individual/ Company/ Firm/ LLP etc.)"
              type="radio"
              id="default-radio"
              // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group12"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Status (Individual/ Company/ Firm/ LLP etc.)"
              type="radio"
              id="default-radio"
              // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group12"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>LC-I signed by</b>{" "}
              </Form.Label>
            </div>
            <Form.Check
              value="LC-I signed by"
              type="radio"
              id="default-radio"
              // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group13"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="LC-I signed by"
              type="radio"
              id="default-radio"
              //  label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group13"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)</b>
              </Form.Label>
            </div>
            <Form.Check
              value="If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)"
              type="radio"
              id="default-radio"
              // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group14"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)"
              type="radio"
              id="default-radio"
              //  label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group14"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>Permanent address in case of individual/ registered office address in case other than individual</b>
              </Form.Label>
            </div>
            <Form.Check
              value="Permanent address in case of individual/ registered office address in case other than individual"
              type="radio"
              id="default-radio"
              //  label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group15"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Permanent address in case of individual/ registered office address in case other than individual"
              type="radio"
              id="default-radio"
              // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group15"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
        </Row>
        <Row className="ms-auto" style={{ marginBottom: 20 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>Address for communication</b>
              </Form.Label>
            </div>
            <Form.Check
              value="Address for communication"
              type="radio"
              id="default-radio"
              //  label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group16"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Address for communication"
              type="radio"
              id="default-radio"
              // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group16"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>Name of the authorized person to sign the application</b>{" "}
              </Form.Label>
            </div>
            <Form.Check
              value="Name of the authorized person to sign the application"
              type="radio"
              id="default-radio"
              // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group17"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Name of the authorized person to sign the application"
              type="radio"
              id="default-radio"
              //  label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group17"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>Email ID for communication</b>
              </Form.Label>
            </div>
            <Form.Check
              value="Email ID for communication"
              type="radio"
              id="default-radio"
              //  label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
              label={<CheckCircleFill class="text-success" />}
              name="group18"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Email ID for communication"
              type="radio"
              id="default-radio"
              //  label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
              label={<XCircleFill class="text-danger" />}
              name="group18"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>Name of individual Land owner/ land-owning company/ firm/ LLP etc.</b>
              </Form.Label>
            </div>
            <Form.Check
              value="Name of individual Land owner/ land-owning company/ firm/ LLP etc."
              type="radio"
              id="default-radio"
              label={<CheckCircleFill class="text-success" />}
              name="group19"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Name of individual Land owner/ land-owning company/ firm/ LLP etc."
              type="radio"
              id="default-radio"
              label={<XCircleFill class="text-danger" />}
              name="group19"
              inline
            ></Form.Check>
            <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
          </Col>
        </Row>
      </Form.Group>
      <div style={{ position: "relative", marginBottom: 40 }}>
        <Button
          onClick={() => {
            console.log("here");
            props.passUncheckedList({ data: uncheckedValue });
          }}
        >
          Submit
        </Button>
>>>>>>> d5a9c6deb21711e74387afcc692cc6ccdfa115de
      </div>

      <Collapse in={open}>
        <div id="example-collapse-text">
          <div></div>
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
              Personalinfo
            </span>
            {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open2}>
            <div id="example-collapse-text" style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}>
              <PersonalinfoChild
                showTable={currentRemarklifo}
                personalinfo={applicantInfoPersonal !== null ? applicantInfoPersonal : null}
                displayPersonal={open2 ? "block" : "none"}
              />
            </div>
          </Collapse>
          <LicenseDetailsScrutiny />
          <CapacityScrutiny />
        </div>
      </Collapse>
      {/* </Card> */}
    </Form>
  );
};

export default Personalinfo;
