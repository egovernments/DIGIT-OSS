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
import PersonalinfoChild from "./PersonalinfoChild";
// import LicenseDetailsScrutiny from "../ScrutinyBasic/Developer/LicenseDetailsScrutiny";
// import CapacityScrutiny from "../ScrutinyBasic/Developer/CapacityScrutiny";
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
  console.log("unchecked values", uncheckedValue);

  console.log(uncheckedValue.indexOf("developer"));

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
    return obj.label === "Name of individual Land owner/ land-owning company/ firm/ LLP etc.";
  });
  const developerInputCheckedFiledColor19 = checkValue.filter((obj) => {
    return obj.label === "Name of individual Land owner/ land-owning company/ firm/ LLP etc.";
  });

  // const developerInputFiledColor1 = modaldData.label === "Authorized Person Name" ? modaldData.color : { data: "#FFB602" }; //change the white color to default color
  // const developerInputFiledColor3 = modaldData.label === "Authorized MobileNo. 2" ? modaldData.color : { data: "#FFB602" };
  // const developerInputFiledColor2 = modaldData.label === "Authorized Mobile No" ? modaldData.color : { data: "#FFB602" };
  // const developerInputFiledColor4 = modaldData.label === "Email ID" ? modaldData.color : { data: "#FFB602" };
  // const developerInputFiledColor5 = modaldData.label === "PAN No." ? modaldData.color : { data: "#FFB602" };
  // const developerInputFiledColor6 = modaldData.label === "Address 1" ? modaldData.color : { data: "#FFB602" };
  // const developerInputFiledColor7 = modaldData.label === "Village/City" ? modaldData.color : { data: "#FFB602" };

  // const developerInputFiledColor8 = modaldData.label === "Pincode" ? modaldData.color : { data: "#FFB602" };
  // const developerInputFiledColor9 = modaldData.label === "Tehsil" ? modaldData.color : { data: "#FFB602" };
  // const developerInputFiledColor10 = modaldData.label === "District" ? modaldData.color : { data: "#FFB602" };
  // const developerInputFiledColor11 = modaldData.label === "State" ? modaldData.color : { data: "#FFB602" };
  // const developerInputFiledColor12 = modaldData.label === "Status (Individual/ Company/ Firm/ LLP etc.)" ? modaldData.color : { data: "#FFB602" };
  // const developerInputFiledColor13 = modaldData.label === "LC-I signed by" ? modaldData.color : { data: "#FFB602" };
  // const developerInputFiledColor14 =
  //   modaldData.label === "If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)"
  //     ? modaldData.color
  //     : { data: "#FFB602" };
  // const developerInputFiledColor15 =
  //   modaldData.label === "Permanent address in case of individual/ registered office address in case other than individual"
  //     ? modaldData.color
  //     : { data: "#FFB602" };
  // const developerInputFiledColor16 = modaldData.label === "Address for communication" ? modaldData.color : { data: "#FFB602" };
  // const developerInputFiledColor17 =
  //   modaldData.label === "Name of the authorized person to sign the application" ? modaldData.color : { data: "#FFB602" };
  // const developerInputFiledColor18 = modaldData.label === "Email ID for communication" ? modaldData.color : { data: "#FFB602" };
  // const developerInputFiledColor19 =
  //   modaldData.label === "Name of individual Land owner/ land-owning company/ firm/ LLP etc." ? modaldData.color : { data: "#FFB602" };

  console.log("color for the deeloper", developerInputFiledColor);

  return (
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
      <div>
        <Col class="col-12">
          <Button
            style={{
              marginBottom: 3,
              width: "inherit",
              textAlign: "inherit",
              padding: "0.25rem 1rem",
              fontWeight: "Bold",
              backgroundColor: "#c2c4c7",
              border: "none",
              color: "unset",
              // borderColor: "#C3C3C3",
              // borderStyle: "solid",
              // borderWidth: 2,
            }}
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
          >
            Applicant info
            <AddIcon style={{ width: "67em" }}></AddIcon>
          </Button>
        </Col>
      </div>

      {/* <div style={{ width:"100%" , height:40, padding:2,}}>
    <Button onClick={() =>props.Personalinfo({data:true})} style={{ width:"100%" , height:"100%"}}>Step-1</Button>
    </div> */}
      {/* <Card
        style={{
          width: "100%",
          height: props.heightPersonal,
          overflow: "hidden",
          marginBottom: 20,
          borderColor: "#C3C3C3",
          borderStyle: "solid",
          borderWidth: 2,
          padding: 2,
        }}
      > */}
      <Collapse in={open}>
        <div id="example-collapse-text">
          <div>
            <Col class="col-12">
              <Button
                style={{
                  marginBottom: 3,
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
                Personal info
                <AddIcon style={{ width: "67.6em" }}></AddIcon>
              </Button>
            </Col>
          </div>

          {/* </div>
      </Collapse> */}
          <Collapse in={open2}>
            <div id="example-collapse-text" style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}>
              <PersonalinfoChild
                personalinfo={applicantInfoPersonal !== null ? applicantInfoPersonal : null}
                displayPersonal={open2 ? "block" : "none"}
              />

              {/* <hr></hr> */}
              {/* </Card> */}
            </div>
          </Collapse>
          {/* <LicenseDetailsScrutiny />
          <CapacityScrutiny /> */}
        </div>
      </Collapse>
    </Form>
  );
};

export default Personalinfo;
