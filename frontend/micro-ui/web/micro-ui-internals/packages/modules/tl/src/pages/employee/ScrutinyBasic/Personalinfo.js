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
import PersonalinfoChild from "./PersonalinfoChild";
import CapacityScrutiny from "../ScrutinyBasic/Developer/CapacityScrutiny";
import DocumentScrutiny from "./Developer/DocumentScrutiny";
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

  const iconStates = props.dataForIcons
  const applicantInfoPersonal = props.ApiResponseData;
  const applicationStatus = props.applicationStatus ;
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
    <Form
      ref={props.personalInfoRef}

    >

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
            <span style={{ color: "#817f7f", fontSize: 14 }} className="">
              - Applicant info
            </span>
            {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open2}>
            <div id="example-collapse-text" style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}>
              <PersonalinfoChild
                iconColorState={iconStates}
                showTable={currentRemarklifo}
                personalinfo={applicantInfoPersonal !== null ? applicantInfoPersonal : null}
                displayPersonal={open2 ? "block" : "none"}
                applicationStatus={applicationStatus}
              />
            </div>
          </Collapse>
          {/* <LicenseDetailsScrutiny
            iconColorState={iconStates}
            showTable={currentRemarklifo}
            addInfo={applicantInfoPersonal?.devDetail?.addInfo ? applicantInfoPersonal?.devDetail?.addInfo : null}
            displayPersonal={open2 ? "block" : "none"}
          /> */}
          <CapacityScrutiny
            iconColorState={iconStates}
            showTable={currentRemarklifo}
            capacityScrutinyInfo={applicantInfoPersonal?.devDetail?.capacityDevelopAColony ? applicantInfoPersonal?.devDetail?.capacityDevelopAColony : null}
            addInfo={applicantInfoPersonal?.devDetail?.addInfo ? applicantInfoPersonal?.devDetail?.addInfo : null}
            displayPersonal={open2 ? "block" : "none"}
            applicationStatus={applicationStatus}
          />
          {/* <DocumentScrutiny 
          /> */}
          <DocumentScrutiny
            iconColorState={iconStates}
            showTable={currentRemarklifo}
            devDetail={applicantInfoPersonal?.devDetail ?  applicantInfoPersonal?.devDetail : null}
            displayPersonal={open2 ? "block" : "none"}
            applicationStatus={applicationStatus}
          />
        </div>
      </Collapse>
      {/* </Card> */}
    </Form>
  );
};

export default Personalinfo;
