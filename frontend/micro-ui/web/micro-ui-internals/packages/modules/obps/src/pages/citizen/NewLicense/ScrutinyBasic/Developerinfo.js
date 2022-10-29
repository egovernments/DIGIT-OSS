import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import {AiFillCheckCircle, AiFillCloseCircle} from "react-icons/ai";
// import CalculateIcon from '@mui/icons-material/Calculate';
// import InfoIcon from '@mui/icons-material/Info';
// import * as Icon from "react-bootstrap-icons";
// import { XCircleFill } from "react-bootstrap-icons";
// import { CheckCircleFill } from "react-bootstrap-icons";
// import { ArrowDownCircleFill } from "react-bootstrap-icons";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
import ModalChild from "./Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const Developerinfo = (props) => {
  const [vacant, setVacant] = useState("");
  const [construction, setConstruction] = useState("");
  const [typeCons, setTypeCons] = useState("");
  const [ht, setHt] = useState("");
  const [htRemark, setHtRemark] = useState("");
  const [gas, setGas] = useState("");
  const [gasRemark, setGasRemark] = useState("");
  const [nallah, setNallah] = useState("");
  const [nallahRemark, setNallahremark] = useState("");
  const [road, setRoad] = useState("");
  const [roadWidth, setRoadwidth] = useState("");
  const [land, setLand] = useState("");
  const [landRemark, setLandRemark] = useState("");
  const [layoutPlan, setLayoutPlan] = useState("");
  const [open, setOpen] = useState(false);
  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };

  const [showhide1, setShowhide1] = useState("No");
  const [showhide2, setShowhide2] = useState("No");
  const [showhide3, setShowhide3] = useState("No");
  const [showhide4, setShowhide4] = useState("No");
  const [showhide5, setShowhide5] = useState("No");
  const [showhide6, setShowhide6] = useState("No");
  const [showhide7, setShowhide7] = useState("No");
  const [showhide8, setShowhide8] = useState("No");
  const [showhide9, setShowhide9] = useState("No");
  const [showhide0, setShowhide0] = useState("No");
  const [showhide13, setShowhide13] = useState("No");
  const [showhide18, setShowhide18] = useState("No");
  const [showhide16, setShowhide16] = useState("No");
  const [showhide17, setShowhide17] = useState("No");
  const [open2, setOpen2] = useState(false);
  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide1(getshow);
  };
  const handleshow1 = (e) => {
    const getshow = e.target.value;
    setShowhide2(getshow);
  };
  const handleshow2 = (e) => {
    const getshow = e.target.value;
    setShowhide3(getshow);
  };
  const handleshow3 = (e) => {
    const getshow = e.target.value;
    setShowhide4(getshow);
  };
  const handleshow4 = (e) => {
    const getshow = e.target.value;
    setShowhide4(getshow);
  };
  const handleshow5 = (e) => {
    const getshow = e.target.value;
    setShowhide5(getshow);
  };
  const handleshow6 = (e) => {
    const getshow = e.target.value;
    setShowhide6(getshow);
  };
  const handleshow7 = (e) => {
    const getshow = e.target.value;
    setShowhide7(getshow);
  };
  const handleshow8 = (e) => {
    const getshow = e.target.value;
    setShowhide8(getshow);
  };
  const handleshow9 = (e) => {
    const getshow = e.target.value;
    setShowhide9(getshow);
  };
  const handleshow0 = (e) => {
    const getshow = e.target.value;
    setShowhide0(getshow);
  };
  const handleshow13 = (e) => {
    const getshow = e.target.value;
    setShowhide13(getshow);
  };
  const handleshow18 = (e) => {
    const getshow = e.target.value;
    setShowhide18(getshow);
  };
  const handleshow16 = (e) => {
    const getshow = e.target.value;
    setShowhide16(getshow);
  };
  const handleshow17 = (e) => {
    const getshow = e.target.value;
    setShowhide17(getshow);
  };
  const [uncheckedValue, setUncheckedVlue] = useState([]);
  console.log(uncheckedValue);
  // const [labelValue, setLabelValue] = useState("");
  const [smShow, setSmShow] = useState(false);
  const [color, setColor] = useState({ yes: false, no: false });
  // const [modaldData, setmodaldData] = useState({ label: "", Remarks: "" });
  // const [isyesOrNochecked, setYesorNochecked] = useState(true);

  // const handlemodaldData = (data) => {
  //   setmodaldData(data.data);
  //   setSmShow(false);
  // };

  // const handleYesOrNochecked = (data) => {
  //   setYesorNochecked(data.data);
  // };
  // const handlemodalsubmit = () => {
  //   console.log("here");
  //   const filteredObj = uncheckedValue.filter((obj) => {
  //     return obj.label == modaldData.label;
  //   });

  //   if (isyesOrNochecked === false) {
  //     if (modaldData.label !== "" || modaldData.Remarks !== "") {
  //       if (filteredObj.length === 0) {
  //         setUncheckedVlue((prev) => [...prev, modaldData]);
  //       }
  //     }
  //   }
  // };
  // useEffect(() => {
  //   console.log("called");
  //   handlemodalsubmit();
  // }, [modaldData.Remarks]);
  // useEffect(() => {
  //   props.passUncheckedList({ data: uncheckedValue });
  // }, [uncheckedValue]);
  // console.log("unchecked values", uncheckedValue);

  // console.log(uncheckedValue.indexOf("developer"));
  //////////////////////////////////////////////////////////////
  const [smShow2, setSmShow2] = useState(false);
  const [smShow3, setSmShow3] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const [modaldData, setmodaldData] = useState({ label: "", Remarks: "" });
  const [isyesOrNochecked, setYesorNochecked] = useState(true);
  const [checkValue, setCheckedVAlue] = useState([]);

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
    return obj.label === "Whether licence applied for additional area ?";
  });
  const developerInputCheckedFiledColor = checkValue.filter((obj) => {
    return obj.label === "Whether licence applied for additional area ?";
  });
  // console.log("color from array", developerInputFiledColor);

  const developerInputFiledColor1 = uncheckedValue.filter((obj) => {
    return obj.label === "License No. of Parent License";
  });
  const developerInputCheckedFiledColor1 = checkValue.filter((obj) => {
    return obj.label === "License No. of Parent License";
  });
  const developerInputFiledColor2 = uncheckedValue.filter((obj) => {
    return obj.label === "Potential Zone:";
  });
  const developerInputCheckedFiledColor2 = checkValue.filter((obj) => {
    return obj.label === "Potential Zone:";
  });
  const developerInputFiledColor3 = uncheckedValue.filter((obj) => {
    return obj.label === "Site Location Purpose";
  });
  const developerInputCheckedFiledColor3 = checkValue.filter((obj) => {
    return obj.label === "Site Location Purpose";
  });
  const developerInputFiledColor4 = uncheckedValue.filter((obj) => {
    return obj.label === "Approach Type (Type of Policy)";
  });
  const developerInputCheckedFiledColor4 = checkValue.filter((obj) => {
    return obj.label === "Approach Type (Type of Policy)";
  });
  const developerInputFiledColor5 = uncheckedValue.filter((obj) => {
    return obj.label === "Approach Road Width";
  });
  const developerInputCheckedFiledColor5 = checkValue.filter((obj) => {
    return obj.label === "Approach Road Width";
  });
  const developerInputFiledColor6 = uncheckedValue.filter((obj) => {
    return obj.label === "Specify Other";
  });
  const developerInputCheckedFiledColor6 = checkValue.filter((obj) => {
    return obj.label === "Specify Other";
  });
  const developerInputFiledColor7 = uncheckedValue.filter((obj) => {
    return obj.label === "Type of land";
  });
  const developerInputCheckedFiledColor7 = checkValue.filter((obj) => {
    return obj.label === "Type of land";
  });
  const developerInputFiledColor8 = uncheckedValue.filter((obj) => {
    return obj.label === "Third-party right created";
  });
  const developerInputCheckedFiledColor8 = checkValue.filter((obj) => {
    return obj.label === "Third-party right created";
  });
  // const developerInputFiledColor9 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Tehsil";
  // });
  // const developerInputCheckedFiledColor9 = checkValue.filter((obj) => {
  //   return obj.label === "Tehsil";
  // });
  // const developerInputFiledColor10 = uncheckedValue.filter((obj) => {
  //   return obj.label === "District";
  // });
  // const developerInputCheckedFiledColor10 = checkValue.filter((obj) => {
  //   return obj.label === "District";
  // });
  // const developerInputFiledColor11 = uncheckedValue.filter((obj) => {
  //   return obj.label === "State";
  // });
  // const developerInputCheckedFiledColor11 = checkValue.filter((obj) => {
  //   return obj.label === "State";
  // });
  // const developerInputFiledColor12 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Status (Individual/ Company/ Firm/ LLP etc.)";
  // });
  // const developerInputCheckedFiledColor12 = checkValue.filter((obj) => {
  //   return obj.label === "Status (Individual/ Company/ Firm/ LLP etc.)";
  // });
  // const developerInputFiledColor13 = uncheckedValue.filter((obj) => {
  //   return obj.label === "LC-I signed by";
  // });
  // const developerInputCheckedFiledColor13 = checkValue.filter((obj) => {
  //   return obj.label === "LC-I signed by";
  // });
  // const developerInputFiledColor14 = uncheckedValue.filter((obj) => {
  //   return obj.label === "If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)";
  // });
  // const developerInputCheckedFiledColor14 = checkValue.filter((obj) => {
  //   return obj.label === "If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)";
  // });
  // const developerInputFiledColor15 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Permanent address in case of individual/ registered office address in case other than individual";
  // });
  // const developerInputCheckedFiledColor15 = checkValue.filter((obj) => {
  //   return obj.label === "Permanent address in case of individual/ registered office address in case other than individual";
  // });
  // const developerInputFiledColor16 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Address for communication";
  // });
  // const developerInputCheckedFiledColor16 = checkValue.filter((obj) => {
  //   return obj.label === "Address for communication";
  // });
  // const developerInputFiledColor17 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Name of the authorized person to sign the application";
  // });
  // const developerInputCheckedFiledColor17 = checkValue.filter((obj) => {
  //   return obj.label === "Name of the authorized person to sign the application";
  // });
  // const developerInputFiledColor18 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Email ID for communication";
  // });
  // const developerInputCheckedFiledColor18 = checkValue.filter((obj) => {
  //   return obj.label === "Email ID for communication";
  // });
  // const developerInputFiledColor19 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Name of individual Land owner/ land-owning company/ firm/ LLP etc.";
  // });
  // const developerInputCheckedFiledColor19 = checkValue.filter((obj) => {
  //   return obj.label === "Name of individual Land owner/ land-owning company/ firm/ LLP etc.";
  // });
  return (
    <Form
      ref={props.developerInfoRef}
      // style={{
      //   width: "100%",
      //   height: props.heightDevelper,
      //   overflow: "hidden",
      //   marginBottom: 20,
      //   borderColor: "#C3C3C3",
      //   borderStyle: "solid",
      //   borderWidth: 2,
      //   padding: 2,
      // }}
    >
      {/* <Card
        style={{
          width: "100%",
          height: props.heightDevelper,
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
              margin: 2,
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
            Details of Applied Land
            <AddIcon style={{ width: "61.5em" }}></AddIcon>
          </Button>
        </Col>
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Form.Group style={{ display: props.displayGeneral }} className="justify-content-center">
            <Row className="ms-auto" style={{ marginBottom: 20 }}>
              <Col className="ms-auto" md={4} xxl lg="12">
                <Form.Label>
                  <b>(i)Whether licence applied for additional area ?</b>
                </Form.Label>
                {/* &nbsp;&nbsp;
                
                <br></br> */}

                <div style={{ display: "flex" }}>
                  <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow} readOnly />
                  <label for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow} readOnly />
                  <label for="No">No</label>
                  {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} readOnly></Form.Control> */}
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
                      setLabelValue("Whether licence applied for additional area ?"), setSmShow(true), console.log("modal open");
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
                {showhide1 === "Yes" && (
                  <div className="row">
                    <div className="col col-4">
                      <label for="parentLicense" className="font-weight-bold">
                        <h6>
                          <b>License No. of Parent License</b>
                        </h6>{" "}
                      </label>
                      {/* <Form.Check
                        value="Yes"
                        type="radio"
                        onChange1={handleChange}
                        onClick={handleshow}
                        id="default-radio"
                        label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                        name="group41"
                        inline
                      ></Form.Check>
                      <Form.Check
                        onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="No"
                        type="radio"
                        id="default-radio"
                        onChange1={handleChange}
                        onClick={handleshow}
                        label={<CancelIcon color="error" />}
                        name="group41"
                        inline
                      ></Form.Check> */}
                      <div style={{ display: "flex" }}>
                        <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} readOnly></Form.Control>
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
                            setLabelValue("License No. of Parent License"), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                      {/* <input type="number" className="form-control" /> */}
                    </div>
                    <div className="col col-4">
                      <label htmlFor="potential">
                        <h6>
                          <b>Potential Zone:</b>
                        </h6>
                      </label>
                      {/* <Form.Check
                        value="Potential Zone"
                        type="radio"
                        id="default-radio"
                        label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                        name="group43"
                        inline
                      ></Form.Check>
                      <Form.Check
                        onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="Potential Zone"
                        type="radio"
                        id="default-radio"
                        label={<CancelIcon color="error" />}
                        name="group43"
                        inline
                      ></Form.Check> */}
                      <div style={{ display: "flex" }}>
                        {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} readOnly></Form.Control> */}
                        {/* <Form.Select height={30} style={{ maxWidth: 200, marginRight: 5 }} readOnly>
                          
                        </Form.Select> */}
                        <Form.Select
                          type="text"
                          placeholder="Puropse"
                          // onChange={handleChangesetPurpose}
                          height={30}
                          style={{ maxWidth: 200, marginRight: 5 }}
                          disabled
                        >
                          {/* <select className="form-control" id="Puropse" name="potential" placeholder="Puropse" onChange={handleChangesetPurpose} readOnly> */}
                          <option value="">--Potential Zone--</option>
                          <option value="K.Mishra">Hyper</option>
                          <option value="potential 1">High I</option>
                          <option value="potential 2">High II</option>
                          <option value="potential 2">Medium</option>
                          <option value="potential 2">Low I</option>
                          <option value="potential 2">Low II</option>
                          {/* </select> */}
                        </Form.Select>
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
                            setLabelValue("Potential Zone:"), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                      <div className="col col-4">
                        <label for="parentLicense" className="font-weight-bold">
                          <h6>
                            <b>Site Location Purpose</b>
                          </h6>{" "}
                        </label>
                        <div style={{ display: "flex" }}>
                          <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} readOnly></Form.Control>
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
                              setLabelValue("Site Location Purpose"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                        {/* <Form.Check
                          value="Site Location Purpose"
                          type="radio"
                          id="default-radio"
                          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                          name="group44"
                          inline
                        ></Form.Check>
                        <Form.Check
                          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                          value="Site Location Purpose"
                          type="radio"
                          id="default-radio"
                          label={<CancelIcon color="error" />}
                          name="group44"
                          inline
                        ></Form.Check> */}
                        {/* <input type="text" className="form-control" disabled="disabled" /> */}
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="approach">
                            <h6>
                              <b>Approach Type (Type of Policy)</b>
                            </h6>
                          </label>
                          {/* <Form.Check
                            value="Approach Type "
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                            name="group45"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Approach Type "
                            type="radio"
                            id="default-radio"
                            label={<CancelIcon color="error" />}
                            name="group45"
                            inline
                          ></Form.Check> */}
                          <div style={{ display: "flex" }}>
                            <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} readOnly></Form.Control>
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
                                setLabelValue("Approach Type (Type of Policy)"), setSmShow(true), console.log("modal open");
                              }}
                            ></ReportProblemIcon>
                          </div>
                          <select className="form-control" id="approach" name="approach">
                            <option value=""></option>
                            <option value="K.Mishra"></option>
                            <option value="potential 1"></option>
                            <option value="potential 2"></option>
                          </select>
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group ">
                          <label htmlFor="roadwidth">
                            <h6>
                              <b>Approach Road Width</b>&nbsp;&nbsp;
                            </h6>{" "}
                          </label>
                          <div style={{ display: "flex" }}>
                            <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} readOnly></Form.Control>
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
                                setLabelValue("Approach Road Width"), setSmShow(true), console.log("modal open");
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <Form.Check
                            value="Approach Road Width "
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                            name="group46"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Approach Road Width"
                            type="radio"
                            id="default-radio"
                            label={<CancelIcon color="error" />}
                            name="group46"
                            inline
                          ></Form.Check> */}
                          {/* <input type="number" name="roadwidth" className="form-control" readOnly></input> */}
                        </div>
                      </div>
                      <div className="col col-3">
                        <div className="form-group ">
                          <label htmlFor="specify">
                            <h6>
                              <b>Specify Others</b>
                            </h6>
                          </label>
                          <div style={{ display: "flex" }}>
                            <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} readOnly></Form.Control>
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
                                setLabelValue("Specify Other"), setSmShow(true), console.log("modal open");
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <Form.Check
                            value="Specify Others"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                            name="group47"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Specify Others"
                            type="radio"
                            id="default-radio"
                            label={<CancelIcon color="error" />}
                            name="group47"
                            inline
                          ></Form.Check> */}
                          {/* <input type="number" name="specify" className="form-control " /> */}
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group ">
                          <label htmlFor="typeland">
                            <h6>
                              <b>Type of land</b>
                            </h6>{" "}
                          </label>
                          {/* <Form.Check
                            value="Type of land"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                            name="group49"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Type of land"
                            type="radio"
                            id="default-radio"
                            label={<CancelIcon color="error" />}
                            name="group49"
                            inline
                          ></Form.Check> */}
                          <div style={{ display: "flex" }}>
                            <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} readOnly></Form.Control>
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
                                setLabelValue("Type of land"), setSmShow(true), console.log("modal open");
                              }}
                            ></ReportProblemIcon>
                          </div>
                          <select className="form-control" id="typeland" name="typeland">
                            <option value="">--Type of Land--</option>
                            <option value="">chahi/nehri</option>
                            <option>Gair Mumkins</option>
                            <option>others</option>
                            <option></option>
                          </select>
                        </div>
                      </div>
                      <div className="col col-4 ">
                        <label htmlFor="typeland">
                          <h6>
                            <b>Third-party right created</b>{" "}
                          </h6>
                        </label>
                        <br></br>
                        <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow13} />
                        &nbsp;&nbsp;
                        <label for="Yes">
                          <h6>Yes</h6>
                        </label>
                        &nbsp;&nbsp;
                        <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow13} />
                        &nbsp;&nbsp;
                        <label for="No">
                          <h6>No</h6>
                        </label>
                        {/* <Form.Check
                          value="Third-party right created"
                          type="radio"
                          id="default-radio"
                          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                          name="group50"
                          inline
                        ></Form.Check>
                        <Form.Check
                          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                          value="Third-party right created"
                          type="radio"
                          id="default-radio"
                          label={<CancelIcon color="error" />}
                          name="group50"
                          inline
                        ></Form.Check> */}
                        <div style={{ display: "flex" }}>
                          <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} readOnly></Form.Control>
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
                              setLabelValue("Third-party right created"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                        {showhide13 === "Yes" && (
                          <div className="row ">
                            <div className="col col-12">
                              <label for="parentLicense" className="font-weight-bold">
                                {" "}
                                Remark{" "}
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                            <div className="col col-12">
                              <label for="parentLicense" className="font-weight-bold">
                                {" "}
                                Document Upload{" "}
                              </label>
                              <input type="file" className="form-control" />
                            </div>
                          </div>
                        )}
                        {showhide13 === "No" && (
                          <div className="row ">
                            <div className="col col">
                              <label for="parentLicense" className="font-weight-bold">
                                {" "}
                                Document Upload{" "}
                              </label>
                              <input type="file" className="form-control" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
            <Row className="ms-auto">
              <Col md={4} xxl lg="12">
                <Form.Label>
                  <b>(ii)Whether licence applied under Migration policy?</b>
                </Form.Label>
                &nbsp;&nbsp;
                <Form.Check
                  value="Whether licence applied under Migration policy"
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group42"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Whether licence applied under Migration policy"
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group42"
                  inline
                ></Form.Check>
                <br></br>
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow17} readOnly />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow17} readOnly />
                <label for="No">No</label>
                {showhide17 === "Yes" && (
                  <div className="col col-6 ">
                    <h6 data-toggle="tooltip" data-placement="top" title="Upload Document">
                      <b>
                        Another Copy of Shahjra Plan&nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                      </b>{" "}
                    </h6>
                    <input type="file" className="form-control" />
                  </div>
                )}
              </Col>
            </Row>
            <hr></hr>
            <h5 className="text-black">
              <b>2. Any encumbrance with respect to following :</b>&nbsp;&nbsp;
              <Form.Check
                value="Rehan"
                type="radio"
                id="default-radio"
                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                name="group43"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                value="Rehan"
                type="radio"
                id="default-radio"
                label={<CancelIcon color="error" />}
                name="group43"
                inline
              ></Form.Check>
            </h5>
            <br></br>
            <label htmlFor="gen">Rehan / Mortgage</label>&nbsp;&nbsp;
            <input type="radio" id="Yes" value="1" onChange={handleChange} name="Yes" onClick={handleshow18} />
            &nbsp;&nbsp;
            <label for="Yes"></label>&nbsp;&nbsp;&nbsp;&nbsp;
            <label htmlFor="npnl">Patta/Lease</label>&nbsp;&nbsp;
            <input type="radio" id="Yes" value="2" onChange={handleChange} name="Yes" onClick={handleshow18} />
            &nbsp;&nbsp;
            <label for="Yes"></label>&nbsp;&nbsp;&nbsp;&nbsp;
            <label htmlFor="npnl">Gair/Marusi</label>&nbsp;&nbsp;
            <input type="radio" id="Yes" value="2" onChange={handleChange} name="Yes" onClick={handleshow18} />
            &nbsp;&nbsp;
            <label for="Yes"></label>
            <div className="row">
              <div className="col col-4">
                <label htmlFor="npnl">
                  <h6>
                    <b>Any other, please specify</b>
                  </h6>
                </label>
                <input type="text" className="form-control" readOnly />
              </div>
            </div>
            <hr />
            <h6>
              <b>(ii) Existing litigation, if any, concerning applied land including co-sharers and collaborator</b>&nbsp;&nbsp;
              <Form.Check
                value=" Existing litigation"
                type="radio"
                id="default-radio"
                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                name="group47"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                value=" Existing litigation"
                type="radio"
                id="default-radio"
                label={<CancelIcon color="error" />}
                name="group47"
                inline
              ></Form.Check>
            </h6>
            <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
            <label for="Yes">Yes</label>&nbsp;&nbsp;
            <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
            <label for="No">No</label>
            <hr />
            <h6>
              <b>(iii) Court orders, if any, affecting applied land</b>&nbsp;&nbsp;
              <Form.Check
                value=" Court orders"
                type="radio"
                id="default-radio"
                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                name="group48"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                value=" Court orders"
                type="radio"
                id="default-radio"
                label={<CancelIcon color="error" />}
                name="group48"
                inline
              ></Form.Check>
            </h6>
            <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
            <label for="Yes">Yes</label>&nbsp;&nbsp;
            <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
            <label for="No">No</label>
            <hr />
            <h6>
              <b>(iv) Any insolvency/liquidation proceedings against the land owner(s)/ collaborating developed :</b>&nbsp;&nbsp;
              <Form.Check
                value=" Any insolvency"
                type="radio"
                id="default-radio"
                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                name="group49"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                value="  Any insolvency"
                type="radio"
                id="default-radio"
                label={<CancelIcon color="error" />}
                name="group49"
                inline
              ></Form.Check>
            </h6>
            <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
            <label for="Yes">Yes</label>&nbsp;&nbsp;
            <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
            <label for="No">No</label>
            <hr />
            <h5 className="text-black">
              <b>3.Shajra Plan</b>
            </h5>
            <div className="row">
              <div className="col col-3 ">
                <h6>
                  <b>(a)As per applied land (Yes/No)</b> &nbsp;&nbsp;
                  <Form.Check
                    value=" As per applied land "
                    type="radio"
                    id="default-radio"
                    label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                    name="group50"
                    inline
                  ></Form.Check>
                  <Form.Check
                    onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                    value="As per applied land "
                    type="radio"
                    id="default-radio"
                    label={<CancelIcon color="error" />}
                    name="group50"
                    inline
                  ></Form.Check>
                </h6>
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                <label for="No">No</label>
              </div>

              <div className="col col-3 ">
                <h6 data-toggle="tooltip" data-placement="top" title="If any revenue rasta abuts to the applied site ?">
                  <b>
                    (b)&nbsp;Revenue rasta&nbsp;
                    {/* <InfoIcon style={{color:"blue"}}/>  */}
                  </b>
                  &nbsp;&nbsp;
                  <Form.Check
                    value=" revenue rasta "
                    type="radio"
                    id="default-radio"
                    label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                    name="group51"
                    inline
                  ></Form.Check>
                  <Form.Check
                    onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                    value="revenue rasta"
                    type="radio"
                    id="default-radio"
                    label={<CancelIcon color="error" />}
                    name="group51"
                    inline
                  ></Form.Check>
                </h6>
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow1} />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow1} />
                <label for="No">No</label>
                {showhide2 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label for="parentLicense" className="font-weight-bold">
                        {" "}
                        Width of revenue rasta{" "}
                      </label>
                      <input type="number" className="form-control" readOnly />
                    </div>
                  </div>
                )}
              </div>

              <div className="col col-3 ">
                <h6 data-toggle="tooltip" data-placement="top" title="Watercourse running along boundary through the applied site ?">
                  <b>
                    (c)&nbsp;Watercourse running&nbsp;
                    {/* <InfoIcon style={{color:"blue"}}/>  */}
                  </b>
                  &nbsp;&nbsp;
                  <Form.Check
                    value=" Yes"
                    type="radio"
                    id="default-radio"
                    onChange1={handleChange}
                    onClick={handleshow2}
                    label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                    name="group53"
                    inline
                  ></Form.Check>
                  <Form.Check
                    onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                    value="No "
                    type="radio"
                    id="default-radio"
                    onChange1={handleChange}
                    onClick={handleshow2}
                    label={<CancelIcon color="error" />}
                    name="group53"
                    inline
                  ></Form.Check>
                </h6>
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow2} />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow2} />
                <label for="No">No</label>
                {showhide3 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label for="parentLicense" className="font-weight-bold">
                        {" "}
                        Rev. rasta width{" "}
                      </label>
                      <input type="number" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3 ">
                <h6>
                  <b>(d)Whether in Compact Block (Yes/No)</b> &nbsp;&nbsp;
                  <Form.Check
                    value=" Compact Block"
                    type="radio"
                    id="default-radio"
                    onChange1={handleChange}
                    onClick={handleshow2}
                    label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                    name="group55"
                    inline
                  ></Form.Check>
                  <Form.Check
                    onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                    value="Compact Block "
                    type="radio"
                    id="default-radio"
                    onChange1={handleChange}
                    onClick={handleshow2}
                    label={<CancelIcon color="error" />}
                    name="group55"
                    inline
                  ></Form.Check>
                </h6>
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                <label for="No">No</label>
              </div>
              <br></br>
              <div className="row">
                <div className="col col-3 ">
                  <h6 data-toggle="tooltip" data-placement="top" title="If any other owners' land is sandwiched within applied land.">
                    <b>
                      (e)&nbsp;Land Sandwiched&nbsp;
                      {/* <InfoIcon style={{color:"blue"}}/>  */}
                    </b>
                    &nbsp;&nbsp;
                    <Form.Check
                      value=" sandwiched"
                      type="radio"
                      id="default-radio"
                      onChange1={handleChange}
                      onClick={handleshow2}
                      label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                      name="group56"
                      inline
                    ></Form.Check>
                    <Form.Check
                      onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                      value="sandwiched "
                      type="radio"
                      id="default-radio"
                      onChange1={handleChange}
                      onClick={handleshow2}
                      label={<CancelIcon color="error" />}
                      name="group56"
                      inline
                    ></Form.Check>
                  </h6>
                  <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                  <label for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                  <label for="No">No</label>
                </div>
                <div className="col col-3 ">
                  <h6>
                    <b>(f)Acquisition status (Yes/No)</b> &nbsp;&nbsp;
                    <Form.Check
                      value=" Yes"
                      type="radio"
                      id="default-radio"
                      onChange1={handleChange}
                      onClick={handleshow2}
                      label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                      name="group57"
                      inline
                    ></Form.Check>
                    <Form.Check
                      onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                      value="No"
                      type="radio"
                      id="default-radio"
                      onChange1={handleChange}
                      onClick={handleshow2}
                      label={<CancelIcon color="error" />}
                      name="group57"
                      inline
                    ></Form.Check>
                  </h6>
                  <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow3} />
                  <label for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow3} />
                  <label for="No">No</label>
                  {showhide4 === "Yes" && (
                    <div className="row ">
                      <div className="col col">
                        <label for="parentLicense" className="font-weight-bold">
                          Remark
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="col col-3">
                  <div className="form-group ">
                    <label>
                      <b>Date of section 4 notification</b>{" "}
                    </label>
                    &nbsp;&nbsp;
                    <Form.Check
                      value=" Date of section 4 notification"
                      type="radio"
                      id="default-radio"
                      label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                      name="group61"
                      inline
                    ></Form.Check>
                    <Form.Check
                      onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                      value="Date of section 4 notification"
                      type="radio"
                      id="default-radio"
                      label={<CancelIcon color="error" />}
                      name="group61"
                      inline
                    ></Form.Check>
                    <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
                  </div>
                </div>
                <div className="col col-3">
                  <div className="form-group ">
                    <label>
                      <b>Date of section 6 notification</b>
                    </label>
                    &nbsp;&nbsp;
                    <Form.Check
                      value=" Date of section 6 notification"
                      type="radio"
                      id="default-radio"
                      label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                      name="group62"
                      inline
                    ></Form.Check>
                    <Form.Check
                      onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                      value="Date of section 6 notification"
                      type="radio"
                      id="default-radio"
                      label={<CancelIcon color="error" />}
                      name="group62"
                      inline
                    ></Form.Check>
                    <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col col-12 ">
                <h6 data-toggle="tooltip" data-placement="top" title="Whether details/orders of release/exclusion of land uploaded.">
                  <b>
                    (g)&nbsp;Orders Upload &nbsp;
                    {/* <InfoIcon style={{color:"blue"}}/>  */}
                  </b>
                  &nbsp;&nbsp;
                  <Form.Check
                    value=" release/exclusion"
                    type="radio"
                    id="default-radio"
                    label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                    name="group59"
                    inline
                  ></Form.Check>
                  <Form.Check
                    onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                    value="release/exclusion"
                    type="radio"
                    id="default-radio"
                    label={<CancelIcon color="error" />}
                    name="group59"
                    inline
                  ></Form.Check>
                </h6>
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow16} />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow16} />
                <label for="No">No</label>
                {showhide16 === "Yes" && (
                  <div className="row ">
                    <div className="col col-3 ">
                      <h6>
                        <b>(h) Whether land compensation received</b>&nbsp;&nbsp;
                        <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                        &nbsp;&nbsp;
                        <label for="Yes">Yes</label>&nbsp;&nbsp;
                        <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                        &nbsp;&nbsp;
                        <label for="No">No</label>
                      </h6>
                      <Form.Check
                        value=" land compensation"
                        type="radio"
                        id="default-radio"
                        label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                        name="group60"
                        inline
                      ></Form.Check>
                      <Form.Check
                        onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="land compensation"
                        type="radio"
                        id="default-radio"
                        label={<CancelIcon color="error" />}
                        name="group60"
                        inline
                      ></Form.Check>
                    </div>
                    <div className="col col-3">
                      <div className="form-group">
                        <label htmlFor="releasestatus">
                          <h6>
                            <b>Status of release</b>
                          </h6>
                        </label>
                        <Form.Check
                          value="Status of release"
                          type="radio"
                          id="default-radio"
                          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                          name="group63"
                          inline
                        ></Form.Check>
                        <Form.Check
                          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                          value="Status of release"
                          type="radio"
                          id="default-radio"
                          label={<CancelIcon color="error" />}
                          name="group63"
                          inline
                        ></Form.Check>
                        <select className="form-control" id="releasestatus" name="releasestatus">
                          <option value=""></option>
                          <option></option>
                          <option></option>
                          <option></option>
                        </select>
                      </div>
                    </div>
                    <div className="col col-3">
                      <div className="form-group ">
                        <label htmlFor="awarddate">
                          <h6>
                            <b>Date of Award</b>
                          </h6>
                        </label>
                        <Form.Check
                          value="Date of Award"
                          type="radio"
                          id="default-radio"
                          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                          name="group64"
                          inline
                        ></Form.Check>
                        <Form.Check
                          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                          value="Date of Award"
                          type="radio"
                          id="default-radio"
                          label={<CancelIcon color="error" />}
                          name="group64"
                          inline
                        ></Form.Check>
                        <input type="date" name="awarddate" className="form-control"></input>
                      </div>
                    </div>
                    <div className="col col-3">
                      <div className="form-group ">
                        <label htmlFor="releasedate">
                          <h6>
                            <b>Date of Release</b>
                          </h6>{" "}
                        </label>
                        <Form.Check
                          value="Date of Release"
                          type="radio"
                          id="default-radio"
                          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                          name="group65"
                          inline
                        ></Form.Check>
                        <Form.Check
                          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                          value="Date of Release"
                          type="radio"
                          id="default-radio"
                          label={<CancelIcon color="error" />}
                          name="group65"
                          inline
                        ></Form.Check>
                        <input type="date" name="releasedate" className="form-control"></input>
                      </div>
                    </div>
                    <div className="col col-3">
                      <div className="form-group ">
                        <label htmlFor="sitedetails">
                          <h6>
                            <b>Site Details</b>
                          </h6>
                        </label>
                        <Form.Check
                          value="Site Details"
                          type="radio"
                          id="default-radio"
                          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                          name="group66"
                          inline
                        ></Form.Check>
                        <Form.Check
                          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                          value="Site Details"
                          type="radio"
                          id="default-radio"
                          label={<CancelIcon color="error" />}
                          name="group66"
                          inline
                        ></Form.Check>
                        <input type="number" name="sitedetails" className="form-control " />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <br></br>
            <div className="row">
              <div className="col col-12 ">
                <h6>
                  <b>whether the applied site is approachable from the proposed 18/24 m internal sectoral plan road/sector dividing road. (yes/no)</b>
                  &nbsp;&nbsp;
                  <Form.Check
                    value="approachable"
                    type="radio"
                    id="default-radio"
                    label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                    name="group67"
                    inline
                  ></Form.Check>
                  <Form.Check
                    onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                    value="approachable"
                    type="radio"
                    id="default-radio"
                    label={<CancelIcon color="error" />}
                    name="group67"
                    inline
                  ></Form.Check>
                </h6>
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                <label for="No">No</label>
              </div>
            </div>
            <hr />
            <h5 className="text-black">
              <b>4.Site condition</b>
            </h5>
            <div className="row">
              <div className="col col-3">
                <h6>
                  <b>(a)vacant: (Yes/No)</b>{" "}
                  <Form.Check
                    value="vacant"
                    type="radio"
                    id="default-radio"
                    label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                    name="group68"
                    inline
                  ></Form.Check>
                  <Form.Check
                    onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                    value="vacant"
                    type="radio"
                    id="default-radio"
                    label={<CancelIcon color="error" />}
                    name="group68"
                    inline
                  ></Form.Check>
                </h6>
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                <label for="No">No</label>
              </div>
              <div className="col col-3">
                <h6 onChange={(e) => setConstruction(e.target.value)} value={construction}>
                  <b>(b)Construction: (Yes/No)</b>
                </h6>
                <Form.Check
                  value="Construction"
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group69"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Construction"
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group69"
                  inline
                ></Form.Check>
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow4} />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow4} />
                <label for="No">No</label>
                {showhide4 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label for="parentLicense" className="font-weight-bold">
                        Type of Construction
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3">
                <h6 onChange={(e) => setHt(e.target.value)} value={ht}>
                  <b>(c)HT line:(Yes/No)</b>
                </h6>
                <Form.Check
                  value="HT"
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group70"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="HT"
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group70"
                  inline
                ></Form.Check>
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow5} />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow5} />
                <label for="No">No</label>
                {showhide5 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label for="parentLicense" className="font-weight-bold">
                        HT Remarks
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3">
                <h6 onChange={(e) => setGas(e.target.value)} value={gas}>
                  <b>(d) IOC Gas Pipeline:(Yes/No)</b>
                </h6>
                <Form.Check
                  value=" IOC"
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group71"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value=" IOC"
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group71"
                  inline
                ></Form.Check>
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow6} />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow6} />
                <label for="No">No</label>
                {showhide6 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label for="parentLicense" className="font-weight-bold">
                        IOC Remarks
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <br></br>
            <div className="row ">
              <div className="col col-3">
                <h6 onChange={(e) => setNallah(e.target.value)} value={nallah}>
                  <b>(e)Nallah:(Yes/No)</b>{" "}
                </h6>
                <Form.Check
                  value="Nallah"
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group72"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Nallah"
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group72"
                  inline
                ></Form.Check>
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow7} />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow7} />
                <label for="No">No</label>
                {showhide7 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label for="parentLicense" className="font-weight-bold">
                        Nallah Remarks
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3">
                <h6 onChange={(e) => setRoad(e.target.value)} value={road}>
                  <b>(f)Any revenue rasta/road:(Yes/No)</b>
                </h6>{" "}
                <Form.Check
                  value="revenue"
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group73"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="revenue"
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group73"
                  inline
                ></Form.Check>
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow8} />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow8} />
                <label for="No">No</label>
                {showhide8 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label for="parentLicense" className="font-weight-bold">
                        Width
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3">
                <h6 onChange={(e) => setLand(e.target.value)} value={land}>
                  <b>(g)Any marginal land:(Yes/No)</b>
                </h6>{" "}
                <Form.Check
                  value="marginal"
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group74"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="marginal"
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group74"
                  inline
                ></Form.Check>
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow9} />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow9} />
                <label for="No">No</label>
                {showhide9 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label for="parentLicense" className="font-weight-bold">
                        Remark
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3">
                <h6
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Whether any utility line passing through the site is incorporated/adjusted in the layout plan (Yes/No)
"
                >
                  <b>
                    (h)&nbsp;Utility Line &nbsp;
                    {/* <InfoIcon style={{color:"blue"}}/>  */}
                  </b>
                </h6>
                <Form.Check
                  value="utility"
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group75"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="utility"
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group75"
                  inline
                ></Form.Check>
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow0} />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow0} />
                <label for="No">No</label>
                {showhide0 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label for="parentLicense" className="font-weight-bold">
                        Width of row
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <hr />
            <h5 className="text-black">
              <b>5. Enclose the following documents as Annexures</b>&nbsp;&nbsp;
              <Form.Check
                value="utility"
                type="radio"
                id="default-radio"
                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                name="group76"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                value="utility"
                type="radio"
                id="default-radio"
                label={<CancelIcon color="error" />}
                name="group76"
                inline
              ></Form.Check>
            </h5>
            <div className="row">
              <div className="col col-3">
                <h6>
                  <b>Land schedule</b>
                </h6>
                &nbsp;&nbsp;
                <Form.Check
                  value="utility"
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group75"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="utility"
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group75"
                  inline
                ></Form.Check>
                <input type="file" className="form-control" readOnly />
                {<DownloadForOfflineIcon color="primary" />}
              </div>
              <div className="col col-3">
                <h6>
                  <b>Copy of Mutation</b>
                </h6>
                &nbsp;&nbsp;
                <Form.Check
                  value="utility"
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group75"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="utility"
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group75"
                  inline
                ></Form.Check>
                <input type="file" className="form-control" readOnly />
                {<DownloadForOfflineIcon color="primary" />}
              </div>
              <div className="col col-3">
                <h6>
                  <b>Copy of Jamabandi</b>
                </h6>
                &nbsp;&nbsp;
                <Form.Check
                  value="utility"
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group75"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="utility"
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group75"
                  inline
                ></Form.Check>
                <input type="file" className="form-control" readOnly />
                {<DownloadForOfflineIcon color="primary" />}
              </div>
              <div className="col col-3">
                <h6>
                  <b>Details of lease / patta, if any</b>
                </h6>
                &nbsp;&nbsp;
                <Form.Check
                  value="utility"
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group75"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="utility"
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group75"
                  inline
                ></Form.Check>
                <input type="file" className="form-control" readOnly />
                {<DownloadForOfflineIcon color="primary" />}
              </div>
            </div>
            <br></br>
            <div className="row">
              <div className="col col-3">
                &nbsp;&nbsp;
                <h6>
                  <b>Approved Layout of Plan/ Site plan for(GH)Showing Area(s)/Proposed migration </b>
                </h6>
                &nbsp;&nbsp;
                <Form.Check
                  value="utility"
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group75"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="utility"
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group75"
                  inline
                ></Form.Check>
                <input type="file" className="form-control" readOnly />
                {<DownloadForOfflineIcon color="primary" />}
              </div>
              <div className="col col-3">
                <h6>
                  <b>Proposed Layout of Plan /site plan for area applied for migration.</b>
                </h6>
                &nbsp;&nbsp;
                <Form.Check
                  value="utility"
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group75"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="utility"
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group75"
                  inline
                ></Form.Check>
                <input type="file" className="form-control" readOnly />
                {<DownloadForOfflineIcon color="primary" />}
              </div>
              <div className="col col-3">
                <h6>
                  <b>Revised Land Schedule</b>
                </h6>
                &nbsp;&nbsp;
                <Form.Check
                  value="utility"
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group75"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="utility"
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group75"
                  inline
                ></Form.Check>
                <input type="file" className="form-control" readOnly />
                {<DownloadForOfflineIcon color="primary" />}
              </div>
            </div>
            <br></br>
          </Form.Group>
          <div style={{ position: "relative", marginBottom: 40 }}>
            <Button onClick={() => props.passUncheckedList({ data: uncheckedValue })}>Submit</Button>
          </div>
          <hr></hr>
          {/* </Card> */}
        </div>
      </Collapse>
    </Form>
  );
};

export default Developerinfo;
