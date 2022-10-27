import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import {AiFillCheckCircle, AiFillCloseCircle} from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
// import TextField from '@mui/material/TextField';
// import CalculateIcon from '@mui/icons-material/Calculate';
// import InfoIcon from '@mui/icons-material/Info';
// import * as Icon from "react-bootstrap-icons";
// import { XCircleFill } from "react-bootstrap-icons";
// import { CheckCircleFill } from "react-bootstrap-icons";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";

import Collapse from "react-bootstrap/Collapse";
import ModalChild from "./Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const Genarelinfo = (props) => {
  const [showhide1, setShowhide1] = useState("No");
  const [uncheckedValue, setUncheckedVlue] = useState([]);
  const [checkValue, setCheckedVAlue] = useState([]);
  const [smShow, setSmShow] = useState(false);

  const handleshow1 = (e) => {
    const getshow = e.target.value;
    setShowhide1(getshow);
  };
  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };

  const [showhide2, setShowhide2] = useState("No");
  const [open, setOpen] = useState(false);

  const handleshow2 = (e) => {
    const getshow = e.target.value;
    setShowhide2(getshow);
  };
  const [purpose, setPurpose] = useState("");
  const handleChangesetPurpose = (e) => {
    setPurpose(e.target.value);
    localStorage.setItem("Purpose", e.target.value);
    props.passUncheckedList({ data: uncheckedValue, purpose: e?.target?.value });
  };

  const [form, setForm] = useState([]);
  const [open2, setOpen2] = useState(false);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  // cons[(purpose, setPurpose)] = useState("");
  const [showhide, setShowhide] = useState("No");
  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };
  const [noChecked, setNochecked] = useState(true);
  const [warningOrred, setwarningOrred] = useState("#ffcf33");

  const [smShow2, setSmShow2] = useState(false);
  const [smShow3, setSmShow3] = useState(false);

  const [color, setColor] = useState({ yes: false, no: false });

  const [labelValue, setLabelValue] = useState("");
  const [modaldData, setmodaldData] = useState({ label: "", Remarks: "" });
  const [isyesOrNochecked, setYesorNochecked] = useState(true);

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

    if (isyesOrNochecked === false) {
      if (modaldData.label !== "" || modaldData.Remarks !== "") {
        if (filteredObj.length === 0) {
          setUncheckedVlue((prev) => [...prev, modaldData]);
        }
      }
    } else {
      if (modaldData.label !== "" || modaldData.Remarks !== "") {
        if (filteredObj.length === 0) {
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
  console.log("unchecked values", uncheckedValue);

  console.log(uncheckedValue.indexOf("developer"));

  const developerInputFiledColor = modaldData.label === "Puropse" ? modaldData.color : { data: "#FFB602" };
  // const developerInputFiledColor1 = modaldData.label === "Authorized Person Name" ? modaldData.color : { data: "#FFB602" };
  //change the white color to default color
  const developerInputFiledColor2 = modaldData.label === "Potential Zone" ? modaldData.color : { data: "#FFB602" };
  const developerInputFiledColor3 = modaldData.label === "district" ? modaldData.color : { data: "#FFB602" };
  const developerInputFiledColor4 = modaldData.label === "State" ? modaldData.color : { data: "#FFB602" };
  const developerInputFiledColor5 = modaldData.label === "Tehsil" ? modaldData.color : { data: "#FFB602" };
  const developerInputFiledColor6 = modaldData.label === "Revenue estate" ? modaldData.color : { data: "#FFB602" };
  const developerInputFiledColor7 = modaldData.label === "Rectangle No." ? modaldData.color : { data: "#FFB602" };
  const developerInputFiledColor8 = modaldData.label === "Killa" ? modaldData.color : { data: "#FFB602" };
  const developerInputFiledColor9 = modaldData.label === "Land owner" ? modaldData.color : { data: "#FFB602" };
  const developerInputFiledColor10 = modaldData.label === "Consolidation Type" ? modaldData.color : { data: "#FFB602" };
  const developerInputFiledColor11 = modaldData.label === "Kanal/Bigha" ? modaldData.color : { data: "#FFB602" };
  const developerInputFiledColor12 = modaldData.label === "Marla/Biswa" ? modaldData.color : { data: "#FFB602" };
  const developerInputFiledColor13 = modaldData.label === "Marla/Biswa" ? modaldData.color : { data: "#FFB602" };
  // const developerInputFiledColor14 = modaldData.label === "Village/City" ? modaldData.color : { data: "#FFB602" };

  console.log("color for the deeloper", developerInputFiledColor);

  // const [uncheckedValue, setUncheckedVlue] = useState([]);
  // console.log(uncheckedValue);
  return (
    <Form ref={props.generalInfoRef}>
      {/* <Button
    onClick={() => setOpen(!open)}
    aria-controls="example-collapse-text"
    aria-expanded={open}
  >
  Step-2
      </Button> */}
      {/* <Card
        style={{
          width: "100%",
          height: props.heightGen,
          overflow: "hidden",
          marginBottom: 20,
          borderColor: "#C3C3C3",
          borderStyle: "solid",
          borderWidth: 2,
          padding: 2,
        }}
      > */}
      <div>
        <Col class="col-12">
          <Button
            style={{
              // margin: 2,
              width: "inherit",
              textAlign: "inherit",
              padding: "0.25rem 1rem",
              fontWeight: "Bold",
              backgroundColor: "#c2c4c7",
              border: "none",
              color: "unset",
            }}
            onClick={() => setOpen2(!open2)}
            aria-controls="example-collapse-text"
            aria-expanded={open2}
          >
            Application Purpose
            <AddIcon style={{ width: "63.2em" }}></AddIcon>
          </Button>
        </Col>
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Form.Group className="justify-content-center" controlId="formBasicEmail">
            <Row className="ml-auto" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Purpose Of License</b> <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                </div>

                <div style={{ display: "flex" }}>
                  {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} readOnly></Form.Control> */}

                  {/* <Form.Check
                    value="Puropse Of License"
                    type="radio"
                    id="default-radio"
                    label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                    onChange={(e) => {setPurpose(e.target.value),localStorage.setItem("Purpose",e.target.value)}}
                    onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                    name="group19"
                    inline
                  ></Form.Check> */}
                  {/* <Form.Check
                    onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                    value="Puropse Of License"
                    type="radio"
                    id="default-radio"
                    label={<CancelIcon color="error" />}
                    name="group19"
                    inline
                  ></Form.Check> */}
                  <Form.Select
                    type="text"
                    placeholder="Puropse"
                    onChange={handleChangesetPurpose}
                    height={30}
                    style={{ maxWidth: 120, marginRight: 5 }}
                    disabled
                  >
                    {/* <select className="form-control" id="Puropse" name="potential" placeholder="Puropse" onChange={handleChangesetPurpose} readOnly> */}
                    <option value="">--Purpose--</option>
                    <option value="01">Plotted Commercial</option>
                    <option value="02">Group Housing Commercial</option>
                    <option value="03">AGH </option>
                    <option value="04">Commercial Integrated </option>
                    <option value="05">Commercial Plotted</option>
                    <option value="06">Industrial Colony Commercial</option>
                    <option value="07">IT Colony Commercial</option>
                    <option value="08">DDJAY</option>
                    <option value="12">TOD Group housing</option>
                    {/* </select> */}
                  </Form.Select>
                  <ReportProblemIcon
                    style={{
                      color: developerInputFiledColor.data,
                    }}
                    onClick={() => {
                      setLabelValue("Puropse"), setSmShow(true), console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                  <ModalChild
                    labelmodal={labelValue}
                    passmodalData={handlemodaldData}
                    isYesorNoChecked={handleYesOrNochecked}
                    displaymodal={smShow}
                  ></ModalChild>
                </div>
              </Col>
              <div className="col col-3">
                <label htmlFor="potential">
                  <h6>
                    <b>Potential Zone:</b>
                  </h6>
                </label>
                &nbsp;&nbsp; &nbsp;&nbsp;
                {/* <Form.Check
                  value="Potential Zone"
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group20"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Potential Zone"
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group20"
                  inline
                ></Form.Check> */}
                <div style={{ display: "flex" }}>
                  <Form.Select
                    height={30}
                    style={{ maxWidth: 120, marginRight: 5 }}
                    className="form-control"
                    id="potential"
                    name="potential"
                    disabled
                  >
                    <option value="">--Potential Zone--</option>
                    <option value="K.Mishra">Hyper</option>
                    <option value="potential 1">High I</option>
                    <option value="potential 2">High II</option>
                    <option value="potential 2">Medium</option>
                    <option value="potential 2">Low I</option>
                    <option value="potential 2">Low II</option>
                  </Form.Select>
                  {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} readOnly></Form.Control> */}
                  <ReportProblemIcon
                    style={{
                      color: developerInputFiledColor2.data,
                    }}
                    onClick={() => {
                      setLabelValue("Potential Zone"), setSmShow(true), console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>District </b> <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  &nbsp;&nbsp;
                </div>
                <div>
                  {/* <Form.Check
                    value="District"
                    type="radio"
                    id="default-radio"
                    label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                    name="group21"
                    inline
                  ></Form.Check>
                  <Form.Check
                    onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                    value="District"
                    type="radio"
                    id="default-radio"
                    label={<CancelIcon color="error" />}
                    name="group21"
                    inline
                  ></Form.Check> */}
                  <div style={{ display: "flex" }}>
                    <Form.Select height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled>
                      <option value="1">no district</option>
                    </Form.Select>
                    <ReportProblemIcon
                      style={{
                        color: developerInputFiledColor3.data,
                      }}
                      onClick={() => {
                        setLabelValue("district"), setSmShow(true), console.log("modal open");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </div>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>State </b>
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                </div>
                <div>
                  {/* <Form.Check
                    value="State"
                    type="radio"
                    id="default-radio"
                    label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                    name="group22"
                    inline
                  ></Form.Check>
                  <Form.Check
                    onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                    value="State"
                    type="radio"
                    id="default-radio"
                    label={<CancelIcon color="error" />}
                    name="group22"
                    inline
                  ></Form.Check> */}
                  <div style={{ display: "flex" }}>
                    <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control>
                    <ReportProblemIcon
                      style={{
                        color: developerInputFiledColor4.data,
                      }}
                      onClick={() => {
                        setLabelValue("State"), setSmShow(true), console.log("modal open");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </div>
                {/* <Form.Control type="text" defaultValue="Haryana" disabled></Form.Control> */}
              </Col>
            </Row>
            {/* <Collapse in={open}>
        <div id="example-collapse-text"> */}
            <div className="ml-auto" style={{ marginTop: 20 }}>
              <h2 style={{ fontSize: 24 }}>2. Details of applied land:</h2>
              <p>
                Note: The term “Collaboration agreement" shall include all Development agreements/ Joint Venture agreements/ Joint Development
                agreements/ Memorandum of Understanding etc. and similar agreements registered with competent authority.
              </p>
              <p>
                <b>(i) Khasra-wise information to be provided in the following format:</b>&nbsp;&nbsp;
                {/* <Form.Check
              value="Name of the authorized person to sign the application"
              type="radio"
              id="default-radio"
              label={  <CheckCircleIcon color="success"></CheckCircleIcon>}
              name="group23"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Name of the authorized person to sign the application"
              type="radio"
              id="default-radio"
               label={  <CancelIcon color="error" />}
              name="group23"
              inline
            ></Form.Check> */}
              </p>
            </div>
            <div className="ml-auto">
              {/* <Button variant="primary" onClick={handleShow}>
                Enter Details
              </Button>
              <div>
                <Modal {...props} size="xl" show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                  <Modal.Header closeButton></Modal.Header>

                  <Modal.Body>
                    <Row className="ml-auto mb-3">
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            <h6>
                              <b>Tehsil</b>
                            </h6>
                          </Form.Label>
                          &nbsp;&nbsp;
                          <Form.Check
                            value="Tehsil"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                            name="group24"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Tehsil"
                            type="radio"
                            id="default-radio"
                            label={<CancelIcon color="error" />}
                            name="group24"
                            inline
                          ></Form.Check>
                        </div>
                        <Form.Select type="text" defaultValue="Select" readOnly>
                          <option value="1">--Select Tehsil--</option>
                        </Form.Select>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            <h6>
                              <b>Name of Revenue estate</b>
                            </h6>
                          </Form.Label>
                          &nbsp;&nbsp;
                          <Form.Check
                            value="Name of Revenue estate"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                            name="group25"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Name of Revenue estate"
                            type="radio"
                            id="default-radio"
                            label={<CancelIcon color="error" />}
                            name="group25"
                            inline
                          ></Form.Check>
                        </div>
                        <Form.Select type="text" defaultValue="Select" readOnly>
                          <option value="1">--Select Revenue State--</option>
                        </Form.Select>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            <h6>
                              <b>Rectangle No./Mustil</b>
                            </h6>
                            <i class=" fa fa-calculator"></i>
                          </Form.Label>
                          &nbsp;&nbsp;
                          <Form.Check
                            value="Rectangle No./Mustil"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                            name="group26"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Rectangle No./Mustil"
                            type="radio"
                            id="default-radio"
                            label={<CancelIcon color="error" />}
                            name="group26"
                            inline
                          ></Form.Check>
                        </div>
                        <Form.Select type="text" defaultValue="Select">
                          <option value="1">--Select Mustil--</option>
                        </Form.Select>
                      </Col>
                    </Row>
                    <br></br>
                    <Row className="ml-auto mb-3">
                      <Col md={4} xxl lg="4">
                    <div>
                      <label>
                        <h6>
                          <b>Sector</b>
                        </h6>{" "}
                      </label>
                      &nbsp;&nbsp;
                      <Form.Check
                        value="Sector"
                        type="radio"
                        id="default-radio"
                        label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                        name="group27"
                        inline
                      ></Form.Check>
                      <Form.Check
                        onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="Sector"
                        type="radio"
                        id="default-radio"
                        label={<CancelIcon color="error" />}
                        name="group27"
                        inline
                      ></Form.Check>
                      <input type="number" className="form-control" />
                    </div>
                  </Col>

                      <Col md={4} xxl lg="12">
                        <div>
                          <label>
                            <h6>
                              <b>Consolidation Type</b>
                            </h6>{" "}
                          </label>{" "}
                          &nbsp;&nbsp;
                          <Form.Select type="select" defaultValue="Select" placeholder="" className="form-control"
                                    onChange={(e)=>setModalConsolidation(e.target.value)} >
                                       
                          <input type="radio" id="Yes" value="1" onChange={handleChange} name="Yes" onClick={handleshow2} />
                          &nbsp;&nbsp;
                          <label for="Yes"></label>
                          <label htmlFor="gen">Consolidated</label>&nbsp;&nbsp;
                          <input type="radio" id="Yes" value="2" onChange={handleChange} name="Yes" onClick={handleshow2} />
                          &nbsp;&nbsp;
                          <label for="Yes"></label>
                          <label htmlFor="npnl">Non-Consolidated</label>
                          </Form.Select>
                        </div>{" "}
                        {showhide2 === "1" && (
                          <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))" }}>
                            <thead>
                              <tr>
                                {(khasraData !== undefined && khasraData.length > 0)?(khasraData.)}
                                <th>
                                  <b>
                                    Kanal&nbsp;&nbsp;
                                    <Form.Check
                                      value="Kanal"
                                      type="radio"
                                      id="default-radio"
                                      label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                                      name="group29"
                                      inline
                                    ></Form.Check>
                                    <Form.Check
                                      onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                                      value="Kanal"
                                      type="radio"
                                      id="default-radio"
                                      label={<CancelIcon color="error" />}
                                      name="group29"
                                      inline
                                    ></Form.Check>
                                  </b>
                                </th>
                                <th>
                                  <b>
                                    Marla&nbsp;&nbsp;
                                    <Form.Check
                                      value="Marla"
                                      type="radio"
                                      id="default-radio"
                                      label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                                      name="group29"
                                      inline
                                    ></Form.Check>
                                    <Form.Check
                                      onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                                      value="Marla"
                                      type="radio"
                                      id="default-radio"
                                      label={<CancelIcon color="error" />}
                                      name="group29"
                                      inline
                                    ></Form.Check>
                                  </b>
                                </th>
                                <th>
                                  <b>
                                    Sarsai&nbsp;&nbsp;
                                    <Form.Check
                                      value="Sarsai"
                                      type="radio"
                                      id="default-radio"
                                      label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                                      name="group29"
                                      inline
                                    ></Form.Check>
                                    <Form.Check
                                      onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                                      value="Sarsai"
                                      type="radio"
                                      id="default-radio"
                                      label={<CancelIcon color="error" />}
                                      name="group29"
                                      inline
                                    ></Form.Check>
                                  </b>
                                  &nbsp;&nbsp;
                                </th>
                                <th><b>Area in Marla</b>&nbsp;&nbsp;</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <input type="text" className="form-control" placeholder=""></input>
                                </td>
                                <td>
                                  <input type="text" className="form-control" placeholder=""></input>{" "}
                                </td>
                                <td>
                                  {" "}
                                  <input type="text" className="form-control" placeholder=""></input>
                                </td>
                                <td > <input type="text" className="form-control" placeholder=""  onChange={(e)=>setModalMarla(e.target.value)}></input></td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                        {showhide2 === "2" && (
                          <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))" }}>
                            <thead>
                              <tr>
                                {(khasraData !== undefined && khasraData.length > 0)?(khasraData.)}
                                <th>
                                  <b>
                                    Bigha&nbsp;&nbsp;
                                    <Form.Check
                                      value="Bigha"
                                      type="radio"
                                      id="default-radio"
                                      label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                                      name="group29"
                                      inline
                                    ></Form.Check>
                                    <Form.Check
                                      onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                                      value="Bigha"
                                      type="radio"
                                      id="default-radio"
                                      label={<CancelIcon color="error" />}
                                      name="group29"
                                      inline
                                    ></Form.Check>
                                  </b>
                                </th>
                                <th>
                                  <b>
                                    Biswa&nbsp;&nbsp;
                                    <Form.Check
                                      value="Biswa"
                                      type="radio"
                                      id="default-radio"
                                      label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                                      name="group29"
                                      inline
                                    ></Form.Check>
                                    <Form.Check
                                      onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                                      value="Biswa"
                                      type="radio"
                                      id="default-radio"
                                      label={<CancelIcon color="error" />}
                                      name="group29"
                                      inline
                                    ></Form.Check>
                                  </b>
                                </th>
                                <th>
                                  <b>
                                    Biswansi&nbsp;&nbsp;
                                    <Form.Check
                                      value="Biswansi"
                                      type="radio"
                                      id="default-radio"
                                      label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                                      name="group29"
                                      inline
                                    ></Form.Check>
                                    <Form.Check
                                      onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                                      value="Biswansi"
                                      type="radio"
                                      id="default-radio"
                                      label={<CancelIcon color="error" />}
                                      name="group29"
                                      inline
                                    ></Form.Check>
                                  </b>
                                  &nbsp;&nbsp;
                                </th>
                                <th><b>Area in Marla</b>&nbsp;&nbsp;</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <input type="text" className="form-control" placeholder=""></input>
                                </td>
                                <td>
                                  <input type="text" className="form-control" placeholder=""></input>{" "}
                                </td>
                                <td>
                                  {" "}
                                  <input type="text" className="form-control" placeholder=""></input>
                                </td>
                                <td > <input type="text" className="form-control" placeholder=""  onChange={(e)=>setModalMarla(e.target.value)}></input></td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </Col>
                    </Row>
                    <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))" }}>
                  <thead>
                    <tr>
                      <th>
                        <b>
                          Killa&nbsp;&nbsp;
                          <Form.Check
                            value="Killa"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                            name="group29"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Killa"
                            type="radio"
                            id="default-radio"
                            label={<CancelIcon color="error" />}
                            name="group29"
                            inline
                          ></Form.Check>
                        </b>
                      </th>
                      <th>
                        <b>
                          Khewat &nbsp;&nbsp;
                          <Form.Check
                            value="Khewat"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                            name="group30"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Khewat"
                            type="radio"
                            id="default-radio"
                            label={<CancelIcon color="error" />}
                            name="group30"
                            inline
                          ></Form.Check>
                        </b>
                      </th>
                      <th>
                        <b>
                          Area in Kanal &nbsp;&nbsp;
                          <Form.Check
                            value=" Area in Kanal "
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                            name="group31"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value=" Area in Kanal "
                            type="radio"
                            id="default-radio"
                            label={<CancelIcon color="error" />}
                            name="group31"
                            inline
                          ></Form.Check>
                        </b>
                        &nbsp;&nbsp;
                      </th>
                      <th>
                        <b>
                          Area in Marla &nbsp;&nbsp;
                          <Form.Check
                            value="Area in Marla"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                            name="group32"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Area in Marla"
                            type="radio"
                            id="default-radio"
                            label={<CancelIcon color="error" />}
                            name="group32"
                            inline
                          ></Form.Check>
                        </b>
                        &nbsp;&nbsp;
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input id="standard-basic" variant="standard" />
                      </td>
                      <td>
                        <input id="standard-basic" variant="standard" />
                      </td>
                      <td>
                        <input id="standard-basic" variant="standard" />
                      </td>
                      <td>
                        <input id="standard-basic" variant="standard" />
                      </td>
                    </tr>
                  </tbody>
                </table>

                    <Row className="ml-auto mb-3">
                      <Col md={4} xxl lg="6">
                        <div>
                          <label>
                            <h6>
                              <b>Name of Land Owner</b>
                            </h6>{" "}
                          </label>
                          &nbsp;&nbsp;
                          <Form.Check
                            value="Name of Land Owner"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                            name="group33"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Name of Land Owner"
                            type="radio"
                            id="default-radio"
                            label={<CancelIcon color="error" />}
                            name="group33"
                            inline
                          ></Form.Check>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="6">
                        <input type="text" className="form-control" />
                      </Col>
                    </Row>
                    <Row className="ml-auto mb-3">
                      <div className="col col-12">
                        <h6 data-toggle="tooltip" data-placement="top" title="Whether collaboration agreement entered for the Khasra?(yes/no)">
                          <b>(h) Collaboration agreement </b>&nbsp;&nbsp;
                          <input type="radio" value="Yes" id="Yes" onChange={handleChange} name="Yes" onClick={handleshow1} />
                          &nbsp;&nbsp;
                          <label for="Yes">
                            <h6>
                              <b>Yes</b>
                            </h6>
                          </label>
                          &nbsp;&nbsp;
                          <input type="radio" value="No" id="No" onChange={handleChange} name="Yes" onClick={handleshow1} />
                          &nbsp;&nbsp;
                          <label for="No">
                            <h6>
                              <b>No</b>
                            </h6>
                          </label>
                        </h6>

                        <Form.Check
                          value="Collaboration agreement"
                          type="radio"
                          id="default-radio"
                          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                          name="group34"
                          inline
                        ></Form.Check>
                        <Form.Check
                          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                          value="Collaboration agreement"
                          type="radio"
                          id="default-radio"
                          label={<CancelIcon color="error" />}
                          name="group34"
                          inline
                        ></Form.Check>
                        {showhide1 === "Yes" && (
                          <div className="row ">
                            <div className="col col-4">
                              <label for="parentLicense" className="font-weight-bold">
                                <h6>
                                  <b>Name of the developer company / Firm/ LLP etc. with whom collaboration agreement entered</b>
                                </h6>
                              </label>
                              &nbsp;&nbsp;
                              <Form.Check
                                value="Name of the developer company / Firm/ LLP etc. with whom collaboration agreement entered"
                                type="radio"
                                id="default-radio"
                                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                                name="group35"
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                                value="Name of the developer company / Firm/ LLP etc. with whom collaboration agreement entered"
                                type="radio"
                                id="default-radio"
                                label={<CancelIcon color="error" />}
                                name="group35"
                                inline
                              ></Form.Check>
                              <input type="text" className="form-control" />
                            </div>
                            <div className="col col-4" style={{ marginTop: 15 }}>
                              <label for="parentLicense" className="font-weight-bold">
                                <h6>
                                  <b>Date of registering collaboration agreement</b>
                                </h6>
                              </label>
                              &nbsp;&nbsp;
                              <Form.Check
                                value="Date of registering collaboration agreement"
                                type="radio"
                                id="default-radio"
                                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                                name="group36"
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                                value="Date of registering collaboration agreement"
                                type="radio"
                                id="default-radio"
                                label={<CancelIcon color="error" />}
                                name="group36"
                                inline
                              ></Form.Check>
                              <input type="date" className="form-control" />
                            </div>
                            <div className="col col-4" style={{ marginTop: 15 }}>
                              <label for="parentLicense" className="font-weight-bold">
                                <h6>
                                  <b>Date of validity of collaboration agreement</b>
                                </h6>
                              </label>
                              &nbsp;&nbsp;
                              <Form.Check
                                value="Date of validity of collaboration agreement"
                                type="radio"
                                id="default-radio"
                                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                                name="group37"
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                                value="Date of validity of collaboration agreement"
                                type="radio"
                                id="default-radio"
                                label={<CancelIcon color="error" />}
                                name="group37"
                                inline
                              ></Form.Check>
                              <input type="date" className="form-control" />
                            </div>
                            <div className="col col-4" style={{ marginTop: 35 }}>
                              <label for="parentLicense" className="font-weight-bold">
                                <h6>
                                  <b>Whether collaboration agreement irrevocable (Yes/No)</b>
                                </h6>
                              </label>
                              <br></br>
                              <input type="radio" value="Yes" id="Yes1" onChange={handleChange} name="Yes" />
                              &nbsp;&nbsp;
                              <label for="Yes">
                                <h6>Yes</h6>
                              </label>
                              &nbsp;&nbsp;
                              <input type="radio" value="No" id="No1" onChange={handleChange} name="Yes" />
                              &nbsp;&nbsp;
                              <label for="No">
                                <h6>No</h6>
                              </label>
                              &nbsp;&nbsp;
                              <Form.Check
                                value="Whether collaboration agreement irrevocable"
                                type="radio"
                                id="default-radio"
                                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                                name="group38"
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                                value="Whether collaboration agreement irrevocable"
                                type="radio"
                                id="default-radio"
                                label={<CancelIcon color="error" />}
                                name="group38"
                                inline
                              ></Form.Check>
                            </div>

                            <div className="col col-4" style={{ marginTop: 35 }}>
                              <label for="parentLicense" className="font-weight-bold">
                                <h6>
                                  <b>Name of authorized signatory on behalf of land owner(s)</b>
                                </h6>
                              </label>
                              &nbsp;&nbsp;
                              <Form.Check
                                value="Name of authorized signatory on behalf of land owner(s)"
                                type="radio"
                                id="default-radio"
                                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                                name="group39"
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                                value="Name of authorized signatory on behalf of land owner(s)"
                                type="radio"
                                id="default-radio"
                                label={<CancelIcon color="error" />}
                                name="group39"
                                inline
                              ></Form.Check>
                              <input type="text" className="form-control" />
                            </div>
                            <div className="col col-4" style={{ marginTop: 15 }}>
                              <label for="parentLicense" className="font-weight-bold">
                                <h6>
                                  <b>Name of authorized signatory on behalf of developer to sign Collaboration agreement</b>
                                </h6>
                              </label>
                              &nbsp;&nbsp;
                              <Form.Check
                                value="Name of authorized signatory on behalf of developer to sign Collaboration agreement"
                                type="radio"
                                id="default-radio"
                                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                                name="group40"
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                                value="Name of authorized signatory on behalf of developer to sign Collaboration agreement"
                                type="radio"
                                id="default-radio"
                                label={<CancelIcon color="error" />}
                                name="group40"
                                inline
                              ></Form.Check>
                              <input type="date" className="form-control" />
                            </div>
                            <div className="col col-4" style={{ marginTop: 20 }}>
                              <label for="parentLicense" className="font-weight-bold">
                                <h6>
                                  <b>Registring Authority</b>
                                </h6>
                              </label>
                              <br></br>&nbsp;&nbsp;
                              <Form.Check
                                value="Registring Authority"
                                type="radio"
                                id="default-radio"
                                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                                name="group41"
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                                value="Registring Authority"
                                type="radio"
                                id="default-radio"
                                label={<CancelIcon color="error" />}
                                name="group41"
                                inline
                              ></Form.Check>
                              <input type="text" className="form-control" />
                            </div>
                            <div className="col col-4" style={{ marginTop: 15 }}>
                              <label for="parentLicense" className="font-weight-bold">
                                <h6>
                                  <b>Registring Authority document</b>
                                </h6>
                              </label>
                              <br></br>&nbsp;&nbsp;
                              <Form.Check
                                value="Registring Authority document"
                                type="radio"
                                id="default-radio"
                                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                                name="group42"
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                                value="Registring Authority document"
                                type="radio"
                                id="default-radio"
                                label={<CancelIcon color="error" />}
                                name="group42"
                                inline
                              ></Form.Check>
                              <input type="file" className="form-control" />
                            </div>
                          </div>
                        )}
                      </div>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="primary">Submit</Button>
                  </Modal.Footer>
                </Modal>
              </div> */}

              {/* <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch demo modal
</button>

<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div> */}
            </div>
            <br></br>

            <div className="applt" style={{ overflow: "auto" }}>
              <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))", overflow: "auto" }}>
                <thead>
                  <tr>
                    <th>
                      Tehsil{" "}
                      <div style={{ display: "flex" }}>
                        {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                        <ReportProblemIcon
                          style={{
                            color: developerInputFiledColor5.data,
                          }}
                          onClick={() => {
                            setLabelValue("Tehsil"), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </th>
                    <th>
                      Revenue estate{" "}
                      <div style={{ display: "flex" }}>
                        {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                        <ReportProblemIcon
                          style={{
                            color: developerInputFiledColor6.data,
                          }}
                          onClick={() => {
                            setLabelValue("Revenue estate"), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </th>
                    <th>
                      Rectangle No.{" "}
                      <div style={{ display: "flex" }}>
                        {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                        <ReportProblemIcon
                          style={{
                            color: developerInputFiledColor7.data,
                          }}
                          onClick={() => {
                            setLabelValue("Rectangle No."), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </th>
                    <th>
                      Killa{" "}
                      <div style={{ display: "flex" }}>
                        {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                        <ReportProblemIcon
                          style={{
                            color: developerInputFiledColor8.data,
                          }}
                          onClick={() => {
                            setLabelValue("Killa"), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </th>
                    <th>
                      Land owner{" "}
                      <div style={{ display: "flex" }}>
                        {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                        <ReportProblemIcon
                          style={{
                            color: developerInputFiledColor9.data,
                          }}
                          onClick={() => {
                            setLabelValue("Land owner"), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </th>
                    <th>
                      Consolidation Type{" "}
                      <div style={{ display: "flex" }}>
                        {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                        <ReportProblemIcon
                          style={{
                            color: developerInputFiledColor10.data,
                          }}
                          onClick={() => {
                            setLabelValue("Consolidation Type"), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </th>
                    <th>
                      Kanal/Bigha{" "}
                      <div style={{ display: "flex" }}>
                        {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                        <ReportProblemIcon
                          style={{
                            color: developerInputFiledColor11.data,
                          }}
                          onClick={() => {
                            setLabelValue("Kanal/Bigha"), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </th>
                    <th>
                      Marla/Biswa{" "}
                      <div style={{ display: "flex" }}>
                        {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                        <ReportProblemIcon
                          style={{
                            color: developerInputFiledColor12.data,
                          }}
                          onClick={() => {
                            setLabelValue("Marla/Biswa"), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </th>

                    {/* <th>Sarsai</th>
                <th>Bigha</th>
                <th>Biswa</th>
                <th>Biswansi</th>
                <th>Area &nbsp;&nbsp;</th> */}
                    <th>
                      {" "}
                      {/* <h6 data-toggle="tooltip" data-placement="top" title="Whether collaboration agreement entered for the Khasra?(yes/no)"> */}
                      <b>
                        Khewat
                        <div style={{ display: "flex" }}>
                          {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                          <ReportProblemIcon
                            style={{
                              color: developerInputFiledColor13.data,
                            }}
                            onClick={() => {
                              setLabelValue("Marla/Biswa"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                        {/* <InfoIcon style={{color:"blue"}}/>  */}
                      </b>
                      &nbsp;&nbsp;
                      {/* </h6> */}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input type="text" className="form-control" disabled />
                    </td>
                    <td>
                      <input type="text" className="form-control" disabled />
                    </td>
                    <td>
                      <input type="text" className="form-control" disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" disabled />
                    </td>
                    <td class="text-center">
                      {" "}
                      <input type="text" className="form-control" disabled />{" "}
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" disabled />
                    </td>
                    {/* <td class="text-center">
                  <input type="text" className="form-control" disabled />
                </td>
                <td class="text-center">
                  <input type="text" className="form-control" disabled />
                </td>
                <td class="text-center">
                  <input type="text" className="form-control" disabled />
                </td>
                <td class="text-center">
                  <input type="text" className="form-control" disabled />
                </td>
                <td class="text-center">
                  <input type="text" className="form-control" disabled />
                </td> */}
                    <td class="text-center">
                      {" "}
                      <input type="text" className="form-control" disabled />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* </div>
      </Collapse> */}
          </Form.Group>
          <br></br>
          <div style={{ position: "relative", marginBottom: 40 }}>
            <Button onClick={() => props.passUncheckedList({ data: uncheckedValue, purpose: purpose })}>Submit</Button>
          </div>
          <hr></hr>
        </div>
      </Collapse>
      {/* </Card> */}
    </Form>
  );
};

export default Genarelinfo;
