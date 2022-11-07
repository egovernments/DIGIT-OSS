import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
// import InfoIcon from "@mui/icons-material/Info";

import Collapse from "react-bootstrap/Collapse";

import ModalChild from "../Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import RemoveIcon from "@mui/icons-material/Remove";

const LicenseDetailsScrutiny = (props) => {
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
  // useEffect(() => {
  //   console.log("called");
  //   handlemodalsubmit();
  // }, [modaldData.Remarks]);
  // useEffect(() => {
  //   props.passUncheckedList({ data: uncheckedValue });
  // }, [uncheckedValue]);

  // useEffect(() => {
  //   props.passCheckedList({ data: checkValue });
  // }, [checkValue]);
  // console.log("unchecked values", uncheckedValue);

  // console.log(uncheckedValue.indexOf("developer"));

  const developerInputFiledColor = uncheckedValue.filter((obj) => {
    return obj.label === "developer";
  });
  const developerInputCheckedFiledColor = checkValue.filter((obj) => {
    return obj.label === "developer";
  });
  console.log("color from array", developerInputFiledColor);

  const developerInputFiledColor1 = uncheckedValue.filter((obj) => {
    return obj.label === "Authorized Person Name";
  });
  const developerInputCheckedFiledColor1 = checkValue.filter((obj) => {
    return obj.label === "Authorized Person Name";
  });
  const developerInputFiledColor2 = uncheckedValue.filter((obj) => {
    return obj.label === "Authorized Mobile No";
  });
  const developerInputCheckedFiledColor2 = checkValue.filter((obj) => {
    return obj.label === "Authorized Mobile No";
  });
  const developerInputFiledColor3 = uncheckedValue.filter((obj) => {
    return obj.label === "Authorized MobileNo. 2";
  });
  const developerInputCheckedFiledColor3 = checkValue.filter((obj) => {
    return obj.label === "Authorized MobileNo. 2";
  });
  const developerInputFiledColor4 = uncheckedValue.filter((obj) => {
    return obj.label === "Email ID";
  });
  const developerInputCheckedFiledColor4 = checkValue.filter((obj) => {
    return obj.label === "Email ID";
  });
  const developerInputFiledColor5 = uncheckedValue.filter((obj) => {
    return obj.label === "PAN No.";
  });
  const developerInputCheckedFiledColor5 = checkValue.filter((obj) => {
    return obj.label === "PAN No.";
  });
  const developerInputFiledColor6 = uncheckedValue.filter((obj) => {
    return obj.label === "Address  1";
  });
  const developerInputCheckedFiledColor6 = checkValue.filter((obj) => {
    return obj.label === "Address  1";
  });
  const developerInputFiledColor7 = uncheckedValue.filter((obj) => {
    return obj.label === "Village/City";
  });
  const developerInputCheckedFiledColor7 = checkValue.filter((obj) => {
    return obj.label === "Village/City";
  });
  const developerInputFiledColor8 = uncheckedValue.filter((obj) => {
    return obj.label === "Pincode";
  });
  const developerInputCheckedFiledColor8 = checkValue.filter((obj) => {
    return obj.label === "Pincode";
  });
  const developerInputFiledColor9 = uncheckedValue.filter((obj) => {
    return obj.label === "Tehsil";
  });
  const developerInputCheckedFiledColor9 = checkValue.filter((obj) => {
    return obj.label === "Tehsil";
  });
  const developerInputFiledColor10 = uncheckedValue.filter((obj) => {
    return obj.label === "District";
  });
  const developerInputCheckedFiledColor10 = checkValue.filter((obj) => {
    return obj.label === "District";
  });
  const developerInputFiledColor11 = uncheckedValue.filter((obj) => {
    return obj.label === "State";
  });
  const developerInputCheckedFiledColor11 = checkValue.filter((obj) => {
    return obj.label === "State";
  });
  const developerInputFiledColor12 = uncheckedValue.filter((obj) => {
    return obj.label === "Status (Individual/ Company/ Firm/ LLP etc.)";
  });
  const developerInputCheckedFiledColor12 = checkValue.filter((obj) => {
    return obj.label === "Status (Individual/ Company/ Firm/ LLP etc.)";
  });
  const developerInputFiledColor13 = uncheckedValue.filter((obj) => {
    return obj.label === "LC-I signed by";
  });
  const developerInputCheckedFiledColor13 = checkValue.filter((obj) => {
    return obj.label === "LC-I signed by";
  });
  const developerInputFiledColor14 = uncheckedValue.filter((obj) => {
    return obj.label === "If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)";
  });
  const developerInputCheckedFiledColor14 = checkValue.filter((obj) => {
    return obj.label === "If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)";
  });
  const developerInputFiledColor15 = uncheckedValue.filter((obj) => {
    return obj.label === "Permanent address in case of individual/ registered office address in case other than individual";
  });
  const developerInputCheckedFiledColor15 = checkValue.filter((obj) => {
    return obj.label === "Permanent address in case of individual/ registered office address in case other than individual";
  });
  const developerInputFiledColor16 = uncheckedValue.filter((obj) => {
    return obj.label === "Address for communication";
  });
  const developerInputCheckedFiledColor16 = checkValue.filter((obj) => {
    return obj.label === "Address for communication";
  });
  const developerInputFiledColor17 = uncheckedValue.filter((obj) => {
    return obj.label === "Name of the authorized person to sign the application";
  });
  const developerInputCheckedFiledColor17 = checkValue.filter((obj) => {
    return obj.label === "Name of the authorized person to sign the application";
  });
  const developerInputFiledColor18 = uncheckedValue.filter((obj) => {
    return obj.label === "Email ID for communication";
  });
  const developerInputCheckedFiledColor18 = checkValue.filter((obj) => {
    return obj.label === "Email ID for communication";
  });
  const developerInputFiledColor19 = uncheckedValue.filter((obj) => {
    return obj.label === "Developer's type.";
  });
  const developerInputCheckedFiledColor19 = checkValue.filter((obj) => {
    return obj.label === "Developer's type";
  });
  const developerInputFiledColor20 = uncheckedValue.filter((obj) => {
    return obj.label === "Name";
  });
  const developerInputCheckedFiledColor20 = checkValue.filter((obj) => {
    return obj.label === "Name";
  });
  const developerInputFiledColor21 = uncheckedValue.filter((obj) => {
    return obj.label === "Email";
  });
  const developerInputCheckedFiledColor21 = checkValue.filter((obj) => {
    return obj.label === "Email";
  });
  const developerInputFiledColor22 = uncheckedValue.filter((obj) => {
    return obj.label === "Mobile No.";
  });
  const developerInputCheckedFiledColor22 = checkValue.filter((obj) => {
    return obj.label === "Mobile No.";
  });
  //////////
  const developerInputFiledColor23 = uncheckedValue.filter((obj) => {
    return obj.label === "CIN Number";
  });
  const developerInputCheckedFiledColor23 = checkValue.filter((obj) => {
    return obj.label === "CIN Number";
  });
  const developerInputFiledColor24 = uncheckedValue.filter((obj) => {
    return obj.label === "Company Name";
  });
  const developerInputCheckedFiledColor24 = checkValue.filter((obj) => {
    return obj.label === "Company Name";
  });
  const developerInputFiledColor25 = uncheckedValue.filter((obj) => {
    return obj.label === "Date of Incorporation";
  });
  const developerInputCheckedFiledColor25 = checkValue.filter((obj) => {
    return obj.label === "Date of Incorporation";
  });

  const developerInputFiledColor26 = uncheckedValue.filter((obj) => {
    return obj.label === "Registered Address";
  });
  const developerInputCheckedFiledColor26 = checkValue.filter((obj) => {
    return obj.label === "Registered Address";
  });
  const developerInputFiledColor27 = uncheckedValue.filter((obj) => {
    return obj.label === "Email";
  });
  const developerInputCheckedFiledColor27 = checkValue.filter((obj) => {
    return obj.label === "Email";
  });
  const developerInputFiledColor28 = uncheckedValue.filter((obj) => {
    return obj.label === "Mobile No.";
  });
  const developerInputCheckedFiledColor28 = checkValue.filter((obj) => {
    return obj.label === "Mobile No.";
  });
  const developerInputFiledColor29 = uncheckedValue.filter((obj) => {
    return obj.label === "GST No.";
  });
  const developerInputCheckedFiledColor29 = checkValue.filter((obj) => {
    return obj.label === "GST No.";
  });
  // const handleChange = (e) => {
  //   this.setState({ isRadioSelected: true });
  // };
  const [showhide9, setShowhide9] = useState("0");
  const handleshow9 = (e) => {
    const getshow = e.target.value;
    setShowhide9(getshow);
  };

  console.log("color for the deeloper", developerInputFiledColor);

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
        <span style={{ color: "#817f7f" }} className="">
          Add Info
        </span>
        {open ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>

      <Collapse in={open}>
        <div id="example-collapse-text" style={{ marginTop: 5, paddingLeft: 5, paddingRight: 5 }}>
          <Form.Group style={{ display: props.displayLicenseDetails, margin: 5 }}>
            <div>
              <Card style={{ margin: 2 }}>
                <h5>Developer's type</h5>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-12">
                      {/* <div className="form-group row"> */}
                      <div className="col-sm-4">
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
                        </Form.Select> */}
                        <div style={{ display: "flex" }}>
                          <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color:
                                developerInputFiledColor19.length > 0
                                  ? developerInputFiledColor19[0].color.data
                                  : developerInputCheckedFiledColor19.length > 0
                                  ? developerInputCheckedFiledColor19[0].color.data
                                  : "#FFB602",
                            }}
                            onClick={() => {
                              setLabelValue("Developer's type"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {showhide9 === "01" && (
                <div>
                  <Card style={{ margin: 5 }}>
                    <h5>Developer Details</h5>
                    <Row>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5>Name &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color:
                                developerInputFiledColor20.length > 0
                                  ? developerInputFiledColor20[0].color.data
                                  : developerInputCheckedFiledColor20.length > 0
                                  ? developerInputCheckedFiledColor20[0].color.data
                                  : "#FFB602",
                            }}
                            onClick={() => {
                              setLabelValue("Name"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                          <ModalChild
                            labelmodal={labelValue}
                            passmodalData={handlemodaldData}
                            isYesorNoChecked={handleYesOrNochecked}
                            displaymodal={smShow}
                            setColor={setColor}
                          ></ModalChild>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5>Email &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color:
                                developerInputFiledColor21.length > 0
                                  ? developerInputFiledColor21[0].color.data
                                  : developerInputCheckedFiledColor21.length > 0
                                  ? developerInputCheckedFiledColor21[0].color.data
                                  : "#FFB602",
                            }}
                            onClick={() => {
                              setLabelValue("Email"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5>Mobile No. &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color:
                                developerInputFiledColor22.length > 0
                                  ? developerInputFiledColor22[0].color.data
                                  : developerInputCheckedFiledColor22.length > 0
                                  ? developerInputCheckedFiledColor22[0].color.data
                                  : "#FFB602",
                            }}
                            onClick={() => {
                              setLabelValue("Mobile No."), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </div>
              )}

              {showhide9 === "02" && (
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
                          <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color:
                                developerInputFiledColor23.length > 0
                                  ? developerInputFiledColor23[0].color.data
                                  : developerInputCheckedFiledColor23.length > 0
                                  ? developerInputCheckedFiledColor23[0].color.data
                                  : "#FFB602",
                            }}
                            onClick={() => {
                              setLabelValue("CIN Number"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5>Company Name &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color:
                                developerInputFiledColor24.length > 0
                                  ? developerInputFiledColor24[0].color.data
                                  : developerInputCheckedFiledColor24.length > 0
                                  ? developerInputCheckedFiledColor24[0].color.data
                                  : "#FFB602",
                            }}
                            onClick={() => {
                              setLabelValue("Company Name"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5>Date of Incorporation &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color:
                                developerInputFiledColor25.length > 0
                                  ? developerInputFiledColor25[0].color.data
                                  : developerInputCheckedFiledColor25.length > 0
                                  ? developerInputCheckedFiledColor25[0].color.data
                                  : "#FFB602",
                            }}
                            onClick={() => {
                              setLabelValue("Date of Incorporation"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5>Registered Address &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color:
                                developerInputFiledColor26.length > 0
                                  ? developerInputFiledColor26[0].color.data
                                  : developerInputCheckedFiledColor26.length > 0
                                  ? developerInputCheckedFiledColor26[0].color.data
                                  : "#FFB602",
                            }}
                            onClick={() => {
                              setLabelValue("Registered Address"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5>Email &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color:
                                developerInputFiledColor27.length > 0
                                  ? developerInputFiledColor27[0].color.data
                                  : developerInputCheckedFiledColor27.length > 0
                                  ? developerInputCheckedFiledColor27[0].color.data
                                  : "#FFB602",
                            }}
                            onClick={() => {
                              setLabelValue("Email"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5>Mobile No. &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color:
                                developerInputFiledColor28.length > 0
                                  ? developerInputFiledColor28[0].color.data
                                  : developerInputCheckedFiledColor28.length > 0
                                  ? developerInputCheckedFiledColor28[0].color.data
                                  : "#FFB602",
                            }}
                            onClick={() => {
                              setLabelValue("Mobile No."), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5>GST No. &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color:
                                developerInputFiledColor29.length > 0
                                  ? developerInputFiledColor29[0].color.data
                                  : developerInputCheckedFiledColor29.length > 0
                                  ? developerInputCheckedFiledColor29[0].color.data
                                  : "#FFB602",
                            }}
                            onClick={() => {
                              setLabelValue("GST No."), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                  <Card style={{ margin: 5 }}>
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
                          {/* {modalValuesArray.length > 0 ? (
                              modalValuesArray.map((elementInArray, input) => {
                                return ( */}
                          <tr>
                            <td>{/* {input + 1} */}</td>
                            <td>
                              {/* <input
                                      type="text"
                                      value={elementInArray.name}
                                      placeholder={elementInArray.name}
                                      disabled
                                      disabled="disabled"
                                      class="employee-card-input"
                                    /> */}
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                            </td>
                            <td>
                              {/* <input
                                      type="text"
                                      value={elementInArray.designition}
                                      placeholder={elementInArray.designition}
                                      disabled
                                      disabled="disabled"
                                      class="employee-card-input"
                                    /> */}
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                            </td>
                            <td>
                              {/* <input
                                      type="text"
                                      value={elementInArray.percentage}
                                      placeholder={elementInArray.percentage}
                                      disabled
                                      disabled="disabled"
                                      class="employee-card-input"
                                   /> */}
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                            </td>
                            <td>
                              {/* <div className="row">
                                        <button className="btn btn-sm col-md-6">
                                          <VisibilityIcon color="info" className="icon" />
                                        </button>
                                        <button className="btn btn-sm col-md-6">
                                          <FileDownloadIcon color="primary" />
                                        </button>
                                      </div> */}
                            </td>
                          </tr>
                          {/* );
                              })
                            ) : (
                              <p className="text-danger text-center">Click on the Add More Button</p>
                            )} */}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                  {/* {showDevTypeFields === "02" && (
                  <div className="card mb-3">
                    <h5 className="card-title fw-bold">Directors Information</h5>
                    <div className="card-body"> */}
                  <div className="table-bd">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr. No</th>
                          <th>DIN Number</th>
                          <th>Name</th>
                          <th>PAN Number</th>
                          <th>Upload PDF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {DirectorData.map((elementInArray, input) => {
                              return ( */}
                        <tr
                        // key={input}
                        >
                          <td>{/* {input + 1} */}</td>
                          <td>
                            {/* <input
                                      type="text"
                                      disabled="disabled"
                                      value={elementInArray.din}
                                      placeholder={elementInArray.din}
                                      class="employee-card-input"
                                    /> */}
                            <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                          </td>
                          <td>
                            {/* <input
                                      type="text"
                                      disabled="disabled"
                                      value={elementInArray.name}
                                      placeholder={elementInArray.name}
                                      class="employee-card-input"
                                    /> */}
                            <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                          </td>
                          <td>
                            {/* <input
                                      type="text"
                                      value={elementInArray.contactNumber}
                                      placeholder={elementInArray.contactNumber}
                                      class="employee-card-input"
                                    /> */}
                            <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} disabled></Form.Control>
                          </td>
                          <td>{/* <input type="file" value={uploadPdf} placeholder="" class="employee-card-input" /> */}</td>
                        </tr>
                        {/* );
                            })} */}
                      </tbody>
                    </table>
                  </div>
                  {/* </div>
                  </div>
                )} */}
                  {/* <Card style={{ margin: 5 }}></Card> */}
                </div>
              )}
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
