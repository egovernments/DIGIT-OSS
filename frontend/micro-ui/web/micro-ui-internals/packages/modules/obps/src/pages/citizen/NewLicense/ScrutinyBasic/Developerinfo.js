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
import RemoveIcon from "@mui/icons-material/Remove";

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

  // const [fieldValue, setFieldValue] = useState("");

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

  const [smShow2, setSmShow2] = useState(false);
  const [smShow3, setSmShow3] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const [modaldData, setmodaldData] = useState({ label: "", Remarks: "" });
  const [isyesOrNochecked, setYesorNochecked] = useState(true);
  const [checkValue, setCheckedVAlue] = useState([]);
  const [fieldValue, setFieldValue] = useState("");

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
  const developerInputFiledColor9 = uncheckedValue.filter((obj) => {
    return obj.label === "(ii)Whether licence applied under Migration policy?";
  });
  const developerInputCheckedFiledColor9 = checkValue.filter((obj) => {
    return obj.label === "(ii)Whether licence applied under Migration policy?";
  });
  const developerInputFiledColor10 = uncheckedValue.filter((obj) => {
    return obj.label === "2. Any encumbrance with respect to following";
  });
  const developerInputCheckedFiledColor10 = checkValue.filter((obj) => {
    return obj.label === "2. Any encumbrance with respect to following";
  });
  const developerInputFiledColor11 = uncheckedValue.filter((obj) => {
    return obj.label === "(ii) Existing litigation, if any, concerning applied land including co-sharers and collaborator";
  });
  const developerInputCheckedFiledColor11 = checkValue.filter((obj) => {
    return obj.label === "(ii) Existing litigation, if any, concerning applied land including co-sharers and collaborator";
  });
  const developerInputFiledColor12 = uncheckedValue.filter((obj) => {
    return obj.label === "(iii) Court orders, if any, affecting applied land";
  });
  const developerInputCheckedFiledColor12 = checkValue.filter((obj) => {
    return obj.label === "(iii) Court orders, if any, affecting applied land";
  });
  const developerInputFiledColor13 = uncheckedValue.filter((obj) => {
    return obj.label === "(iv) Any insolvency/liquidation proceedings against the land owner(s)/ collaborating developed ";
  });
  const developerInputCheckedFiledColor13 = checkValue.filter((obj) => {
    return obj.label === "(iv) Any insolvency/liquidation proceedings against the land owner(s)/ collaborating developed ";
  });
  const developerInputFiledColor14 = uncheckedValue.filter((obj) => {
    return obj.label === "(a)As per applied land (Yes/No)";
  });
  const developerInputCheckedFiledColor14 = checkValue.filter((obj) => {
    return obj.label === "(a)As per applied land (Yes/No)";
  });
  const developerInputFiledColor15 = uncheckedValue.filter((obj) => {
    return obj.label === "Revenue rasta";
  });
  const developerInputCheckedFiledColor15 = checkValue.filter((obj) => {
    return obj.label === "Revenue rasta";
  });
  const developerInputFiledColor16 = uncheckedValue.filter((obj) => {
    return obj.label === "Watercourse running";
  });
  const developerInputCheckedFiledColor16 = checkValue.filter((obj) => {
    return obj.label === "Watercourse running";
  });
  const developerInputFiledColor17 = uncheckedValue.filter((obj) => {
    return obj.label === "(d)Whether in Compact Block (Yes/No)";
  });
  const developerInputCheckedFiledColor17 = checkValue.filter((obj) => {
    return obj.label === "(d)Whether in Compact Block (Yes/No)";
  });
  const developerInputFiledColor18 = uncheckedValue.filter((obj) => {
    return obj.label === "Land Sandwiched";
  });
  const developerInputCheckedFiledColor18 = checkValue.filter((obj) => {
    return obj.label === "Land Sandwiched";
  });
  const developerInputFiledColor19 = uncheckedValue.filter((obj) => {
    return obj.label === "(f)Acquisition status (Yes/No)";
  });
  const developerInputCheckedFiledColor19 = checkValue.filter((obj) => {
    return obj.label === "(f)Acquisition status (Yes/No)";
  });
  const developerInputFiledColor20 = uncheckedValue.filter((obj) => {
    return obj.label === "Date of section 6 notification";
  });
  const developerInputCheckedFiledColor20 = checkValue.filter((obj) => {
    return obj.label === "Date of section 6 notification";
  });
  const developerInputFiledColor21 = uncheckedValue.filter((obj) => {
    return obj.label === "Orders Upload";
  });
  const developerInputCheckedFiledColor21 = checkValue.filter((obj) => {
    return obj.label === "Orders Upload";
  });
  const developerInputFiledColor22 = uncheckedValue.filter((obj) => {
    return obj.label === "(h) Whether land compensation received";
  });
  const developerInputCheckedFiledColor22 = checkValue.filter((obj) => {
    return obj.label === "(h) Whether land compensation received";
  });
  const developerInputFiledColor23 = uncheckedValue.filter((obj) => {
    return obj.label === "Status of release";
  });
  const developerInputCheckedFiledColor23 = checkValue.filter((obj) => {
    return obj.label === "Status of release";
  });
  const developerInputFiledColor24 = uncheckedValue.filter((obj) => {
    return obj.label === "Date of Award";
  });
  const developerInputCheckedFiledColor24 = checkValue.filter((obj) => {
    return obj.label === "Date of Award";
  });
  const developerInputFiledColor25 = uncheckedValue.filter((obj) => {
    return obj.label === "Date of Release";
  });
  const developerInputCheckedFiledColor25 = checkValue.filter((obj) => {
    return obj.label === "Date of Release";
  });
  const developerInputFiledColor26 = uncheckedValue.filter((obj) => {
    return obj.label === "Site Details";
  });
  const developerInputCheckedFiledColor26 = checkValue.filter((obj) => {
    return obj.label === "Site Details";
  });
  const developerInputFiledColor27 = uncheckedValue.filter((obj) => {
    return (
      obj.label === "whether the applied site is approachable from the proposed 18/24 m internal sectoral plan road/sector dividing road. (yes/no)"
    );
  });
  const developerInputCheckedFiledColor27 = checkValue.filter((obj) => {
    return (
      obj.label === "whether the applied site is approachable from the proposed 18/24 m internal sectoral plan road/sector dividing road. (yes/no)"
    );
  });
  const developerInputFiledColor28 = uncheckedValue.filter((obj) => {
    return obj.label === "(a)vacant: (Yes/No)";
  });
  const developerInputCheckedFiledColor28 = checkValue.filter((obj) => {
    return obj.label === "(a)vacant: (Yes/No)";
  });
  const developerInputFiledColor29 = uncheckedValue.filter((obj) => {
    return obj.label === "(b)Construction: (Yes/No)";
  });
  const developerInputCheckedFiledColor29 = checkValue.filter((obj) => {
    return obj.label === "(b)Construction: (Yes/No)";
  });
  const developerInputFiledColor30 = uncheckedValue.filter((obj) => {
    return obj.label === "(c)HT line:(Yes/No)";
  });
  const developerInputCheckedFiledColor30 = checkValue.filter((obj) => {
    return obj.label === "(c)HT line:(Yes/No)";
  });
  const developerInputFiledColor31 = uncheckedValue.filter((obj) => {
    return obj.label === "(d) IOC Gas Pipeline:(Yes/No)";
  });
  const developerInputCheckedFiledColor31 = checkValue.filter((obj) => {
    return obj.label === "(d) IOC Gas Pipeline:(Yes/No)";
  });
  const developerInputFiledColor32 = uncheckedValue.filter((obj) => {
    return obj.label === "(e)Nallah:(Yes/No)";
  });
  const developerInputCheckedFiledColor32 = checkValue.filter((obj) => {
    return obj.label === "(e)Nallah:(Yes/No)";
  });
  const developerInputFiledColor33 = uncheckedValue.filter((obj) => {
    return obj.label === "(f)Any revenue rasta/road:(Yes/No)";
  });
  const developerInputCheckedFiledColor33 = checkValue.filter((obj) => {
    return obj.label === "(f)Any revenue rasta/road:(Yes/No)";
  });
  const developerInputFiledColor34 = uncheckedValue.filter((obj) => {
    return obj.label === "(g)Any marginal land:(Yes/No)";
  });
  const developerInputCheckedFiledColor34 = checkValue.filter((obj) => {
    return obj.label === "(g)Any marginal land:(Yes/No)";
  });
  const developerInputFiledColor35 = uncheckedValue.filter((obj) => {
    return obj.label === "Utility Line";
  });
  const developerInputCheckedFiledColor35 = checkValue.filter((obj) => {
    return obj.label === "Utility Line";
  });
  const developerInputFiledColor36 = uncheckedValue.filter((obj) => {
    return obj.label === "5. Enclose the following documents as Annexures";
  });
  const developerInputCheckedFiledColor36 = checkValue.filter((obj) => {
    return obj.label === "5. Enclose the following documents as Annexures";
  });
  const developerInputFiledColor37 = uncheckedValue.filter((obj) => {
    return obj.label === "Land schedule";
  });
  const developerInputCheckedFiledColor37 = checkValue.filter((obj) => {
    return obj.label === "Land schedule";
  });
  const developerInputFiledColor38 = uncheckedValue.filter((obj) => {
    return obj.label === "Copy of Mutation";
  });
  const developerInputCheckedFiledColor38 = checkValue.filter((obj) => {
    return obj.label === "Copy of Mutation";
  });
  const developerInputFiledColor39 = uncheckedValue.filter((obj) => {
    return obj.label === "Copy of Jamabandi";
  });
  const developerInputCheckedFiledColor39 = checkValue.filter((obj) => {
    return obj.label === "Copy of Jamabandi";
  });
  const developerInputFiledColor40 = uncheckedValue.filter((obj) => {
    return obj.label === "Details of lease / patta, if any";
  });
  const developerInputCheckedFiledColor40 = checkValue.filter((obj) => {
    return obj.label === "Details of lease / patta, if any";
  });
  const developerInputFiledColor41 = uncheckedValue.filter((obj) => {
    return obj.label === "Approved Layout of Plan/ Site plan for(GH)Showing Area(s)/Proposed migration";
  });
  const developerInputCheckedFiledColor41 = checkValue.filter((obj) => {
    return obj.label === "Approved Layout of Plan/ Site plan for(GH)Showing Area(s)/Proposed migration";
  });
  const developerInputFiledColor42 = uncheckedValue.filter((obj) => {
    return obj.label === "Proposed Layout of Plan /site plan for area applied for migration.";
  });
  const developerInputCheckedFiledColor42 = checkValue.filter((obj) => {
    return obj.label === "Proposed Layout of Plan /site plan for area applied for migration.";
  });
  const developerInputFiledColor43 = uncheckedValue.filter((obj) => {
    return obj.label === "Revised Land Schedule";
  });
  const developerInputCheckedFiledColor43 = checkValue.filter((obj) => {
    return obj.label === "Revised Land Schedule";
  });
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
          Land Schedule
        </span>
        {open ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open}>
        <div id="example-collapse-text">
          <Form.Group
            style={{ display: props.displayGeneral, border: "2px solid #e9ecef", margin: 10, padding: 10 }}
            className="justify-content-center"
          >
            <Row className="ms-auto" style={{ marginBottom: 20 }}>
              <Col className="ms-auto" md={4} xxl lg="12">
                <Form.Label
                // placeholder={personalinfo !== null ? personalinfo.authorizedDeveloper : null}
                >
                  (i)Whether licence applied for additional area ?
                </Form.Label>
                {/* &nbsp;&nbsp;
                
                <br></br> */}

                <div style={{ display: "flex" }}>
                  <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow} disabled />
                  <label for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow} disabled />
                  <label for="No">No</label>
                  {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
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
                      //  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                    }}
                  ></ReportProblemIcon>
                  <ModalChild
                    labelmodal={labelValue}
                    passmodalData={handlemodaldData}
                    isYesorNoChecked={handleYesOrNochecked}
                    displaymodal={smShow}
                    setColor={setColor}
                    fieldValue={fieldValue}
                    // remarksUpdate={currentRemarks}
                  ></ModalChild>
                </div>
              </Col>
            </Row>

            <div>
              <Row className="ms-auto" style={{ marginBottom: 20 }}>
                <Col className="ms-auto" md={4} xxl lg="4">
                  <label>
                    {/* License No. of Parent License */}
                    <h5>License No. of Parent License &nbsp;</h5>
                  </label>

                  <div style={{ display: "flex" }}>
                    <Form.Control
                      height={30}
                      style={{ maxWidth: 200, marginRight: 5 }}
                      // placeholder={personalinfo !== null ? personalinfo.licenseApplied : null}
                      disabled
                    ></Form.Control>
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
                        // setFieldValue(personalinfo !== null ? personalinfo.licenseApplied : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  {/* <input type="number" className="form-control" /> */}
                </Col>
                <Col className="ms-auto" md={4} xxl lg="4">
                  <label htmlFor="potential">
                    <h6>
                      {/* Potential Zone: */}
                      <h5>Potential Zone: &nbsp;</h5>
                    </h6>
                  </label>

                  <div style={{ display: "flex" }}>
                    <Form.Select
                      type="text"
                      placeholder="Puropse"
                      // onChange={handleChangesetPurpose}
                      height={30}
                      style={{ maxWidth: 200, marginRight: 5 }}
                      disabled
                    >
                      {/* <select className="form-control" id="Puropse" name="potential" placeholder="Puropse" onChange={handleChangesetPurpose} disabled> */}
                      {/* <option value="">--Potential Zone--</option>
                      <option value="K.Mishra">Hyper</option>
                      <option value="potential 1">High I</option>
                      <option value="potential 2">High II</option>
                      <option value="potential 2">Medium</option>
                      <option value="potential 2">Low I</option>
                      <option value="potential 2">Low II</option> */}
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
                </Col>
                <Col className="ms-auto" md={4} xxl lg="4">
                  <label>
                    {/* Site Location Purpose */}
                    <h5>Site Location Purpose: &nbsp;</h5>
                  </label>
                  <div style={{ display: "flex" }}>
                    <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
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
                </Col>
                {/* </Row>
              <Row className="ms-auto" style={{ marginBottom: 20 }}> */}
                <Col className="ms-auto" md={4} xxl lg="4">
                  <label>
                    {/* Approach Type (Type of Policy) */}
                    <h5>Approach Type (Type of Policy) &nbsp;</h5>
                  </label>

                  <div style={{ display: "flex" }}>
                    <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
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
                </Col>
                <Col className="ms-auto" md={4} xxl lg="4">
                  <label>
                    <h6>Approach Road Width&nbsp;&nbsp;</h6>{" "}
                  </label>
                  <div style={{ display: "flex" }}>
                    <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
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
                </Col>
                <Col className="ms-auto" md={4} xxl lg="4">
                  <label>
                    <h6>Specify Others</h6>
                  </label>
                  <div style={{ display: "flex" }}>
                    <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
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
                </Col>
              </Row>
              <Row className="ms-auto" style={{ marginBottom: 20 }}>
                <div className="col col-4">
                  <h6>Type of land</h6>{" "}
                  <div style={{ display: "flex" }}>
                    <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
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
                </div>

                <div className="col col-4">
                  <h6>Third-party right created</h6>

                  <div style={{ display: "flex" }}>
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow13} disabled />
                    &nbsp;&nbsp;
                    <label for="Yes">
                      <h6>Yes</h6>
                    </label>
                    &nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow13} disabled />
                    &nbsp;&nbsp;
                    <label for="No">
                      <h6>No</h6>
                    </label>
                    <DownloadForOfflineIcon color="primary" />
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
                </div>

                {/* {showhide13 === "Yes" && (
                    <div className="row ">
                      <div className="col col-4">
                      <label> Remark </label>
                      <input type="text" className="form-control" disabled />
                      </div>
                      <div className="col col-4">
                      <label> Document Download </label>
                      <DownloadForOfflineIcon color="primary" />
                      </div>
                    </div>
                  )}
                  {showhide13 === "No" && (
                    <div className="row ">
                      <div className="col col-4">
                      <label> Document Download </label>
                      <DownloadForOfflineIcon color="primary" />
                      </div>
                    </div>
                  )} */}
              </Row>
            </div>
            {/* )} */}
            <Row className="ms-auto">
              <Col md={4} xxl lg="12">
                <Form.Label>(ii)Whether licence applied under Migration policy?</Form.Label>
                &nbsp;&nbsp;
                <div style={{ display: "flex" }}>
                  {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                  <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow17} disabled />
                  <label for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow17} disabled />
                  <label for="No">No</label>
                  <ReportProblemIcon
                    style={{
                      color:
                        developerInputFiledColor9.length > 0
                          ? developerInputFiledColor9[0].color.data
                          : developerInputCheckedFiledColor9.length > 0
                          ? developerInputCheckedFiledColor9[0].color.data
                          : "#FFB602",
                    }}
                    onClick={() => {
                      setLabelValue("(ii)Whether licence applied under Migration policy?"), setSmShow(true), console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                </div>
                <br></br>
                {showhide17 === "Yes" && (
                  <div className="col col-6 ">
                    <h6 data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Another Copy of Shahjra Plan&nbsp;&nbsp;
                      <DownloadForOfflineIcon color="primary" />{" "}
                    </h6>
                    <input type="file" className="form-control" />
                  </div>
                )}
              </Col>
            </Row>
            <hr></hr>
            <h5 className="text-black">
              2. Any encumbrance with respect to following :&nbsp;&nbsp;
              <div style={{ display: "flex" }}>
                {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
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
                    setLabelValue("2. Any encumbrance with respect to following"), setSmShow(true), console.log("modal open");
                  }}
                ></ReportProblemIcon>
              </div>
            </h5>
            <br></br>
            {/* <label htmlFor="gen">Rehan / Mortgage</label>&nbsp;&nbsp;
            <input type="radio" id="Yes" value="1" onChange={handleChange} name="Yes" onClick={handleshow18} />
            &nbsp;&nbsp;
            <label for="Yes"></label>&nbsp;&nbsp;&nbsp;&nbsp;
            <label htmlFor="npnl">Patta/Lease</label>&nbsp;&nbsp;
            <input type="radio" id="Yes" value="2" onChange={handleChange} name="Yes" onClick={handleshow18} />
            &nbsp;&nbsp;
            <label for="Yes"></label>&nbsp;&nbsp;&nbsp;&nbsp;
            <label htmlFor="npnl">Gair/Marusi</label>&nbsp;&nbsp;
            <input type="radio" id="Yes" value="2" onChange={handleChange} name="Yes" onClick={handleshow18} />
            &nbsp;&nbsp; */}
            <label for="Yes"></label>
            <div className="row">
              <div className="col col-4">
                <label htmlFor="npnl">
                  <h6>Any other, please specify</h6>
                </label>
                <input type="text" className="form-control" disabled />
              </div>
            </div>
            <hr />
            <h6>
              (ii) Existing litigation, if any, concerning applied land including co-sharers and collaborator&nbsp;&nbsp;
              {/* <Form.Check
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
              ></Form.Check> */}
              <div style={{ display: "flex" }}>
                {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                <label for="No">No</label>
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
                    setLabelValue("(ii) Existing litigation, if any, concerning applied land including co-sharers and collaborator"),
                      setSmShow(true),
                      console.log("modal open");
                  }}
                ></ReportProblemIcon>
              </div>
            </h6>
            {/* <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
            <label for="Yes">Yes</label>&nbsp;&nbsp;
            <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
            <label for="No">No</label> */}
            <hr />
            <h6>
              (iii) Court orders, if any, affecting applied land&nbsp;&nbsp;
              {/* <Form.Check
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
              ></Form.Check> */}
              <div style={{ display: "flex" }}>
                {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                <label for="No">No</label>
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
                    setLabelValue("(iii) Court orders, if any, affecting applied land"), setSmShow(true), console.log("modal open");
                  }}
                ></ReportProblemIcon>
              </div>
            </h6>
            {/* <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
            <label for="Yes">Yes</label>&nbsp;&nbsp;
            <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
            <label for="No">No</label> */}
            <hr />
            <h6>
              (iv) Any insolvency/liquidation proceedings against the land owner(s)/ collaborating developed :&nbsp;&nbsp;
              {/* <Form.Check
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
              ></Form.Check> */}
              <div style={{ display: "flex" }}>
                {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                <label for="No">No</label>
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
                    setLabelValue("(iv) Any insolvency/liquidation proceedings against the land owner(s)/ collaborating developed "),
                      setSmShow(true),
                      console.log("modal open");
                  }}
                ></ReportProblemIcon>
              </div>
            </h6>
            {/* <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
            <label for="Yes">Yes</label>&nbsp;&nbsp;
            <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
            <label for="No">No</label> */}
            <hr />
            <h5 className="text-black">3.Shajra Plan</h5>
            <div className="row">
              <div className="col col-3 ">
                <h6>
                  (a)As per applied land (Yes/No) &nbsp;&nbsp;
                  {/* <Form.Check
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
                  ></Form.Check> */}
                  <div style={{ display: "flex" }}>
                    {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                    <label for="No">No</label>
                    <ReportProblemIcon
                      style={{
                        color:
                          developerInputFiledColor14.length > 0
                            ? developerInputFiledColor14[0].color.data
                            : developerInputCheckedFiledColor14.length > 0
                            ? developerInputCheckedFiledColor14[0].color.data
                            : "#FFB602",
                      }}
                      onClick={() => {
                        setLabelValue("(a)As per applied land (Yes/No)"), setSmShow(true), console.log("modal open");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h6>
                {/* <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                <label for="No">No</label> */}
              </div>

              <div className="col col-3 ">
                <h6 data-toggle="tooltip" data-placement="top" title="If any revenue rasta abuts to the applied site ?">
                  (b)&nbsp;Revenue rasta&nbsp;
                  {/* <InfoIcon style={{color:"blue"}}/>  */}
                  &nbsp;&nbsp;
                  {/* <Form.Check
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
                  ></Form.Check> */}
                  <div style={{ display: "flex" }}>
                    {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow1} />
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow1} />
                    <label for="No">No</label>
                    <ReportProblemIcon
                      style={{
                        color:
                          developerInputFiledColor15.length > 0
                            ? developerInputFiledColor15[0].color.data
                            : developerInputCheckedFiledColor15.length > 0
                            ? developerInputCheckedFiledColor15[0].color.data
                            : "#FFB602",
                      }}
                      onClick={() => {
                        setLabelValue("Revenue rasta"), setSmShow(true), console.log("modal open");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h6>
                {/* <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow1} />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow1} />
                <label for="No">No</label> */}
                {showhide2 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label> Width of revenue rasta </label>
                      <input type="number" className="form-control" disabled />
                    </div>
                  </div>
                )}
              </div>

              <div className="col col-3 ">
                <h6 data-toggle="tooltip" data-placement="top" title="Watercourse running along boundary through the applied site ?">
                  (c)&nbsp;Watercourse running&nbsp;
                  {/* <InfoIcon style={{color:"blue"}}/>  */}
                  &nbsp;&nbsp;
                  {/* <Form.Check
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
                  ></Form.Check> */}
                  <div style={{ display: "flex" }}>
                    {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow2} />
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow2} />
                    <label for="No">No</label>
                    <ReportProblemIcon
                      style={{
                        color:
                          developerInputFiledColor16.length > 0
                            ? developerInputFiledColor16[0].color.data
                            : developerInputCheckedFiledColor16.length > 0
                            ? developerInputCheckedFiledColor16[0].color.data
                            : "#FFB602",
                      }}
                      onClick={() => {
                        setLabelValue("Watercourse running"), setSmShow(true), console.log("modal open");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h6>
                {/* <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow2} />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow2} />
                <label for="No">No</label> */}
                {showhide3 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label> Rev. rasta width </label>
                      <input type="number" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3 ">
                <h6>
                  (d)Whether in Compact Block (Yes/No) &nbsp;&nbsp;
                  {/* <Form.Check
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
                  ></Form.Check> */}
                  <div style={{ display: "flex" }}>
                    {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                    <label for="No">No</label>
                    <ReportProblemIcon
                      style={{
                        color:
                          developerInputFiledColor17.length > 0
                            ? developerInputFiledColor17[0].color.data
                            : developerInputCheckedFiledColor17.length > 0
                            ? developerInputCheckedFiledColor17[0].color.data
                            : "#FFB602",
                      }}
                      onClick={() => {
                        setLabelValue("(d)Whether in Compact Block (Yes/No)"), setSmShow(true), console.log("modal open");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h6>
                {/* <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                <label for="No">No</label> */}
              </div>
              <br></br>
              <div className="row">
                <div className="col col-3 ">
                  <h6 data-toggle="tooltip" data-placement="top" title="If any other owners' land is sandwiched within applied land.">
                    (e)&nbsp;Land Sandwiched&nbsp;
                    {/* <InfoIcon style={{color:"blue"}}/>  */}
                    &nbsp;&nbsp;
                    <div style={{ display: "flex" }}>
                      <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                      <label for="Yes">Yes</label>&nbsp;&nbsp;
                      <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                      <label for="No">No</label>
                      <ReportProblemIcon
                        style={{
                          color:
                            developerInputFiledColor18.length > 0
                              ? developerInputFiledColor18[0].color.data
                              : developerInputCheckedFiledColor18.length > 0
                              ? developerInputCheckedFiledColor18[0].color.data
                              : "#FFB602",
                        }}
                        onClick={() => {
                          setLabelValue("Land Sandwiched"), setSmShow(true), console.log("modal open");
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </h6>
                </div>
                <div className="col col-3 ">
                  <h6>
                    (f)Acquisition status (Yes/No) &nbsp;&nbsp;
                    <div style={{ display: "flex" }}>
                      {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                      <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow3} />
                      <label for="Yes">Yes</label>&nbsp;&nbsp;
                      <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow3} />
                      <label for="No">No</label>
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
                          setLabelValue("(f)Acquisition status (Yes/No)"), setSmShow(true), console.log("modal open");
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </h6>

                  {showhide4 === "Yes" && (
                    <div className="row ">
                      <div className="col col">
                        <label>Remark</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="col col-3">
                  <div>
                    <label>Date of section 4 notification </label>
                    &nbsp;&nbsp;
                    <div style={{ display: "flex" }}>
                      <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
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
                    {/* <Form.Control style={{ maxWidth: 200, marginTop: 10 }} disabled></Form.Control> */}
                  </div>
                </div>
                <div className="col col-3">
                  <div>
                    <label>Date of section 6 notification</label>
                    &nbsp;&nbsp;
                    <div style={{ display: "flex" }}>
                      <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
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
                          setLabelValue("Date of section 6 notification"), setSmShow(true), console.log("modal open");
                        }}
                      ></ReportProblemIcon>
                    </div>
                    {/* <Form.Control style={{ maxWidth: 200, marginTop: 10 }} disabled></Form.Control> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col col-12 ">
                <h6 data-toggle="tooltip" data-placement="top" title="Whether details/orders of release/exclusion of land uploaded.">
                  (g)&nbsp;Orders Upload &nbsp;
                  {/* <InfoIcon style={{color:"blue"}}/>  */}
                  &nbsp;&nbsp;
                  <div style={{ display: "flex" }}>
                    {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow16} />
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow16} />
                    <label for="No">No</label>
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
                        setLabelValue("Orders Upload"), setSmShow(true), console.log("modal open");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h6>

                {showhide16 === "Yes" && (
                  <div className="row ">
                    <div className="col col-3 ">
                      <h6>
                        (h) Whether land compensation received&nbsp;&nbsp;
                        <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                        &nbsp;&nbsp;
                        <label for="Yes">Yes</label>&nbsp;&nbsp;
                        <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                        &nbsp;&nbsp;
                        <label for="No">No</label>
                      </h6>

                      <div style={{ display: "flex" }}>
                        <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
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
                            setLabelValue("(h) Whether land compensation received"), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </div>
                    <div className="col col-3">
                      <div className="form-group">
                        <label htmlFor="releasestatus">
                          <h6>Status of release</h6>
                        </label>

                        <div style={{ display: "flex" }}>
                          <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
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
                              setLabelValue("Status of release"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
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
                          <h6>Date of Award</h6>
                        </label>
                        {/* <Form.Check
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
                        ></Form.Check> */}
                        <div style={{ display: "flex" }}>
                          <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
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
                              setLabelValue("Date of Award"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                        {/* <input type="date" name="awarddate" className="form-control"></input> */}
                      </div>
                    </div>
                    <div className="col col-3">
                      <div className="form-group ">
                        <label htmlFor="releasedate">
                          <h6>Date of Release</h6>{" "}
                        </label>

                        <div style={{ display: "flex" }}>
                          <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
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
                              setLabelValue("Date of Release"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                        <input type="date" name="releasedate" className="form-control"></input>
                      </div>
                    </div>
                    <div className="col col-3">
                      <div className="form-group ">
                        <label htmlFor="sitedetails">
                          <h6>Site Details</h6>
                        </label>
                        {/* <Form.Check
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
                        ></Form.Check> */}
                        <div style={{ display: "flex" }}>
                          <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
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
                              setLabelValue("Site Details"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                        {/* <input type="number" name="sitedetails" className="form-control " /> */}
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
                  whether the applied site is approachable from the proposed 18/24 m internal sectoral plan road/sector dividing road. (yes/no)
                  &nbsp;&nbsp;
                  <div style={{ display: "flex" }}>
                    {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                    <label for="No">No</label>
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
                        setLabelValue(
                          "whether the applied site is approachable from the proposed 18/24 m internal sectoral plan road/sector dividing road. (yes/no)"
                        ),
                          setSmShow(true),
                          console.log("modal open");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h6>
                {/* <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                <label for="No">No</label> */}
              </div>
            </div>
            <hr />
            <h5 className="text-black">4.Site condition</h5>
            <div className="row">
              <div className="col col-3">
                <h6>
                  (a)vacant: (Yes/No){" "}
                  <div style={{ display: "flex" }}>
                    {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                    <label for="No">No</label>
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
                        setLabelValue("(a)vacant: (Yes/No)"), setSmShow(true), console.log("modal open");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h6>
              </div>
              <div className="col col-3">
                <h6 onChange={(e) => setConstruction(e.target.value)} value={construction}>
                  (b)Construction: (Yes/No)
                </h6>

                <div style={{ display: "flex" }}>
                  {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                  <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow4} />
                  <label for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow4} />
                  <label for="No">No</label>
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
                      setLabelValue("(b)Construction: (Yes/No)"), setSmShow(true), console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                </div>

                {showhide4 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label>Type of Construction</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3">
                <h6 onChange={(e) => setHt(e.target.value)} value={ht}>
                  (c)HT line:(Yes/No)
                </h6>

                <div style={{ display: "flex" }}>
                  {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                  <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow5} />
                  <label for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow5} />
                  <label for="No">No</label>
                  <ReportProblemIcon
                    style={{
                      color:
                        developerInputFiledColor30.length > 0
                          ? developerInputFiledColor30[0].color.data
                          : developerInputCheckedFiledColor30.length > 0
                          ? developerInputCheckedFiledColor30[0].color.data
                          : "#FFB602",
                    }}
                    onClick={() => {
                      setLabelValue("(c)HT line:(Yes/No)"), setSmShow(true), console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                </div>

                {showhide5 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label>HT Remarks</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3">
                <h6 onChange={(e) => setGas(e.target.value)} value={gas}>
                  (d) IOC Gas Pipeline:(Yes/No)
                </h6>

                <div style={{ display: "flex" }}>
                  <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow6} />
                  <label for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow6} />
                  <label for="No">No</label>
                  <ReportProblemIcon
                    style={{
                      color:
                        developerInputFiledColor31.length > 0
                          ? developerInputFiledColor31[0].color.data
                          : developerInputCheckedFiledColor31.length > 0
                          ? developerInputCheckedFiledColor31[0].color.data
                          : "#FFB602",
                    }}
                    onClick={() => {
                      setLabelValue("(d) IOC Gas Pipeline:(Yes/No)"), setSmShow(true), console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                </div>
                {/* <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow6} />
                <label for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow6} />
                <label for="No">No</label> */}
                {showhide6 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label>IOC Remarks</label>
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
                  (e)Nallah:(Yes/No){" "}
                </h6>

                <div style={{ display: "flex" }}>
                  <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow7} />
                  <label for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow7} />
                  <label for="No">No</label>
                  <ReportProblemIcon
                    style={{
                      color:
                        developerInputFiledColor32.length > 0
                          ? developerInputFiledColor32[0].color.data
                          : developerInputCheckedFiledColor32.length > 0
                          ? developerInputCheckedFiledColor32[0].color.data
                          : "#FFB602",
                    }}
                    onClick={() => {
                      setLabelValue("(e)Nallah:(Yes/No)"), setSmShow(true), console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                </div>

                {showhide7 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label>Nallah Remarks</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3">
                <h6 onChange={(e) => setRoad(e.target.value)} value={road}>
                  (f)Any revenue rasta/road:(Yes/No)
                </h6>{" "}
                <div style={{ display: "flex" }}>
                  <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow8} />
                  <label for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow8} />
                  <label for="No">No</label>
                  <ReportProblemIcon
                    style={{
                      color:
                        developerInputFiledColor33.length > 0
                          ? developerInputFiledColor33[0].color.data
                          : developerInputCheckedFiledColor33.length > 0
                          ? developerInputCheckedFiledColor33[0].color.data
                          : "#FFB602",
                    }}
                    onClick={() => {
                      setLabelValue("(f)Any revenue rasta/road:(Yes/No)"), setSmShow(true), console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                </div>
                {showhide8 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label>Width</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3">
                <h6 onChange={(e) => setLand(e.target.value)} value={land}>
                  (g)Any marginal land:(Yes/No)
                </h6>{" "}
                <div style={{ display: "flex" }}>
                  <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow9} />
                  <label for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow9} />
                  <label for="No">No</label>
                  <ReportProblemIcon
                    style={{
                      color:
                        developerInputFiledColor34.length > 0
                          ? developerInputFiledColor34[0].color.data
                          : developerInputCheckedFiledColor34.length > 0
                          ? developerInputCheckedFiledColor34[0].color.data
                          : "#FFB602",
                    }}
                    onClick={() => {
                      setLabelValue("(g)Any marginal land:(Yes/No)"), setSmShow(true), console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                </div>
                {showhide9 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label>Remark</label>
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
                  (h)&nbsp;Utility Line &nbsp;
                </h6>

                <div style={{ display: "flex" }}>
                  <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow0} />
                  <label for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow0} />
                  <label for="No">No</label>
                  <ReportProblemIcon
                    style={{
                      color:
                        developerInputFiledColor35.length > 0
                          ? developerInputFiledColor35[0].color.data
                          : developerInputCheckedFiledColor35.length > 0
                          ? developerInputCheckedFiledColor35[0].color.data
                          : "#FFB602",
                    }}
                    onClick={() => {
                      setLabelValue("Utility Line"), setSmShow(true), console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                </div>

                {showhide0 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label>Width of row</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <hr />
            <h5 className="text-black">
              5. Enclose the following documents as Annexures&nbsp;&nbsp;
              <div style={{ display: "flex" }}>
                <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
                <ReportProblemIcon
                  style={{
                    color:
                      developerInputFiledColor36.length > 0
                        ? developerInputFiledColor36[0].color.data
                        : developerInputCheckedFiledColor36.length > 0
                        ? developerInputCheckedFiledColor36[0].color.data
                        : "#FFB602",
                  }}
                  onClick={() => {
                    setLabelValue("5. Enclose the following documents as Annexures"), setSmShow(true), console.log("modal open");
                  }}
                ></ReportProblemIcon>
              </div>
            </h5>
            <div className="row">
              <div className="col col-3">
                <h6>Land schedule</h6>
                &nbsp;&nbsp;
                <div style={{ display: "flex" }}>
                  {<DownloadForOfflineIcon color="primary" />}
                  <ReportProblemIcon
                    style={{
                      color:
                        developerInputFiledColor37.length > 0
                          ? developerInputFiledColor37[0].color.data
                          : developerInputCheckedFiledColor37.length > 0
                          ? developerInputCheckedFiledColor37[0].color.data
                          : "#FFB602",
                    }}
                    onClick={() => {
                      setLabelValue("Land schedule"), setSmShow(true), console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
              <div className="col col-3">
                <h6>Copy of Mutation</h6>
                &nbsp;&nbsp;
                <div style={{ display: "flex" }}>
                  {<DownloadForOfflineIcon color="primary" />}
                  <ReportProblemIcon
                    style={{
                      color:
                        developerInputFiledColor38.length > 0
                          ? developerInputFiledColor38[0].color.data
                          : developerInputCheckedFiledColor38.length > 0
                          ? developerInputCheckedFiledColor38[0].color.data
                          : "#FFB602",
                    }}
                    onClick={() => {
                      setLabelValue("Copy of Mutation"), setSmShow(true), console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
              <div className="col col-3">
                <h6>Copy of Jamabandi</h6>
                &nbsp;&nbsp;
                <div style={{ display: "flex" }}>
                  {<DownloadForOfflineIcon color="primary" />}
                  <ReportProblemIcon
                    style={{
                      color:
                        developerInputFiledColor39.length > 0
                          ? developerInputFiledColor39[0].color.data
                          : developerInputCheckedFiledColor39.length > 0
                          ? developerInputCheckedFiledColor39[0].color.data
                          : "#FFB602",
                    }}
                    onClick={() => {
                      setLabelValue("Copy of Jamabandi"), setSmShow(true), console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
              <div className="col col-3">
                <h6>Details of lease / patta, if any</h6>
                &nbsp;&nbsp;
                <div style={{ display: "flex" }}>
                  {<DownloadForOfflineIcon color="primary" />}
                  <ReportProblemIcon
                    style={{
                      color:
                        developerInputFiledColor40.length > 0
                          ? developerInputFiledColor40[0].color.data
                          : developerInputCheckedFiledColor40.length > 0
                          ? developerInputCheckedFiledColor40[0].color.data
                          : "#FFB602",
                    }}
                    onClick={() => {
                      setLabelValue("Details of lease / patta, if any"), setSmShow(true), console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
            </div>
            <br></br>
            <div className="row">
              <div className="col col-3">
                &nbsp;&nbsp;
                <h6>Approved Layout of Plan/ Site plan for(GH)Showing Area(s)/Proposed migration</h6>
                &nbsp;&nbsp;
                <div style={{ display: "flex" }}>
                  {<DownloadForOfflineIcon color="primary" />}

                  <ReportProblemIcon
                    style={{
                      color:
                        developerInputFiledColor41.length > 0
                          ? developerInputFiledColor41[0].color.data
                          : developerInputCheckedFiledColor41.length > 0
                          ? developerInputCheckedFiledColor41[0].color.data
                          : "#FFB602",
                    }}
                    onClick={() => {
                      setLabelValue("Approved Layout of Plan/ Site plan for(GH)Showing Area(s)/Proposed migration"),
                        setSmShow(true),
                        console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
              <div className="col col-3">
                <h6>Proposed Layout of Plan /site plan for area applied for migration.</h6>
                &nbsp;&nbsp;
                <div style={{ display: "flex" }}>
                  {<DownloadForOfflineIcon color="primary" />}
                  <ReportProblemIcon
                    style={{
                      color:
                        developerInputFiledColor42.length > 0
                          ? developerInputFiledColor42[0].color.data
                          : developerInputCheckedFiledColor42.length > 0
                          ? developerInputCheckedFiledColor42[0].color.data
                          : "#FFB602",
                    }}
                    onClick={() => {
                      setLabelValue("Proposed Layout of Plan /site plan for area applied for migration."), setSmShow(true), console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
              <div className="col col-3">
                <h6>Revised Land Schedule</h6>
                &nbsp;&nbsp;
                <div style={{ display: "flex" }}>
                  {<DownloadForOfflineIcon color="primary" />}
                  <ReportProblemIcon
                    style={{
                      color:
                        developerInputFiledColor43.length > 0
                          ? developerInputFiledColor43[0].color.data
                          : developerInputCheckedFiledColor43.length > 0
                          ? developerInputCheckedFiledColor43[0].color.data
                          : "#FFB602",
                    }}
                    onClick={() => {
                      setLabelValue("Revised Land Schedule"), setSmShow(true), console.log("modal open");
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
            </div>
            <br></br>
            {/* <div style={{ position: "relative", marginBottom: 40 }}>
              <Button onClick={() => props.passUncheckedList({ data: uncheckedValue })}>Submit</Button>
            </div> */}
          </Form.Group>
        </div>
      </Collapse>
    </Form>
  );
};

export default Developerinfo;
