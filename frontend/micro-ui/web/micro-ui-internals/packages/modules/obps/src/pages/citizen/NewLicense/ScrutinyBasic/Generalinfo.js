import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import {AiFillCheckCircle, AiFillCloseCircle} from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
// import TextField from '@mui/material/TextField';
// import CalculateIcon from '@mui/icons-material/Calculate';
// import InfoIcon from '@mui/icons-material/Info';
<<<<<<< HEAD
// import * as Icon from "react-bootstrap-icons";
// import { XCircleFill } from "react-bootstrap-icons";
// import { CheckCircleFill } from "react-bootstrap-icons";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import Collapse from "react-bootstrap/Collapse";
import ModalChild from "./Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
=======
import * as Icon from "react-bootstrap-icons";
import { XCircleFill } from "react-bootstrap-icons";

import { CheckCircleFill } from "react-bootstrap-icons";
>>>>>>> d5a9c6deb21711e74387afcc692cc6ccdfa115de

const Genarelinfo = (props) => {
  const [showhide1, setShowhide1] = useState("No");
  const [uncheckedValue, setUncheckedVlue] = useState([]);
  const [checkValue, setCheckedVAlue] = useState([]);
  const [smShow, setSmShow] = useState(false);
  // const [fieldValue, setFieldValue] = useState("");

  const genarelinfo = props.genarelinfo;

  const applicantInfoPersonal = props.ApiResponseData;
  console.log("personal info applicant data1", applicantInfoPersonal);

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
  const [showhide, setShowhide] = useState("No");

  const [purpose, setPurpose] = useState("");
  const handleChangesetPurpose = (e) => {
    setPurpose(e.target.value);
    localStorage.setItem("Purpose", e.target.value);
  };

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

  const [fieldValue, setFieldValue] = useState("");
  // const genarelinfo = props.genarelinfo;

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
  console.log("unchecked values", uncheckedValue);

  console.log(uncheckedValue.indexOf("developer"));

  const developerInputFiledColor = uncheckedValue.filter((obj) => {
    return obj.label === "Purpose Of License";
  });
  const developerInputCheckedFiledColor = checkValue.filter((obj) => {
    return obj.label === "Purpose Of License";
  });
  console.log("color from array", developerInputFiledColor);

  const developerInputFiledColor1 = uncheckedValue.filter((obj) => {
    return obj.label === "Potential Zone";
  });
  const developerInputCheckedFiledColor1 = checkValue.filter((obj) => {
    return obj.label === "Potential Zone";
  });
  const developerInputFiledColor2 = uncheckedValue.filter((obj) => {
    return obj.label === "district";
  });
  const developerInputCheckedFiledColor2 = checkValue.filter((obj) => {
    return obj.label === "district";
  });
  const developerInputFiledColor3 = uncheckedValue.filter((obj) => {
    return obj.label === "State";
  });
  const developerInputCheckedFiledColor3 = checkValue.filter((obj) => {
    return obj.label === "State";
  });
  const developerInputFiledColor4 = uncheckedValue.filter((obj) => {
    return obj.label === "Tehsil";
  });
  const developerInputCheckedFiledColor4 = checkValue.filter((obj) => {
    return obj.label === "Tehsil";
  });
  const developerInputFiledColor5 = uncheckedValue.filter((obj) => {
    return obj.label === "Revenue estate";
  });
  const developerInputCheckedFiledColor5 = checkValue.filter((obj) => {
    return obj.label === "Revenue estate";
  });
  const developerInputFiledColor6 = uncheckedValue.filter((obj) => {
    return obj.label === "Rectangle No.";
  });
  const developerInputCheckedFiledColor6 = checkValue.filter((obj) => {
    return obj.label === "Rectangle No.";
  });
  const developerInputFiledColor7 = uncheckedValue.filter((obj) => {
    return obj.label === "Killa";
  });
  const developerInputCheckedFiledColor7 = checkValue.filter((obj) => {
    return obj.label === "Killa";
  });
  const developerInputFiledColor8 = uncheckedValue.filter((obj) => {
    return obj.label === "Land owner";
  });
  const developerInputCheckedFiledColor8 = checkValue.filter((obj) => {
    return obj.label === "Land owner";
  });

  const developerInputFiledColor10 = uncheckedValue.filter((obj) => {
    return obj.label === "Consolidation Type";
  });
  const developerInputCheckedFiledColor10 = checkValue.filter((obj) => {
    return obj.label === "Consolidation Type";
  });
  const developerInputFiledColor11 = uncheckedValue.filter((obj) => {
    return obj.label === "Kanal/Bigha";
  });
  const developerInputCheckedFiledColor11 = checkValue.filter((obj) => {
    return obj.label === "Kanal/Bigha";
  });
  const developerInputFiledColor12 = uncheckedValue.filter((obj) => {
    return obj.label === "Marla/Biswa";
  });
  const developerInputCheckedFiledColor12 = checkValue.filter((obj) => {
    return obj.label === "Marla/Biswa";
  });
  const developerInputFiledColor13 = uncheckedValue.filter((obj) => {
    return obj.label === "Khewat";
  });
  const developerInputCheckedFiledColor13 = checkValue.filter((obj) => {
    return obj.label === "Khewat";
  });

  console.log("color for the deeloper", developerInputFiledColor);

  return (
    <Form ref={props.generalInfoRef}>
<<<<<<< HEAD
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
          Application Purpose
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Form.Group className="justify-content-center" controlId="formBasicEmail" style={{ border: "2px solid #e9ecef", margin: 10, padding: 10 }}>
            <Row className="ml-auto" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="3">
                <Form.Label>
                  {/* <b></b>  */}
                  <h5>
                    Purpose Of License &nbsp; <span style={{ color: "red" }}>*</span>
                  </h5>
                </Form.Label>

                <div style={{ display: "flex" }}>
                  <Form.Control
                    type="text"
                    placeholder={Genarelinfo !== null ? Genarelinfo.purposeDd : null}
                    onChange={handleChangesetPurpose}
                    height={30}
                    style={{ maxWidth: 200, marginRight: 5 }}
                    disabled
                  >
                    {/* <select className="form-control" id="Puropse" name="potential" placeholder="Puropse" onChange={handleChangesetPurpose} readOnly> */}
                    {/* <option value="">--Purpose--</option>
                    <option value="01">Plotted Commercial</option>
                    <option value="02">Group Housing Commercial</option>
                    <option value="03">AGH </option>
                    <option value="04">Commercial Integrated </option>
                    <option value="05">Commercial Plotted</option>
                    <option value="06">Industrial Colony Commercial</option>
                    <option value="07">IT Colony Commercial</option>
                    <option value="08">DDJAY</option>
                    <option value="12">TOD Group housing</option> */}
                    {/* </select> */}
                  </Form.Control>
                  <ReportProblemIcon
                    style={{
                      color:
                        developerInputFiledColor.length > 0
                          ? developerInputFiledColor[0].color.data
                          : developerInputCheckedFiledColor.length > 0
                          ? developerInputCheckedFiledColor[0].color.data
                          : "#FFB602",
                    }}
                    onClick={() => {
                      setLabelValue("Purpose Of License"),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(Genarelinfo !== null ? Genarelinfo.purposeDd : null);
                    }}
                  ></ReportProblemIcon>
                  {/* <ModalChild
                    labelmodal={labelValue}
                    passmodalData={handlemodaldData}
                    isYesorNoChecked={handleYesOrNochecked}
                    displaymodal={smShow}
                  ></ModalChild> */}
                  <ModalChild
                    labelmodal={labelValue}
                    passmodalData={handlemodaldData}
                    isYesorNoChecked={handleYesOrNochecked}
                    displaymodal={smShow}
                    setColor={setColor}
                    // fieldValue={labelValue}
                    fieldValue={fieldValue}
                    // remarksUpdate={currentRemarks}
                  ></ModalChild>
                </div>
              </Col>
              <div className="col col-3">
                <label htmlFor="potential">
                  <h5>
                    Potential Zone:&nbsp;<span style={{ color: "red" }}>*</span>
                  </h5>
                </label>
                &nbsp;&nbsp; &nbsp;&nbsp;
                <div style={{ display: "flex" }}>
                  <Form.Control
                    height={30}
                    style={{ maxWidth: 200, marginRight: 5 }}
                    placeholder={Genarelinfo !== null ? Genarelinfo.potential : null}
                    className="form-control"
                    id="potential"
                    name="potential"
                    disabled
                  >
                    {/* // <option value=""></option>
                    // <option value="K.Mishra">Hyper</option>
                    // <option value="potential 1">High I</option>
                    // <option value="potential 2">High II</option>
                    // <option value="potential 2">Medium</option>
                    // <option value="potential 2">Low I</option>
                    // <option value="potential 2">Low II</option> */}
                  </Form.Control>
                  {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} readOnly></Form.Control> */}
                  <ReportProblemIcon
                    style={{
                      color:
                        developerInputFiledColor1.length > 0
                          ? developerInputFiledColor1[0].color.data
                          : developerInputCheckedFiledColor1.length > 0
                          ? developerInputCheckedFiledColor1[0].color.data
                          : "#FFB602",
                    }}
                    onClick={() => {
                      setLabelValue("Potential Zone"),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(Genarelinfo !== null ? Genarelinfo.potential : null);
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <h5>
                      District: &nbsp; <span style={{ color: "red" }}>*</span>
                    </h5>
                    {/* <span style={{ color: "red" }}>*</span> */}
                  </Form.Label>
                  &nbsp;&nbsp;
                </div>
                <div>
                  <div style={{ display: "flex" }}>
                    <Form.Control
                      height={30}
                      style={{ maxWidth: 200, marginRight: 5 }}
                      placeholder={Genarelinfo !== null ? Genarelinfo.district : null}
                      disabled
                    >
                      {/* <option value="1">no district</option> */}
                    </Form.Control>
                    <ReportProblemIcon
                      style={{
                        color:
                          developerInputFiledColor2.length > 0
                            ? developerInputFiledColor2[0].color.data
                            : developerInputCheckedFiledColor2.length > 0
                            ? developerInputCheckedFiledColor2[0].color.data
                            : "#FFB602",
                      }}
                      onClick={() => {
                        setLabelValue("district"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(Genarelinfo !== null ? Genarelinfo.district : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </div>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <h5>
                      State &nbsp; <span style={{ color: "red" }}>*</span>
                    </h5>
                    {/* <span style={{ color: "red" }}>*</span> */}
                  </Form.Label>
                  &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                </div>
                <div>
                  <div style={{ display: "flex" }}>
                    <Form.Control
                      height={30}
                      style={{ maxWidth: 200, marginRight: 5 }}
                      placeholder={Genarelinfo !== null ? Genarelinfo.state : null}
                      disabled
                    ></Form.Control>
                    <ReportProblemIcon
                      style={{
                        color:
                          developerInputFiledColor3.length > 0
                            ? developerInputFiledColor3[0].color.data
                            : developerInputCheckedFiledColor3.length > 0
                            ? developerInputCheckedFiledColor3[0].color.data
                            : "#FFB602",
                      }}
                      onClick={() => {
                        setLabelValue("State"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(Genarelinfo !== null ? Genarelinfo.state : null);
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
              </p>
            </div>
            {/* <div className="ml-auto"></div> */}
            <br></br>

            <div>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>
                      Tehsil
                      <div style={{ display: "flex" }}>
                        {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                        <ReportProblemIcon
                          style={{
                            color:
                              developerInputFiledColor4.length > 0
                                ? developerInputFiledColor4[0].color.data
                                : developerInputCheckedFiledColor4.length > 0
                                ? developerInputCheckedFiledColor4[0].color.data
                                : "#FFB602",
                          }}
                          onClick={() => {
                            setLabelValue("Tehsil"), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </th>
                    <th>
                      Revenue estate
                      <div style={{ display: "flex" }}>
                        {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                        <ReportProblemIcon
                          style={{
                            color:
                              developerInputFiledColor5.length > 0
                                ? developerInputFiledColor5[0].color.data
                                : developerInputCheckedFiledColor5.length > 0
                                ? developerInputCheckedFiledColor5[0].color.data
                                : "#FFB602",
                          }}
                          onClick={() => {
                            setLabelValue("Revenue estate"), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </th>
                    <th>
                      Rectangle No.
                      <div style={{ display: "flex" }}>
                        {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                        <ReportProblemIcon
                          style={{
                            color:
                              developerInputFiledColor6.length > 0
                                ? developerInputFiledColor6[0].color.data
                                : developerInputCheckedFiledColor6.length > 0
                                ? developerInputCheckedFiledColor6[0].color.data
                                : "#FFB602",
                          }}
                          onClick={() => {
                            setLabelValue("Rectangle No."), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </th>
                    <th>
                      Killa
                      <div style={{ display: "flex" }}>
                        {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                        <ReportProblemIcon
                          style={{
                            color:
                              developerInputFiledColor7.length > 0
                                ? developerInputFiledColor7[0].color.data
                                : developerInputCheckedFiledColor7.length > 0
                                ? developerInputCheckedFiledColor7[0].color.data
                                : "#FFB602",
                          }}
                          onClick={() => {
                            setLabelValue("Killa"), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </th>
                    <th>
                      Land owner
                      <div style={{ display: "flex" }}>
                        {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                        <ReportProblemIcon
                          style={{
                            color:
                              developerInputFiledColor8.length > 0
                                ? developerInputFiledColor8[0].color.data
                                : developerInputCheckedFiledColor8.length > 0
                                ? developerInputCheckedFiledColor8[0].color.data
                                : "#FFB602",
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
                            color:
                              developerInputFiledColor10.length > 0
                                ? developerInputFiledColor10[0].color.data
                                : developerInputCheckedFiledColor10.length > 0
                                ? developerInputCheckedFiledColor10[0].color.data
                                : "#FFB602",
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
                            color:
                              developerInputFiledColor11.length > 0
                                ? developerInputFiledColor11[0].color.data
                                : developerInputCheckedFiledColor11.length > 0
                                ? developerInputCheckedFiledColor11[0].color.data
                                : "#FFB602",
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
                            color:
                              developerInputFiledColor12.length > 0
                                ? developerInputFiledColor12[0].color.data
                                : developerInputCheckedFiledColor12.length > 0
                                ? developerInputCheckedFiledColor12[0].color.data
                                : "#FFB602",
                          }}
                          onClick={() => {
                            setLabelValue("Marla/Biswa"), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </th>

                    {/* <th>Sarsai</th>
=======
      <Form.Group className="justify-content-center" controlId="formBasicEmail">
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>Puropse Of License</b> <span style={{ color: "red" }}>*</span>
              </Form.Label>
              &nbsp;&nbsp;
              <Form.Check
                value="Puropse Of License"
                type="radio"
                id="default-radio"
                label={<CheckCircleFill class="text-success" />}
                // onChange={(e) => {setPurpose(e.target.value),localStorage.setItem("Purpose",e.target.value)}}
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                name="group19"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                value="Puropse Of License"
                type="radio"
                id="default-radio"
                label={<XCircleFill class="text-danger" />}
                name="group19"
                inline
              ></Form.Check>
            </div>
            {/* <Form.Select type="text" placeholder="Puropse"  readOnly> */}
            <select className="form-control" id="Puropse" name="potential" readOnly onChange={(e) => handleChangesetPurpose(e)}>
              <option value="">--Puropse--</option>
              <option value="01">Plotted Commercial</option>
              <option value="02">Group Housing Commercial</option>
              <option value="03">AGH </option>
              <option value="04">Commercial Integrated </option>
              <option value="05">Commercial Plotted</option>
              <option value="06">Industrial Colony Commercial</option>
              <option value="07">IT Colony Commercial</option>
              <option value="08">DDJAY</option>
              <option value="12">TOD Group housing</option>
            </select>
            {/* </Form.Select> */}
          </Col>
          <div className="col col-3">
            <label htmlFor="potential">
              <h6>
                <b>Potential Zone:</b>
              </h6>
            </label>
            &nbsp;&nbsp;
            <Form.Check
              value="Potential Zone"
              type="radio"
              id="default-radio"
              label={<CheckCircleFill class="text-success" />}
              name="group20"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Potential Zone"
              type="radio"
              id="default-radio"
              label={<XCircleFill class="text-danger" />}
              name="group20"
              inline
            ></Form.Check>
            <select className="form-control" id="potential" name="potential" readOnly>
              <option value="">--Potential Zone--</option>
              <option value="K.Mishra">Hyper</option>
              <option value="potential 1">High I</option>
              <option value="potential 2">High II</option>
              <option value="potential 2">Medium</option>
              <option value="potential 2">Low I</option>
              <option value="potential 2">Low II</option>
            </select>
          </div>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>District</b> <span style={{ color: "red" }}>*</span>
              </Form.Label>
              &nbsp;&nbsp;
              <Form.Check
                value="District"
                type="radio"
                id="default-radio"
                label={<CheckCircleFill class="text-success" />}
                name="group21"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                value="District"
                type="radio"
                id="default-radio"
                label={<XCircleFill class="text-danger" />}
                name="group21"
                inline
              ></Form.Check>
            </div>
            <Form.Select type="text" defaultValue="Select" placeholder="District" readOnly>
              <option value="1">no district</option>
            </Form.Select>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>State </b>
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              &nbsp;&nbsp;
              <Form.Check
                value="State"
                type="radio"
                id="default-radio"
                label={<CheckCircleFill class="text-success" />}
                name="group22"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                value="State"
                type="radio"
                id="default-radio"
                label={<XCircleFill class="text-danger" />}
                name="group22"
                inline
              ></Form.Check>
            </div>
            <Form.Control type="text" defaultValue="Haryana" disabled></Form.Control>
          </Col>
        </Row>

        <div className="ml-auto" style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 24 }}>2. Details of applied land:</h2>
          <p>
            Note: The term “Collaboration agreement" shall include all Development agreements/ Joint Venture agreements/ Joint Development agreements/
            Memorandum of Understanding etc. and similar agreements registered with competent authority.
          </p>
          <p>
            <b>(i) Khasra-wise information to be provided in the following format:</b>&nbsp;&nbsp;
            {/* <Form.Check
              value="Name of the authorized person to sign the application"
              type="radio"
              id="default-radio"
              label={<CheckCircleFill class="text-success" />}
              name="group23"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Name of the authorized person to sign the application"
              type="radio"
              id="default-radio"
              label={<XCircleFill class="text-danger" />}
              name="group23"
              inline
            ></Form.Check> */}
          </p>
        </div>
        <div className="ml-auto">
          <Button variant="primary" onClick={handleShow}>
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
                        label={<CheckCircleFill class="text-success" />}
                        name="group24"
                        inline
                      ></Form.Check>
                      <Form.Check
                        onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="Tehsil"
                        type="radio"
                        id="default-radio"
                        label={<XCircleFill class="text-danger" />}
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
                        label={<CheckCircleFill class="text-success" />}
                        name="group25"
                        inline
                      ></Form.Check>
                      <Form.Check
                        onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="Name of Revenue estate"
                        type="radio"
                        id="default-radio"
                        label={<XCircleFill class="text-danger" />}
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
                        label={<CheckCircleFill class="text-success" />}
                        name="group26"
                        inline
                      ></Form.Check>
                      <Form.Check
                        onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="Rectangle No./Mustil"
                        type="radio"
                        id="default-radio"
                        label={<XCircleFill class="text-danger" />}
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
                        label={<CheckCircleFill class="text-success" />}
                        name="group27"
                        inline
                      ></Form.Check>
                      <Form.Check
                        onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="Sector"
                        type="radio"
                        id="default-radio"
                        label={<XCircleFill class="text-danger" />}
                        name="group27"
                        inline
                      ></Form.Check>
                      <input type="number" className="form-control" />
                    </div>
                  </Col>

                  <Col md={4} xxl lg="4">
                    <div>
                      <label>
                        <h6>
                          <b>Consolidation Type</b>
                        </h6>{" "}
                      </label>
                      &nbsp;&nbsp;
                      <Form.Check
                        value="Consolidation Type"
                        type="radio"
                        id="default-radio"
                        label={<CheckCircleFill class="text-success" />}
                        name="group28"
                        inline
                      ></Form.Check>
                      <Form.Check
                        onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="Consolidation Type"
                        type="radio"
                        id="default-radio"
                        label={<XCircleFill class="text-danger" />}
                        name="group28"
                        inline
                      ></Form.Check>
                      <Form.Select type="select" defaultValue="Select">
                        <option>Consolidated</option>
                        <option>Non Consolidated</option>
                      </Form.Select>
                    </div>
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
                            label={<CheckCircleFill class="text-success" />}
                            name="group29"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Killa"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
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
                            label={<CheckCircleFill class="text-success" />}
                            name="group30"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Khewat"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
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
                            label={<CheckCircleFill class="text-success" />}
                            name="group31"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value=" Area in Kanal "
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
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
                            label={<CheckCircleFill class="text-success" />}
                            name="group32"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Area in Marla"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
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
                        label={<CheckCircleFill class="text-success" />}
                        name="group33"
                        inline
                      ></Form.Check>
                      <Form.Check
                        onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="Name of Land Owner"
                        type="radio"
                        id="default-radio"
                        label={<XCircleFill class="text-danger" />}
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
                      <b>(h)&nbsp;Collaboration agreement&nbsp; </b>&nbsp;&nbsp;
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
                      label={<CheckCircleFill class="text-success" />}
                      name="group34"
                      inline
                    ></Form.Check>
                    <Form.Check
                      onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                      value="Collaboration agreement"
                      type="radio"
                      id="default-radio"
                      label={<XCircleFill class="text-danger" />}
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
                            label={<CheckCircleFill class="text-success" />}
                            name="group35"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Name of the developer company / Firm/ LLP etc. with whom collaboration agreement entered"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
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
                            label={<CheckCircleFill class="text-success" />}
                            name="group36"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Date of registering collaboration agreement"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
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
                            label={<CheckCircleFill class="text-success" />}
                            name="group37"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Date of validity of collaboration agreement"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
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
                            label={<CheckCircleFill class="text-success" />}
                            name="group38"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Whether collaboration agreement irrevocable"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
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
                            label={<CheckCircleFill class="text-success" />}
                            name="group39"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Name of authorized signatory on behalf of land owner(s)"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
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
                            label={<CheckCircleFill class="text-success" />}
                            name="group40"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Name of authorized signatory on behalf of developer to sign Collaboration agreement"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
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
                            label={<CheckCircleFill class="text-success" />}
                            name="group41"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Registring Authority"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
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
                            label={<CheckCircleFill class="text-success" />}
                            name="group42"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Registring Authority document"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
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
          </div>

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
                <th>Tehsil</th>
                <th>Revenue estate</th>
                <th>Rectangle No.</th>
                <th>Killa</th>
                <th>Land owner</th>
                <th>Consolidation Type</th>
                <th>Kanal</th>
                <th>Marla</th>
                <th>Sarsai</th>
>>>>>>> d5a9c6deb21711e74387afcc692cc6ccdfa115de
                <th>Bigha</th>
                <th>Biswa</th>
                <th>Biswansi</th>
                <th>Area &nbsp;&nbsp;</th> */}
                    <th>
                      {" "}
                      {/* <h6 data-toggle="tooltip" data-placement="top" title="Whether collaboration agreement entered for the Khasra?(yes/no)"> */}
                      Khewat
                      <div style={{ display: "flex" }}>
                        {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                        <ReportProblemIcon
                          style={{
                            color:
                              developerInputFiledColor13.length > 0
                                ? developerInputFiledColor13[0].color.data
                                : developerInputCheckedFiledColor13.length > 0
                                ? developerInputCheckedFiledColor13[0].color.data
                                : "#FFB602",
                          }}
                          onClick={() => {
                            setLabelValue("Khewat"), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                      {/* <InfoIcon style={{color:"blue"}}/>  */}
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
            <div style={{ position: "relative", marginBottom: 40 }}>
              <Button onClick={() => props.passUncheckedList({ data: uncheckedValue, purpose: purpose })}>Submit</Button>
            </div>
          </Form.Group>
          <br></br>

          {/* <hr></hr> */}
        </div>
<<<<<<< HEAD
      </Collapse>
      {/* </Card> */}
=======
      </Form.Group>
      <br></br>
      <div style={{ position: "relative", marginBottom: 40 }}>
        <Button
          onClick={() => {
            props.passUncheckedList({ data: uncheckedValue, purpose: purpose });
          }}
        >
          Submit
        </Button>
      </div>
      <hr></hr>
>>>>>>> d5a9c6deb21711e74387afcc692cc6ccdfa115de
    </Form>
  );
};

export default Genarelinfo;
