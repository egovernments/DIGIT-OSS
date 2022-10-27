import React, { useState, useRef, useEffect } from "react";
import Personalinfo from "./Personalinfo";
import Genarelinfo from "./Generalinfo";
import Developerinfo from "./Developerinfo";
import AppliedLandinfo from "./AppliedLand";
import Feeandcharges from "./Feeandcharges";
// import JeLandinfo from "./Scrutiny LOI/JE/JE";
import DisApprovalList from "./DisApprovalList";
// import HistoryList from "./History";
import ScrutinyDevelopment from "./ScrutinyDevelopment/ScrutinyDevelopment";
import { Button, Row, Col } from "react-bootstrap";
// import AddIcon from "@mui/icons-material/Add";

const ScrutitnyForms = () => {
  const personalInfoRef = useRef();
  const generalInfoRef = useRef();
  const developerInfoRef = useRef();
  const appliedInfoRef = useRef();
  const feeandchargesInfoRef = useRef();
  const [purpose, setPurpose] = useState("");
  const jeLandInfoRef = useRef();

  const [displayPersonal, setDisplayPersonalInfo] = useState([]);
  const [displayPersonalCHeckedList, setDisplayCheckedPersonalList] = useState([]);
  const [displayGeneralCHeckedList, setDisplayCheckedGeneralList] = useState([]);
  const [displayPurpose, setDisplayPurposeInfo] = useState([]);
  const [displayGeneral, setDisplayGeneralInfo] = useState([]);
  const [displayAppliedLand, setDisplayAppliedLandInfo] = useState([]);
  const [displayFeeandCharges, setDisplayFeeandChargesInfo] = useState([]);
  const [displayJeLand, setDisplayJeLand] = useState([]);
  const [ActiveKey, setActiveKey] = useState(1);
  const [defaultHeightPersonal, setDefaultHeightPersonal] = useState(0);
  const [defaultHeightGen, setDefaultHeightGen] = useState(120);
  const [defaultheightDevelper, setDefaultheightDevelper] = useState(0);
  const [defaultheightApplied, setDefaultheightApplied] = useState(0);
  const [defaultheightFee, setDefaultheightFee] = useState(0);
  const [open, setOpen] = useState(false);

  const [uncheckedValue, setUncheckedVlue] = useState([]);

  const getUncheckedPersonalinfos = (data) => {
    setDisplayPersonalInfo(data.data);
    console.log("data parent label", data);
  };
  const getCheckedPersonalInfoValue = (data) => {
    setDisplayCheckedPersonalList(data.data);
    console.log("checked parent personal info data", data);
  };

  const getUncheckedPurposeinfos = (data) => {
    setDisplayPurposeInfo(data.data);
    console.log(data);
  };
  const getUncheckedGeneralinfos = (data) => {
    setPurpose(data.purpose);
    setDisplayGeneralInfo(data.data);
    // console.log("abc", data);
    console.log(data);
  };
  const getCheckedGeneralInfoValue = (data) => {
    setDisplayCheckedGeneralList(data.data);
    console.log("checked parent General info data", data);
  };
  const getUncheckedAppliedLandInfo = (data) => {
    setDisplayAppliedLandInfo(data.data);
    console.log(data);
  };
  const getUncheckedFeeandChargesInfo = (data) => {
    setDisplayFeeandChargesInfo(data.data);
    console.log(data);
  };
  // const getUncheckedJeLandInfo = (data) => {
  //   setDisplayJeLand(data.data);
  //   console.log(data);
  // };

  console.log(uncheckedValue);
  console.log("React", purpose);

  const ApllicantFormHandler = (data) => {
    setActiveKey(2);
  };
  const PuposeformHandler = (data) => {
    setActiveKey(3);
  };
  const LandFormHandler = (data) => {
    setActiveKey(4);
  };
  const AppliedDetailFormHandler = (data) => {
    setActiveKey(5);
  };

  const handleScrolltoPersonal = () => {
    // personalInfoRef.current.scrollIntoView({ behavior: "smooth" });
    if (defaultHeightPersonal === 0) {
      setDefaultHeightPersonal("auto");
    } else {
      setDefaultHeightPersonal(0);
    }
  };

  const handleScrolltOGeneral = () => {
    // generalInfoRef.current.scrollIntoView({ behavior: "smooth" });
    if (defaultHeightGen === 0) {
      setDefaultHeightGen("auto");
    } else {
      setDefaultHeightGen(0);
    }
  };
  const handleScrolltoDeveloper = () => {
    // developerInfoRef.current.scrollIntoView({ behavior: "smooth" });
    if (defaultheightDevelper === 0) {
      setDefaultheightDevelper("auto");
    } else {
      setDefaultheightDevelper(0);
    }
  };

  const handleScrolltoAppliedLandInfo = () => {
    // appliedInfoRef.current.scrollIntoView({ behavior: "smooth" });
    if (defaultheightApplied === 0) {
      setDefaultheightApplied("auto");
    } else {
      setDefaultheightApplied(0);
    }
  };
  const handleScrolltoFeeandChargesInfo = () => {
    // feeandchargesInfoRef.current.scrollIntoView({ behavior: "smooth" });
    if (defaultheightFee === 0) {
      setDefaultheightFee("auto");
    } else {
      setDefaultheightFee(0);
    }
  };
  //   const handleScrolltoJeLandInfo = () => {
  //     jeLandInfoRef.current.scrollIntoView({ behavior: "smooth" });
  //   };

  // const disapprovalilIst = (

  // );
  // useEffect(() => {
  //   return disapprovalilIst;
  // }, [displayPurpose, displayAppliedLand, displayFeeandCharges, displayPersonal, displayGeneral]);
  // console.log("asddg", displayPersonal);

  return (
    <div>
      <div style={{ position: "relative", maxWidth: "100%", padding: 2 }}>
        {/* <div style={{ position: "relative", minWidth: "10%", height: 380, padding: 10, display: "inline-grid" }}>
          <Button onClick={handleScrolltoPersonal} style={{ height: 50, marginBottom: 10 }}>
            Step 1
          </Button>
          <Button onClick={handleScrolltOGeneral} style={{ height: 50, marginBottom: 10 }}>
            Step 2
          </Button>
          <Button onClick={handleScrolltoDeveloper} style={{ height: 50, marginBottom: 10 }}>
            Step 3
          </Button>
          <Button onClick={handleScrolltoAppliedLandInfo} style={{ height: 50, marginBottom: 10 }}>
            Step 4
          </Button>
          <Button onClick={handleScrolltoFeeandChargesInfo} style={{ height: 50, marginBottom: 10 }}>
            Step 5
          </Button>
        </div> */}

        {/* {ActiveKey == 1 ? (
          <Personalinfo personalInfoRef={ApllicantFormHandler}></Personalinfo>
        ) : ActiveKey == 2 ? (
          <Genarelinfo generalInfoRef={PuposeformHandler}></Genarelinfo>
        ) : ActiveKey == 3 ? (
          <Developerinfo developerInfoRef={LandFormHandler}></Developerinfo>
        ) : ActiveKey == 4 ? (
          <AppliedLandinfo appliedLandInfoRef={AppliedDetailFormHandler}></AppliedLandinfo>
        ) : (
          <div></div>
        )} */}
        <div
        // style={{
        //   position: "relative",
        //   width: "100%",
        //   padding: 5,
        //   height: "100%",
        //   overflowY: "auto",
        //   borderStyle: "solid",
        //   borderWidth: 1,
        //   borderColor: "black",
        // }}
        >
          <div>
            {/* <Col class="col-12">
              <Button
                className="d-block"
                onClick={handleScrolltoPersonal}
                style={{
                  background: "#007bff",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.35rem 0.5rem",
                  borderRadius: "0.2rem",
                  color: "#fff",
                }}
              >
                Applicant info
                <AddIcon style={{ textAlign: "rightend", width: "70em" }}></AddIcon>
              </Button>
            </Col> */}

            <Personalinfo
              personalInfoRef={personalInfoRef}
              passUncheckedList={getUncheckedPersonalinfos}
              passCheckedList={getCheckedPersonalInfoValue}
              // heightPersonal={defaultHeightPersonal}
              onClick={() => setOpen(!open)}
            ></Personalinfo>
          </div>
          <div>
            {/* <Col class="col-12">
              <Button
                onClick={handleScrolltOGeneral}
                style={{
                  background: "#007bff",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.35rem 0.5rem",
                  borderRadius: "0.2rem",
                  color: "#fff",
                }}
              >
                Applicant Puropse
                <AddIcon style={{ textAlign: "rightend", width: "68em" }}></AddIcon>
              </Button> */}
            <Genarelinfo
              generalInfoRef={generalInfoRef}
              passUncheckedList={getUncheckedGeneralinfos}
              passCheckedList={getCheckedGeneralInfoValue}
              // heightGen={defaultHeightGen}
              onClick={() => setOpen(!open)}
            ></Genarelinfo>
            {/* </Col> */}
          </div>

          <div>
            {/* <Col class="col-12">
              <Button
                onClick={handleScrolltoDeveloper}
                style={{
                  background: "#007bff",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.35rem 0.5rem",
                  borderRadius: "0.2rem",
                  color: "#fff",
                }}
              >
                Details of Applied Land
                <AddIcon style={{ textAlign: "rightend", width: "66em" }}></AddIcon>
              </Button> */}
            <Developerinfo
              developerInfoRef={developerInfoRef}
              passUncheckedList={getUncheckedPurposeinfos}
              heightDevelper={defaultheightDevelper}
            ></Developerinfo>
            {/* </Col> */}
          </div>
          <div>
            {/* <Col class="col-12">
              <Button
                onClick={handleScrolltoAppliedLandInfo}
                style={{
                  background: "#007bff",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.35rem 0.5rem",
                  borderRadius: "0.2rem",
                  color: "#fff",
                }}
              >
                Geographical Specifications
                <AddIcon style={{ textAlign: "rightend", width: "64em" }}></AddIcon>
              </Button> */}
            <AppliedLandinfo
              appliedInfoRef={appliedInfoRef}
              purpose={purpose}
              passUncheckedList={getUncheckedAppliedLandInfo}
              heightApplied={defaultheightApplied}
            ></AppliedLandinfo>
            {/* </Col> */}
          </div>
          <div>
            {/* <Col class="col-12">
              <Button
                onClick={handleScrolltoFeeandChargesInfo}
                style={{
                  background: "#007bff",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.35rem 0.5rem",
                  borderRadius: "0.2rem",
                  color: "#fff",
                }}
              >
                Fee and charges
                <AddIcon style={{ textAlign: "rightend", width: "70em" }}></AddIcon>
              </Button> */}
            <Feeandcharges
              feeandchargesInfoRef={feeandchargesInfoRef}
              passUncheckedList={getUncheckedFeeandChargesInfo}
              heightFee={defaultheightFee}
            ></Feeandcharges>
            {/* </Col> */}
          </div>

          {/* <JeLandinfo jeLandInfoRef={jeLandInfoRef} passUncheckedList={getUncheckedJeLandInfo}></JeLandinfo> */}
        </div>
      </div>
      <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
        <DisApprovalList
          disapprovallistDeveloper={displayPurpose}
          disapprovallistGeneral={displayGeneral}
          disapprovallistAppliedLand={displayAppliedLand}
          disapprovallistPersonal={displayPersonal}
          disapprovalCheckedPersonal={displayPersonalCHeckedList}
          disapprovalCheckedGeneral={displayGeneralCHeckedList}
          DisApprovalListFeeandCharges={displayFeeandCharges}
        ></DisApprovalList>
        {/* <HistoryList></HistoryList> */}
      </div>
      <div style={{ position: "relative", width: "100%", height: "50%", display: "flex" }}>
        <ScrutinyDevelopment></ScrutinyDevelopment>
      </div>
    </div>
  );
};

export default ScrutitnyForms;
