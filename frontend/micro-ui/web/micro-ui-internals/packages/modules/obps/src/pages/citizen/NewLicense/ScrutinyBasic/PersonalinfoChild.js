import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import * as Icon from "react-bootstrap-icons";
// import { XCircleFill } from "react-bootstrap-icons";
// import { CheckCircleFill } from "react-bootstrap-icons";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
// import BootstrapSwitchButton from "bootstrap-switch-button-react";
// import Alert from "react-bootstrap/Alert";
// import ToggleButton from "react-toggle-button";
// import Toggle from "react-toggle";
// import "react-toggle/style.css";
// import WarningIcon from "@material-ui/icons/Warning";

// import LicenseDetailsScrutiny from "../ScrutinyBasic/Developer/LicenseDetailsScrutiny";
// import CapacityScrutiny from "../ScrutinyBasic/Developer/CapacityScrutiny";
import Collapse from "react-bootstrap/Collapse";
import Modal from "react-bootstrap/Modal";
import ModalChild from "./Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const PersonalinfoChild = (props) => {
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
  const [fieldValue, setFieldValue] = useState("");
  const [colorOfDeveloperIcon,setColorofDeveloperIcon]=useState("#FFB602");
  const [colorOfDeveloperIcon1,setColorofDeveloperIcon1]=useState("#FFB602");
  const [colorOfDeveloperIcon2,setColorofDeveloperIcon2]=useState("#FFB602");
  const [colorOfDeveloperIcon3,setColorofDeveloperIcon3]=useState("#FFB602");
  // const [colorOfDeveloperIcon4,setColorofDeveloperIcon4]=useState("#FFB602");
  // const [colorOfDeveloperIcon5,setColorofDeveloperIcon5]=useState("#FFB602");
  // const [colorOfDeveloperIcon6,setColorofDeveloperIcon6]=useState("#FFB602");
  // const [colorOfDeveloperIcon7,setColorofDeveloperIcon7]=useState("#FFB602");
  

    // const [fieldValue1, setFieldValue1] = useState("");

  const personalinfo = props.personalinfo;
  const iconStates = props.iconColorState;


  const getColorofFieldIcon=()=>{
    if (iconStates!==null && iconStates!==undefined) {
      console.log("color method called");
      const fieldPresent = iconStates.egScrutiny.filter((el)=> {
        if (el.fieldIdL==="Developer") {
            return el;
        }
      });
      console.log("filteration value", fieldPresent);
      if (!fieldPresent[0].isApproved) {
        setColorofDeveloperIcon("#ff0000");
      }else if (fieldPresent[0].isApproved) {
        setColorofDeveloperIcon("#09cb3d")
      }
    }
  };
  const getColorofFieldIcon1=()=>{
    if (iconStates!==null && iconStates!==undefined) {
      console.log("color method called");
      const fieldPresent = iconStates.egScrutiny.filter((el)=> {
        if (el.fieldIdL==="Authorized Person Name") {
            return el;
        }
      });
      console.log("filteration value1", fieldPresent);
      if (!fieldPresent[0].isApproved) {
        setColorofDeveloperIcon1("#ff0000");
      }else if (fieldPresent[0].isApproved) {
        setColorofDeveloperIcon1("#09cb3d")
      }
    }
  };
  const getColorofFieldIcon2=()=>{
    if (iconStates!==null && iconStates!==undefined) {
      console.log("color method called");
      const fieldPresent = iconStates.egScrutiny.filter((el)=> {
        if (el.fieldIdL==="Autrhoized Mobile No") {
            return el;
        }
      });
      console.log("filteration value2", fieldPresent);
      if (!fieldPresent[0].isApproved) {
        setColorofDeveloperIcon2("#ff0000");
      }else if (fieldPresent[0].isApproved) {
        setColorofDeveloperIcon2("#09cb3d")
      }
    }
  };
  const getColorofFieldIcon3=()=>{
    if (iconStates!==null && iconStates!==undefined) {
      console.log("color method called");
      const fieldPresent = iconStates.egScrutiny.filter((el)=> {
        if (el.fieldIdL==="Authorized MobileNo. 2 ") {
            return el;
        }
      });
      console.log("filteration value3", fieldPresent);
      if (!fieldPresent[0].isApproved) {
        setColorofDeveloperIcon3("#ff0000");
      }else if (fieldPresent[0].isApproved) {
        setColorofDeveloperIcon3("#09cb3d")
      }
    }
  };
  // const getColorofFieldIcon4=()=>{
  //   if (iconStates!==null && iconStates!==undefined) {
  //     console.log("color method called");
  //     const fieldPresent = iconStates.egScrutiny.filter((el)=> {
  //       if (el.fieldIdL==="Email ID") {
  //           return el;
  //       }
  //     });
  //     console.log("filteration value4", fieldPresent);
  //     if (!fieldPresent[0].isApproved) {
  //       setColorofDeveloperIcon4("#ff0000");
  //     }else if (fieldPresent[0].isApproved) {
  //       setColorofDeveloperIcon4("#09cb3d")
  //     }
  //   }
  // };
  // const getColorofFieldIcon5=()=>{
  //   if (iconStates!==null && iconStates!==undefined) {
  //     console.log("color method called");
  //     const fieldPresent = iconStates.egScrutiny.filter((el)=> {
  //       if (el.fieldIdL==="PAN No.") {
  //           return el;
  //       }
  //     });
  //     console.log("filteration value5", fieldPresent);
  //     if (!fieldPresent[0].isApproved) {
  //       setColorofDeveloperIcon5("#ff0000");
  //     }else if (fieldPresent[0].isApproved) {
  //       setColorofDeveloperIcon5("#09cb3d")
  //     }
  //   }
  // };
  // const getColorofFieldIcon6=()=>{
  //   if (iconStates!==null && iconStates!==undefined) {
  //     console.log("color method called");
  //     const fieldPresent = iconStates.egScrutiny.filter((el)=> {
  //       if (el.fieldIdL==="Address  1") {
  //           return el;
  //       }
  //     });
  //     console.log("filteration value6", fieldPresent);
  //     if (!fieldPresent[0].isApproved) {
  //       setColorofDeveloperIcon6("#ff0000");
  //     }else if (fieldPresent[0].isApproved) {
  //       setColorofDeveloperIcon6("#09cb3d")
  //     }
  //   }
  // };
  // const getColorofFieldIcon7=()=>{
  //   if (iconStates!==null && iconStates!==undefined) {
  //     console.log("color method called");
  //     const fieldPresent = iconStates.egScrutiny.filter((el)=> {
  //       if (el.fieldIdL==="Village/City") {
  //           return el;
  //       }
  //     });
  //     console.log("filteration value6", fieldPresent);
  //     if (!fieldPresent[0].isApproved) {
  //       setColorofDeveloperIcon7("#ff0000");
  //     }else if (fieldPresent[0].isApproved) {
  //       setColorofDeveloperIcon7("#09cb3d")
  //     }
  //   }
  // };

  useEffect(()=>{
    getColorofFieldIcon();
    getColorofFieldIcon1();
   
    
    // getColorofFieldIcon8();

  })
  useEffect(()=>{
    getColorofFieldIcon2();
    getColorofFieldIcon3();
  })
  // useEffect(()=>{
  //   getColorofFieldIcon4();
  //   getColorofFieldIcon5();
  
  // })
  // useEffect(()=>{
   
  //   getColorofFieldIcon6();
  //   getColorofFieldIcon7();
  // })
 
  
  
  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

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
  //   useEffect(() => {
  //     props.passUncheckedList({ data: uncheckedValue });
  //   }, [uncheckedValue]);

  //   useEffect(() => {
  //     props.passCheckedList({ data: checkValue });
  //   }, [checkValue]);
  console.log("unchecked values", uncheckedValue);

  console.log(uncheckedValue.indexOf("developer"));

  const developerInputFiledColor = uncheckedValue.filter((obj) => {
    return obj.label === "Developer";
  });
  const developerInputCheckedFiledColor = checkValue.filter((obj) => {
    return obj.label === "Developer";
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
    return obj.label === "Name of individual Land owner/ land-owning company/ firm/ LLP etc.";
  });
  const developerInputCheckedFiledColor19 = checkValue.filter((obj) => {
    return obj.label === "Name of individual Land owner/ land-owning company/ firm/ LLP etc.";
  });

  console.log("color for the deeloper", developerInputFiledColor);
  console.log("icon color stats", iconStates);
  console.log("color for developers", colorOfDeveloperIcon)
  console.log("color for developers1", colorOfDeveloperIcon1)
  console.log("color for developers3", colorOfDeveloperIcon3)
  return (
    <Form.Group style={{ display: props.displayPersonal, border: "2px solid #e9ecef", margin: 5 }}>
      <Row className="ms-auto" style={{ marginTop: 20, marginBottom: 20 }}>
        <Col className="ms-auto" md={4} xxl lg="4">
          <div>
            <Form.Label>
              <h5>Developer &nbsp;</h5>
            </Form.Label>
            <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
          </div>
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.authorizedDeveloper : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color:
                  developerInputFiledColor.length > 0
                    ? developerInputFiledColor[0].color.data
                    : developerInputCheckedFiledColor.length > 0? 
                    developerInputCheckedFiledColor[0].color.data
                    :
                    colorOfDeveloperIcon
                
              }}
              onClick={() => {
                setLabelValue("Developer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
            <ModalChild
              labelmodal={labelValue}
              passmodalData={handlemodaldData}
              isYesorNoChecked={handleYesOrNochecked}
              displaymodal={smShow}
              setColor={setColor}
              // fieldValue={labelValue}
              fieldValue={fieldValue}
              remarksUpdate={currentRemarks}
            ></ModalChild>
          </div>
        </Col>
        <Col className="ms-auto" md={4} xxl lg="4">
          <Form.Label>
            {/* <b>Authorized Person Name</b> */}
            <h5>Authorized Person Name &nbsp;</h5>
          </Form.Label>
          <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              // placeholder={personalinfo.authorizedPerson}
              placeholder={personalinfo !== null ? personalinfo.authorizedPerson : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color:
                  developerInputFiledColor1.length > 0
                    ? developerInputFiledColor1[0].color.data
                    : developerInputCheckedFiledColor1.length > 0
                    ? developerInputCheckedFiledColor1[0].color.data
                    : 
                    colorOfDeveloperIcon1
              }}
              onClick={() => {
                setLabelValue("Authorized Person Name"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedPerson : null);
              }}
            ></ReportProblemIcon>
          </div>
          {/* <Form.Check
          value="Authorized Person Name"
          type="radio"
          id="default-radio"
          // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group1"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Authorized Person Name"
          type="radio"
          id="default-radio"
          // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group1"
          inline
        ></Form.Check> */}
        </Col>
        <Col className="ms-auto" md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Authorized Mobile No</b> */}
              <h5>Authorized Mobile No &nbsp;</h5>
            </Form.Label>
            <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
            {/* <ReportProblemIcon style={{ color: warningOrred }} onClick={() => setSmShow(true)}></ReportProblemIcon> */}
          </div>
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.authorizedmobile : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color:
                  developerInputFiledColor2.length > 0
                    ? developerInputFiledColor2[0].color.data
                    : developerInputCheckedFiledColor2.length > 0
                    ? developerInputCheckedFiledColor2[0].color.data
                    : 
                     colorOfDeveloperIcon2
              }}
              onClick={() => {
                setLabelValue("Autrhoized Mobile No"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedmobile : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      </Row>

      {/* <Collapse in={open}>
<div id="example-collapse-text"> */}
      <Row className="ms-auto" style={{ marginBottom: 20 }}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Authorized MobileNo. 2 </b> */}
              <h5>Authorized Mobile No. 2 &nbsp;</h5>
            </Form.Label>

            <span style={{ color: "red" }}>*</span>
          </div>
          {/* <Modal size="sm" show={smShow2} onHide={() => setSmShow2(false)} aria-labelledby="example-modal-sizes-title-sm">
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">Authorized MobileNo. 2</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {" "}
            <Form.Check
              value="Developer"
              onChange={(e) => {
                setCrosschecked(""), setNochecked(false), setwarningOrred("#09cb3d");
              }}
              type="radio"
              id="default-radio"
              // label={<CheckCircleIcon color="success"></CheckCircleIcon>}
              label="Yes"
              name="group0"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => {
                setCrosschecked(e.target.value), setNochecked(true), setwarningOrred("#ff0000");
              }}
              value="Developer"
              type="radio"
              id="default-radio"
              // label={<CancelIcon color="error" />}
              label="No"
              name="group0"
              inline
            ></Form.Check>
            <Col xs={8} md={4}>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Remarks</Form.Label>
                <Form.Control type="text" placeholder="" autoFocus onChange={(e) => setDeveloperRemarks(e.target.value)} />
              </Form.Group>
            </Col>
            <div class="col-md-4 bg-light text-right" style={{ position: "relative", marginBottom: 40 }}>
              <Button style={{ textAlign: "right" }} onClick={handlemodalsubmit}>
                Submit
              </Button>
            </div>
          </Modal.Body>
        </Modal> */}
          {/* <Form.Check
          value="Authorized Mobile No. 2"
          type="radio"
          id="default-radio"
          // label={<AiFillCheckCircle  class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group3"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Authorized Mobile No. 2"
          type="radio"
          id="default-radio"
          // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group3"
          inline
        ></Form.Check> */}

          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.alternatemobile : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color:
                  developerInputFiledColor3.length > 0
                    ? developerInputFiledColor3[0].color.data
                    : developerInputCheckedFiledColor3.length > 0
                    ? developerInputCheckedFiledColor3[0].color.data
                    : 
                    colorOfDeveloperIcon3
                    
              }}
              onClick={() => {
                setLabelValue("Authorized MobileNo. 2 "),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.alternatemobile : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>

        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Email ID</b> */}
              <h5>Email ID &nbsp;</h5>
            </Form.Label>
            <span style={{ color: "red" }}>*</span>
          </div>
          {/* <Form.Check
          value="Email ID"
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle  class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group4"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Email ID"
          type="radio"
          id="default-radio"
          label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group4"
          inline
        ></Form.Check> */}
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.authorizedEmail : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color:
                  developerInputFiledColor4.length > 0
                    ? developerInputFiledColor4[0].color.data
                    : developerInputCheckedFiledColor4.length > 0
                    ? developerInputCheckedFiledColor4[0].color.data
                    :  "#FFB602",
                    // colorOfDeveloperIcon4
                    
              }}
              onClick={() => {
                setLabelValue("Email ID"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedEmail : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>PAN No.</b> */}
              <h5>PAN No. &nbsp;</h5>
            </Form.Label>
            <span style={{ color: "red" }}>*</span>
          </div>
          {/* <Form.Check
          value="PAN No."
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group5"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="PAN No."
          type="radio"
          id="default-radio"
          label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group5"
          inline
        ></Form.Check> */}
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.authorizedPan : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color:
                  developerInputFiledColor5.length > 0
                    ? developerInputFiledColor5[0].color.data
                    : developerInputCheckedFiledColor5.length > 0
                    ? developerInputCheckedFiledColor5[0].color.data
                    :  "#FFB602",
                    // colorOfDeveloperIcon5
              }}
              onClick={() => {
                setLabelValue("PAN No."),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedPan : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      </Row>
      <Row className="ms-auto" style={{ marginBottom: 20 }}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Address 1</b> */}
              <h5>Address 1 &nbsp;</h5>
            </Form.Label>
            <span style={{ color: "red" }}>*</span>
          </div>
          {/* <Form.Check
          value="Address 1"
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle  class="fa fa-check text-success"size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group6"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Address 1"
          type="radio"
          id="default-radio"
          label={<AiFillCloseCircle class="fa fa-times text-danger"size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group6"
          inline
        ></Form.Check> */}
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.authorizedAddress : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color:
                  developerInputFiledColor6.length > 0
                    ? developerInputFiledColor6[0].color.data
                    : developerInputCheckedFiledColor6.length > 0
                    ? developerInputCheckedFiledColor6[0].color.data
                    :  "#FFB602",
                    // colorOfDeveloperIcon6
              }}
              onClick={() => {
                setLabelValue("Address  1"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedAddress : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Village/City</b> */}
              <h5>Village/City &nbsp;</h5>
            </Form.Label>
            <span style={{ color: "red" }}>*</span>
          </div>
          {/* <Form.Check
          value="Village/City."
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group7"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Village/City."
          type="radio"
          id="default-radio"
           label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group7"
          inline
        ></Form.Check> */}
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.village : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color:
                  developerInputFiledColor7.length > 0
                    ? developerInputFiledColor7[0].color.data
                    : developerInputCheckedFiledColor7.length > 0
                    ? developerInputCheckedFiledColor7[0].color.data
                    :  "#FFB602",
                    // colorOfDeveloperIcon7
              }}
              onClick={() => {
                setLabelValue("Village/City"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.village : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Pincode</b> */}
              <h5>Pincode &nbsp;</h5>
            </Form.Label>
            <span style={{ color: "red" }}>*</span>
          </div>
          {/* <Form.Check
          value="Pincode"
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group8"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Pincode"
          type="radio"
          id="default-radio"
          label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group8"
          inline
        ></Form.Check> */}
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.authorizedPinCode : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
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
                setLabelValue("Pincode"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedPinCode : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      </Row>
      <Row className="ms-auto" style={{ marginBottom: 20 }}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Tehsil</b>{" "} */}
              <h5>Tehsil &nbsp;</h5>
            </Form.Label>
            <span style={{ color: "red" }}>*</span>
          </div>
          {/* <Form.Check
          value="Tehsil"
          type="radio"
          id="default-radio"
           label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group9"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Tehsil"
          type="radio"
          id="default-radio"
          label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group9"
          inline
        ></Form.Check> */}
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.tehsil : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
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
                setLabelValue("Tehsil"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.tehsil : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>District</b> */}
              <h5>District &nbsp;</h5>
            </Form.Label>
            <span style={{ color: "red" }}>*</span>
          </div>
          {/* <Form.Check
          value="District"
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group10"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="District"
          type="radio"
          id="default-radio"
          label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group10"
          inline
        ></Form.Check> */}
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.district : null}
              disabled
            ></Form.Control>
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
                setLabelValue("District"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.district : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>State</b> */}
              <h5>State &nbsp;</h5>
            </Form.Label>
            <span style={{ color: "red" }}>*</span>
          </div>
          {/* <Form.Check
          value="State"
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group11"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="State"
          type="radio"
          id="default-radio"
          label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group11"
          inline
        ></Form.Check> */}
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.state : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
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
                setLabelValue("State"), setSmShow(true), console.log("modal open"), setFieldValue(personalinfo !== null ? personalinfo.state : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      </Row>
      <Row className="ms-auto" style={{ marginBottom: 20 }}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label data-toggle="tooltip" data-placement="top" title="Status (Individual/ Company/ Firm/ LLP etc.)">
              {/* <b>Individual/ Company/ LLP</b> */}
              <h5>Individual/ Company/ LLP &nbsp;</h5>
              {/* <InfoIcon /> */}
            </Form.Label>
          </div>
          {/* <Form.Check
          value="Status (Individual/ Company/ Firm/ LLP etc.)"
          type="radio"
          id="default-radio"
          
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group12"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Status (Individual/ Company/ Firm/ LLP etc.)"
          type="radio"
          id="default-radio"
         
          label={<CancelIcon color="error" />}
          name="group12"
          inline
        ></Form.Check> */}
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.status : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
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
                setLabelValue("Status (Individual/ Company/ Firm/ LLP etc.)"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.status : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>LC-I signed by</b>{" "} */}
              <h5>LC-I signed by &nbsp;</h5>
            </Form.Label>
          </div>
          {/* <Form.Check
          value="LC-I signed by"
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group13"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="LC-I signed by"
          type="radio"
          id="default-radio"
           label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group13"
          inline
        ></Form.Check> */}
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              // placeholder={personalinfo !== null ? personalinfo.status : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
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
                setLabelValue("LC-I signed by"), setSmShow(true), console.log("modal open");
                // setFieldValue(personalinfo !== null ? personalinfo.status : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label
              data-toggle="tooltip"
              data-placement="top"
              title="If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)"
            >
              {/* <b> LC-I is not signed</b> */}
              <h5>LC-I is not signed &nbsp;</h5>
              {/* <InfoIcon /> */}
            </Form.Label>
          </div>
          {/* <Form.Check
          value="If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)"
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group14"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)"
          type="radio"
          id="default-radio"
           label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group14"
          inline
        ></Form.Check> */}
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.LC : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
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
                setLabelValue("If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.LC : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      </Row>
      <Row className="ms-auto" style={{ marginBottom: 20 }}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label
              data-toggle="tooltip"
              data-placement="top"
              title="Permanent address in case of individual/ registered office address in case other than individual"
            >
              {/* <b>Permanent Address </b> */}
              <h5>Permanent Address &nbsp;</h5>
              {/* <InfoIcon /> */}
            </Form.Label>
          </div>
          {/* <Form.Check
          value="Permanent address in case of individual/ registered office address in case other than individual"
          type="radio"
          id="default-radio"
           label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group15"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Permanent address in case of individual/ registered office address in case other than individual"
          type="radio"
          id="default-radio"
          label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group15"
          inline
        ></Form.Check> */}
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.address : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
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
                setLabelValue("Permanent address in case of individual/ registered office address in case other than individual"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.address : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Address for communication</b> */}
              <h5>Address for communication &nbsp;</h5>
            </Form.Label>
          </div>
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.permanentAddress : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
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
                setLabelValue("Address for communication"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.permanentAddress : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label data-toggle="tooltip" data-placement="top" title="Name of the authorized person to sign the application">
              <h5>Authorized person &nbsp;</h5>
            </Form.Label>
          </div>

          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.notSigned : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
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
                setLabelValue("Name of the authorized person to sign the application"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.notSigned : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      </Row>
      <Row className="ms-auto" style={{ marginBottom: 20 }}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Email ID for communication</b> */}
              <h5>Email ID for communication &nbsp;</h5>
            </Form.Label>
          </div>

          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.email : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
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
                setLabelValue("Email ID for communication"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.email : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        {/* <Col md={4} xxl lg="4">
          <div>
            <Form.Label data-toggle="tooltip" data-placement="top" title="Name of individual Land owner/ land-owning company/ firm/ LLP etc.">
              
              <h5>individual Land owner &nbsp;</h5>
              
            </Form.Label>
          </div>
         
          <div style={{ display: "flex" }}>
            <Form.Control
              style={{ maxWidth: 200, marginRight: 5, height: 30 }}
              placeholder={personalinfo !== null ? personalinfo.authorized : null}
              disabled
            ></Form.Control>
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
                setLabelValue("Name of individual Land owner/ land-owning company/ firm/ LLP etc."),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorized : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col> */}
      </Row>
    </Form.Group>
  );
};

export default PersonalinfoChild;
