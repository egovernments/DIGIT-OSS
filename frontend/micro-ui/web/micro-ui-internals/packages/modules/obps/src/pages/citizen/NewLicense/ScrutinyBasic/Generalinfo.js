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
import RemoveIcon from "@mui/icons-material/Remove";

import Collapse from "react-bootstrap/Collapse";
import ModalChild from "./Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const Genarelinfo = (props) => {
  const [showhide1, setShowhide1] = useState("No");
  const [uncheckedValue, setUncheckedVlue] = useState([]);
  const [checkValue, setCheckedVAlue] = useState([]);
  const [smShow, setSmShow] = useState(false);
  // const [fieldValue, setFieldValue] = useState("");

  const genarelinfo = props.genarelinfo;
  const dataIcons = props. dataForIcons;

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

  // const [purpose, setPurpose] = useState("");
  // const handleChangesetPurpose = (e) => {
  //   setPurpose(e.target.value);
  //   localStorage.setItem("Purpose", e.target.value);
  // };

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
                    <th class="fw-normal">
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
                    <th class="fw-normal">
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
                    <th class="fw-normal">
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
                    <th class="fw-normal">
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
                    <th class="fw-normal">
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
                    <th class="fw-normal">
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
                    <th class="fw-normal">
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
                    <th class="fw-normal">
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
                <th>Bigha</th>
                <th>Biswa</th>
                <th>Biswansi</th>
                <th>Area &nbsp;&nbsp;</th> */}
                    <th class="fw-normal">
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
            {/* <div style={{ position: "relative", marginBottom: 40 }}>
              <Button onClick={() => props.passUncheckedList({ data: uncheckedValue, purpose: purpose })}>Submit</Button>
            </div> */}
          </Form.Group>
          <br></br>

          {/* <hr></hr> */}
        </div>
      </Collapse>
      {/* </Card> */}
    </Form>
  );
};

export default Genarelinfo;
